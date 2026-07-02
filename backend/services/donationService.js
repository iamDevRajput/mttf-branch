const crypto = require("crypto");
const Donation = require("../models/Donation");
const cashfreeService = require("./cashfreeService");
const { getTransporter } = require("./emailService");
const AppError = require("../utils/AppError");

const generateDonationId = () => {
  const suffix = crypto.randomBytes(6).toString("hex").toUpperCase();
  return `MTTF_DON_${Date.now()}_${suffix}`;
};

const getFrontendUrl = () => process.env.FRONTEND_URL || "http://localhost:5173";
const getWebhookUrl = () => process.env.CASHFREE_WEBHOOK_URL ||
  (process.env.BACKEND_URL ? `${process.env.BACKEND_URL.replace(/\/$/, "")}/api/donations/webhook` : undefined);

const createDonationOrder = async ({ donorName, donorEmail, donorPhone, amount, message, donationCategory }) => {
  const parsedAmount = Number(amount);
  if (!parsedAmount || parsedAmount < 1) throw new AppError(400, "Invalid donation amount.");
  if (!donorName || !donorEmail || !donorPhone) throw new AppError(400, "Donor name, email and phone are required.");

  const donationId = generateDonationId();
  const frontendUrl = getFrontendUrl().replace(/\/$/, "");

  const donation = await Donation.create({
    donationId,
    donorName,
    donorEmail,
    donorPhone,
    amount: parsedAmount,
    message: message || "",
    donationCategory: donationCategory || "General Fund",
    paymentStatus: "PENDING",
  });

  try {
    const cashfreeOrder = await cashfreeService.createOrder({
      orderId: donationId,
      amount: parsedAmount,
      currency: "INR",
      user: {
        _id: donorEmail,
        name: donorName,
        email: donorEmail,
        phone: donorPhone,
      },
      returnUrl: `${frontendUrl}/donation/status?order_id={order_id}`,
      notifyUrl: getWebhookUrl(),
    });

    if (!cashfreeOrder.payment_session_id) throw new AppError(502, "Cashfree did not return a payment session.");

    await Donation.findOneAndUpdate({ donationId }, {
      paymentSessionId: cashfreeOrder.payment_session_id,
      cashfreeOrderStatus: cashfreeOrder.order_status,
    });

    return {
      donationId,
      paymentSessionId: cashfreeOrder.payment_session_id,
      amount: parsedAmount,
      cashfreeEnvironment: cashfreeService.getCashfreeConfig().environment,
    };
  } catch (error) {
    await Donation.findOneAndUpdate({ donationId }, { paymentStatus: "FAILED" });
    throw error;
  }
};

const getDonationStatus = async (donationId) => {
  const donation = await Donation.findOne({ donationId });
  if (!donation) throw new AppError(404, "Donation not found.");
  return donation;
};

const verifyDonationWithGateway = async ({ donationId }) => {
  const donation = await Donation.findOne({ donationId }).select("+gatewayResponse");
  if (!donation) throw new AppError(404, "Donation not found.");

  const [cashfreeOrder, cashfreePayments] = await Promise.all([
    cashfreeService.fetchOrder(donationId),
    cashfreeService.fetchOrderPayments(donationId),
  ]);

  const latestPayment = Array.isArray(cashfreePayments)
    ? cashfreePayments.sort((a, b) => new Date(b.payment_time || 0) - new Date(a.payment_time || 0))[0]
    : null;

  const rawStatus = latestPayment?.payment_status || cashfreeOrder?.order_status || "";
  const status = String(rawStatus).toUpperCase();
  let nextStatus = "PENDING";
  if (["SUCCESS", "PAID", "PAYMENT_SUCCESS"].some(k => status.includes(k))) nextStatus = "SUCCESS";
  else if (["FAILED", "EXPIRED"].some(k => status.includes(k))) nextStatus = "FAILED";
  else if (["CANCEL", "USER_DROPPED"].some(k => status.includes(k))) nextStatus = "CANCELLED";

  const gatewayAmount = Number(latestPayment?.payment_amount || cashfreeOrder?.order_amount || donation.amount);
  if (gatewayAmount !== Number(donation.amount)) nextStatus = "FAILED";

  const updated = await Donation.findOneAndUpdate(
    { donationId },
    {
      paymentStatus: nextStatus,
      cfPaymentId: latestPayment?.cf_payment_id || donation.cfPaymentId,
      cashfreeOrderStatus: cashfreeOrder?.order_status,
    },
    { new: true },
  );

  if (nextStatus === "SUCCESS" && !donation.receiptSent) {
    try {
      await sendDonationReceipt(updated);
      await Donation.findOneAndUpdate({ donationId }, { receiptSent: true });
    } catch (e) {
      console.error("Receipt email failed:", e.message);
    }
  }

  return updated;
};

