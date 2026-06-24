const crypto = require("crypto");
const Payment = require("../models/Payment");
const AppError = require("../utils/AppError");
const cashfreeService = require("./cashfreeService");
const membershipService = require("./membershipService");
const paymentRepository = require("../repositories/paymentRepository");
const membershipConfigRepository = require("../repositories/membershipConfigRepository");

const PAYMENT_SESSION_TTL_MINUTES = 30;

const getClientContext = (req) => ({
  ipAddress: req.ip,
  userAgent: req.get("user-agent"),
});

const generateOrderId = () => {
  const suffix = crypto.randomBytes(6).toString("hex").toUpperCase();
  return `MTTF_${Date.now()}_${suffix}`;
};

const mapGatewayStatus = (rawStatus, eventType) => {
  const status = String(rawStatus || eventType || "").toUpperCase();

  if (["SUCCESS", "PAID", "PAYMENT_SUCCESS"].some((key) => status.includes(key))) {
    return "SUCCESS";
  }
  if (["REFUND", "REFUNDED"].some((key) => status.includes(key))) {
    return "REFUNDED";
  }
  if (["CANCEL", "USER_DROPPED", "TERMINATED"].some((key) => status.includes(key))) {
    return "CANCELLED";
  }
  if (["FAILED", "EXPIRED", "FLAGGED", "VOID"].some((key) => status.includes(key))) {
    return "FAILED";
  }

  return "PENDING";
};

const getFrontendUrl = () => process.env.FRONTEND_URL || "http://localhost:5173";

const getWebhookUrl = () => (
  process.env.CASHFREE_WEBHOOK_URL ||
  (process.env.BACKEND_URL ? `${process.env.BACKEND_URL.replace(/\/$/, "")}/api/payments/webhook` : undefined)
);

const redactGatewayResponse = (response) => {
  if (!response || typeof response !== "object") {
    return response;
  }
  const clone = { ...response };
  delete clone.payment_session_id;
  return clone;
};

const getPublicMembershipConfig = async () => {
  const prices = await membershipConfigRepository.getPriceMap();
  return {
    prices,
    currency: "INR",
  };
};

const createPaymentOrder = async ({ user, req }) => {
  const context = getClientContext(req);

  if (user.isMembershipPaid) {
    throw new AppError(409, "Membership is already active.");
  }

  const reusablePayment = await paymentRepository.findReusablePendingPayment(user._id);
  if (reusablePayment?.paymentSessionId) {
    await paymentRepository.appendAuditLog(reusablePayment.orderId, {
      event: "ORDER_REUSED",
      status: "PENDING",
      message: "Reusable pending payment session returned to user.",
      ...context,
    });

    return {
      orderId: reusablePayment.orderId,
      paymentSessionId: reusablePayment.paymentSessionId,
      amount: reusablePayment.amount,
      currency: reusablePayment.currency,
      membershipType: reusablePayment.membershipType,
      paymentStatus: reusablePayment.paymentStatus,
      cashfreeEnvironment: cashfreeService.getCashfreeConfig().environment,
    };
  }

  const membershipType = user.membershipType || "individual";
  const config = await membershipConfigRepository.getActiveConfig(membershipType);
  if (!config) {
    throw new AppError(400, "Membership pricing is not active for this user type.");
  }

  const orderId = generateOrderId();
  const payment = await paymentRepository.createPayment({
    orderId,
    userId: user._id,
    userName: user.name,
    userEmail: user.email,
    amount: config.amount,
    currency: config.currency,
    membershipType,
    paymentStatus: "PENDING",
    expiresAt: new Date(Date.now() + PAYMENT_SESSION_TTL_MINUTES * 60 * 1000),
    auditLogs: [{
      event: "ORDER_CREATED",
      status: "PENDING",
      message: "Backend-created payment order initialized.",
      ...context,
      metadata: { amount: config.amount, currency: config.currency, membershipType },
    }],
  });

  try {
    const frontendUrl = getFrontendUrl().replace(/\/$/, "");
    const cashfreeOrder = await cashfreeService.createOrder({
      orderId,
      amount: config.amount,
      currency: config.currency,
      user,
      returnUrl: `${frontendUrl}/payment/status?order_id={order_id}`,
      notifyUrl: getWebhookUrl(),
    });

    if (!cashfreeOrder.payment_session_id) {
      throw new AppError(502, "Cashfree did not return a payment session.");
    }

    await paymentRepository.updatePayment(orderId, {
      paymentSessionId: cashfreeOrder.payment_session_id,
      cashfreeOrderStatus: cashfreeOrder.order_status,
      gatewayResponse: redactGatewayResponse(cashfreeOrder),
      $push: {
        auditLogs: {
          event: "CASHFREE_ORDER_CREATED",
          status: cashfreeOrder.order_status || "PENDING",
          message: "Cashfree order created successfully.",
          ...context,
          metadata: { gatewayOrderId: cashfreeOrder.order_id },
        },
      },
    });

    return {
      orderId,
      paymentSessionId: cashfreeOrder.payment_session_id,
      amount: config.amount,
      currency: config.currency,
      membershipType,
      paymentStatus: payment.paymentStatus,
      cashfreeEnvironment: cashfreeService.getCashfreeConfig().environment,
    };
  } catch (error) {
    await paymentRepository.updatePayment(orderId, {
      paymentStatus: "FAILED",
      $push: {
        auditLogs: {
          event: "CASHFREE_ORDER_FAILED",
          status: "FAILED",
          message: error.message,
          ...context,
        },
      },
    });
    throw error;
  }
};

