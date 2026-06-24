const crypto = require("crypto");
const AppError = require("../utils/AppError");

const API_VERSION = process.env.CASHFREE_API_VERSION || "2023-08-01";

const getCashfreeConfig = () => {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  const env = (process.env.CASHFREE_ENV || process.env.CASHFREE_ENVIRONMENT || "sandbox").toLowerCase();
  const production = ["production", "prod", "live"].includes(env);

  return {
    appId,
    secretKey,
    environment: production ? "production" : "sandbox",
    baseUrl: production ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg",
  };
};

const ensureConfigured = () => {
  const config = getCashfreeConfig();
  if (!config.appId || !config.secretKey) {
    throw new AppError(503, "Cashfree credentials are not configured.");
  }
  return config;
};

const cashfreeRequest = async (path, options = {}) => {
  const config = ensureConfigured();
  const response = await fetch(`${config.baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-client-id": config.appId,
      "x-client-secret": config.secretKey,
      "x-api-version": API_VERSION,
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    throw new AppError(502, "Payment gateway request failed.", {
      status: response.status,
      cashfreeMessage: data?.message || data?.raw,
    });
  }

  return data;
};

const createOrder = async ({ orderId, amount, currency, user, returnUrl, notifyUrl }) => {
  const body = {
    order_id: orderId,
    order_amount: Number(amount),
    order_currency: currency,
    customer_details: {
      customer_id: String(user._id),
      customer_name: user.name,
      customer_email: user.email,
      customer_phone: user.phone,
    },
    order_meta: {
      return_url: returnUrl,
      ...(notifyUrl ? { notify_url: notifyUrl } : {}),
    },
    order_note: `${user.membershipType} lifetime membership`,
  };

  return cashfreeRequest("/orders", {
    method: "POST",
    body: JSON.stringify(body),
  });
};

const fetchOrder = (orderId) => cashfreeRequest(`/orders/${encodeURIComponent(orderId)}`, {
  method: "GET",
});

const fetchOrderPayments = (orderId) => cashfreeRequest(`/orders/${encodeURIComponent(orderId)}/payments`, {
  method: "GET",
});

const verifyWebhookSignature = ({ rawBody, signature, timestamp }) => {
  const { secretKey } = ensureConfigured();
  if (!rawBody || !signature || !timestamp) {
    return false;
  }

  const signedPayload = Buffer.concat([
    Buffer.from(String(timestamp)),
    Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(String(rawBody)),
  ]);

  const expectedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(signedPayload)
    .digest("base64");

  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  return provided.length === expected.length && crypto.timingSafeEqual(provided, expected);
};

module.exports = {
  getCashfreeConfig,
  createOrder,
  fetchOrder,
  fetchOrderPayments,
  verifyWebhookSignature,
};