const sendDonationReceipt = async (donation) => {
  const transporter = getTransporter();
  if (!transporter) return;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: donation.donorEmail,
    subject: `MTTF Donation Receipt — ${donation.donationId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#f8faff;border:1px solid #e2e8f0;">
        <h2 style="color:#0b1329;margin-bottom:4px;">Thank You for Your Donation!</h2>
        <p style="color:#475569;margin-bottom:24px;">MathTech Thinking Foundation acknowledges your generous contribution.</p>
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin-bottom:24px;">
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;">
            <span style="color:#64748b;font-size:13px;">Donation ID</span>
            <strong style="color:#0b1329;font-size:13px;">${donation.donationId}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;">
            <span style="color:#64748b;font-size:13px;">Donor Name</span>
            <strong style="color:#0b1329;font-size:13px;">${donation.donorName}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;">
            <span style="color:#64748b;font-size:13px;">Category</span>
            <strong style="color:#0b1329;font-size:13px;">${donation.donationCategory || "General Fund"}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;">
            <span style="color:#64748b;font-size:13px;">Amount</span>
            <strong style="color:#2563eb;font-size:18px;">₹${Number(donation.amount).toLocaleString("en-IN")}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;">
            <span style="color:#64748b;font-size:13px;">Date</span>
            <strong style="color:#0b1329;font-size:13px;">${new Date(donation.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</strong>
          </div>
        </div>
        <div style="background:linear-gradient(135deg,rgba(37,99,235,0.06),rgba(37,99,235,0.02));border:1px solid rgba(37,99,235,0.12);border-radius:8px;padding:16px;margin-bottom:20px;">
          <p style="color:#0b1329;font-size:13px;font-weight:600;margin-bottom:6px;">Tax Benefit Information</p>
          <p style="color:#475569;font-size:12px;line-height:1.6;">MathTech Thinking Foundation is registered under <strong>Section 12AB</strong> and approved under <strong>Section 80G</strong> of the Income Tax Act, 1961. Eligible donations may qualify for tax deductions under applicable provisions.</p>
        </div>
        <p style="color:#94a3b8;font-size:12px;text-align:center;">This is your official donation receipt. Please keep it for your records.</p>
      </div>
    `,
  });
};

const handleDonationWebhook = async ({ req }) => {
  const signature = req.get("x-webhook-signature");
  const timestamp = req.get("x-webhook-timestamp");
  const rawBody = req.rawBody;

  if (!cashfreeService.verifyWebhookSignature({ rawBody, signature, timestamp })) {
    throw new AppError(401, "Invalid webhook signature.");
  }

  const body = req.body;
  const order = body?.data?.order || body?.order || {};
  const payment = body?.data?.payment || body?.payment || {};
  const donationId = order.order_id || body?.order_id;
  const eventId = body?.event_id || crypto.createHash("sha256").update(rawBody || JSON.stringify(body)).digest("hex");

  const donation = await Donation.findOne({ donationId }).select("+processedWebhookKeys");
  if (!donation) return { duplicate: false, status: "NOT_FOUND" };

  if (donation.processedWebhookKeys.includes(eventId)) {
    return { duplicate: true, status: donation.paymentStatus };
  }

  const rawStatus = payment.payment_status || order.order_status || "";
  const status = String(rawStatus).toUpperCase();
  let nextStatus = "PENDING";
  if (["SUCCESS", "PAID", "PAYMENT_SUCCESS"].some(k => status.includes(k))) nextStatus = "SUCCESS";
  else if (["FAILED", "EXPIRED"].some(k => status.includes(k))) nextStatus = "FAILED";
  else if (["CANCEL", "USER_DROPPED"].some(k => status.includes(k))) nextStatus = "CANCELLED";

  const gatewayAmount = Number(payment.payment_amount || order.order_amount || donation.amount);
  if (gatewayAmount !== Number(donation.amount)) nextStatus = "FAILED";

  const updated = await Donation.findOneAndUpdate(
    { donationId },
    {
      paymentStatus: nextStatus,
      webhookVerified: true,
      cfPaymentId: payment.cf_payment_id || donation.cfPaymentId,
      $addToSet: { processedWebhookKeys: eventId },
    },
    { new: true },
  );

  if (nextStatus === "SUCCESS" && !donation.receiptSent) {
    try {
      await sendDonationReceipt(updated);
      await Donation.findOneAndUpdate({ donationId }, { receiptSent: true });
    } catch (e) {
      console.error("Receipt email failed:", e.message);
    }
  }

  return { duplicate: false, status: nextStatus };
};

module.exports = {
  createDonationOrder,
  getDonationStatus,
  verifyDonationWithGateway,
  handleDonationWebhook,
};