const getOwnedPayment = async ({ orderId, user }) => {
  if (!/^MTTF_[A-Za-z0-9_]+$/.test(orderId || "")) {
    throw new AppError(400, "Invalid order id.");
  }

  const payment = await paymentRepository.findByOrderId(orderId);
  if (!payment || String(payment.userId) !== String(user._id)) {
    throw new AppError(404, "Payment not found.");
  }

  return payment;
};

const toClientPayment = (payment, user) => ({
  orderId: payment.orderId,
  amount: payment.amount,
  currency: payment.currency,
  paymentGateway: payment.paymentGateway,
  paymentStatus: payment.paymentStatus,
  paymentMethod: payment.paymentMethod,
  membershipType: payment.membershipType,
  webhookVerified: payment.webhookVerified,
  cfPaymentId: payment.cfPaymentId,
  isMembershipPaid: Boolean(user?.isMembershipPaid),
  membershipId: user?.membershipId,
  membershipActivatedAt: user?.membershipActivatedAt,
  createdAt: payment.createdAt,
  updatedAt: payment.updatedAt,
});

const getPaymentStatus = async ({ orderId, user }) => {
  const payment = await getOwnedPayment({ orderId, user });
  return toClientPayment(payment, user);
};

const getPaymentHistory = async ({ user }) => {
  const payments = await paymentRepository.listUserPayments(user._id);
  return payments.map((payment) => toClientPayment(payment, user));
};

const pickLatestGatewayPayment = (payments) => {
  if (!Array.isArray(payments)) {
    return null;
  }
  return payments
    .slice()
    .sort((a, b) => new Date(b.payment_time || b.created_at || 0) - new Date(a.payment_time || a.created_at || 0))[0];
};

const verifyPaymentWithGateway = async ({ orderId, user, req }) => {
  const context = getClientContext(req);
  const payment = await getOwnedPayment({ orderId, user });

  const [cashfreeOrder, cashfreePayments] = await Promise.all([
    cashfreeService.fetchOrder(orderId),
    cashfreeService.fetchOrderPayments(orderId),
  ]);

  const latestPayment = pickLatestGatewayPayment(cashfreePayments);
  const gatewayStatus = mapGatewayStatus(
    latestPayment?.payment_status || cashfreeOrder?.order_status,
    latestPayment?.event
  );

  const gatewayAmount = Number(latestPayment?.payment_amount || cashfreeOrder?.order_amount || payment.amount);
  const amountMatches = gatewayAmount === Number(payment.amount);
  const nextStatus = amountMatches ? gatewayStatus : "FAILED";

  const update = {
    cashfreeOrderStatus: cashfreeOrder?.order_status,
    paymentStatus: nextStatus,
    cfPaymentId: latestPayment?.cf_payment_id || payment.cfPaymentId,
    paymentMethod: latestPayment?.payment_group || latestPayment?.payment_method || payment.paymentMethod,
    gatewayResponse: {
      order: redactGatewayResponse(cashfreeOrder),
      latestPayment: redactGatewayResponse(latestPayment),
    },
    $push: {
      auditLogs: {
        event: "CLIENT_VERIFY",
        status: nextStatus,
        message: amountMatches
          ? "Client-requested gateway status sync completed."
          : "Gateway amount mismatch during client-requested verification.",
        ...context,
        metadata: { gatewayAmount },
      },
    },
  };

  const updatedPayment = await paymentRepository.updatePayment(orderId, update);
  return toClientPayment(updatedPayment, user);
};

const extractWebhookData = (body) => {
  const order = body?.data?.order || body?.order || {};
  const payment = body?.data?.payment || body?.payment || {};

  return {
    eventType: body?.type || body?.event || body?.event_type,
    orderId: order.order_id || body?.order_id,
    gatewayOrderStatus: order.order_status || body?.order_status,
    gatewayAmount: Number(payment.payment_amount || order.order_amount || body?.order_amount),
    gatewayCurrency: payment.payment_currency || order.order_currency || body?.order_currency || "INR",
    cfPaymentId: payment.cf_payment_id || body?.cf_payment_id,
    gatewayPaymentStatus: payment.payment_status || body?.payment_status,
    paymentMethod: payment.payment_group || payment.payment_method || body?.payment_method,
    eventId: body?.event_id || body?.data?.event_id,
  };
};

const handleCashfreeWebhook = async ({ req }) => {
  const context = getClientContext(req);
  const signature = req.get("x-webhook-signature");
  const timestamp = req.get("x-webhook-timestamp");
  const rawBody = req.rawBody;

  if (!cashfreeService.verifyWebhookSignature({ rawBody, signature, timestamp })) {
    throw new AppError(401, "Invalid Cashfree webhook signature.");
  }

  const webhook = extractWebhookData(req.body);
  if (!webhook.orderId) {
    throw new AppError(400, "Webhook order id is missing.");
  }

  const payment = await paymentRepository.findByOrderId(webhook.orderId, true);
  if (!payment) {
    throw new AppError(404, "Webhook payment record not found.");
  }

  const webhookKey = webhook.eventId ||
    webhook.cfPaymentId ||
    crypto.createHash("sha256").update(rawBody || JSON.stringify(req.body)).digest("hex");

  if (payment.processedWebhookKeys.includes(webhookKey)) {
    await paymentRepository.appendAuditLog(payment.orderId, {
      event: "WEBHOOK_DUPLICATE",
      status: payment.paymentStatus,
      message: "Duplicate webhook ignored.",
      ...context,
      metadata: { webhookKey },
    });
    return { duplicate: true, paymentStatus: payment.paymentStatus };
  }

  const amountMatches = Number(webhook.gatewayAmount) === Number(payment.amount);
  const currencyMatches = String(webhook.gatewayCurrency || "INR").toUpperCase() === payment.currency;
  const mappedStatus = mapGatewayStatus(webhook.gatewayPaymentStatus || webhook.gatewayOrderStatus, webhook.eventType);
  const nextStatus = amountMatches && currencyMatches ? mappedStatus : "FAILED";

  const updatedPayment = await paymentRepository.updatePayment(payment.orderId, {
    paymentStatus: nextStatus,
    webhookVerified: true,
    cfPaymentId: webhook.cfPaymentId || payment.cfPaymentId,
    cashfreeOrderStatus: webhook.gatewayOrderStatus || payment.cashfreeOrderStatus,
    paymentMethod: webhook.paymentMethod || payment.paymentMethod,
    $addToSet: { processedWebhookKeys: webhookKey },
    $push: {
      auditLogs: {
        event: "WEBHOOK_RECEIVED",
        status: nextStatus,
        message: amountMatches && currencyMatches
          ? "Signed Cashfree webhook processed."
          : "Signed Cashfree webhook rejected due to amount or currency mismatch.",
        ...context,
        metadata: {
          eventType: webhook.eventType,
          cfPaymentId: webhook.cfPaymentId,
          gatewayAmount: webhook.gatewayAmount,
          gatewayCurrency: webhook.gatewayCurrency,
          expectedAmount: payment.amount,
          expectedCurrency: payment.currency,
        },
      },
    },
  });

  if (nextStatus === "SUCCESS") {
    await membershipService.activateMembershipForPayment({
      payment: updatedPayment,
      ...context,
    });
  }

  return { duplicate: false, paymentStatus: nextStatus };
};

module.exports = {
  getPublicMembershipConfig,
  createPaymentOrder,
  getPaymentStatus,
  getPaymentHistory,
  verifyPaymentWithGateway,
  handleCashfreeWebhook,
};
