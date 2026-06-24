const Payment = require("../models/Payment");

const createPayment = (data) => Payment.create(data);

const findByOrderId = (orderId, includePrivate = false) => {
  const query = Payment.findOne({ orderId });
  if (includePrivate) {
    query.select("+paymentSessionId +processedWebhookKeys +gatewayResponse");
  }
  return query;
};

const findReusablePendingPayment = (userId) => Payment.findOne({
  userId,
  paymentStatus: "PENDING",
  expiresAt: { $gt: new Date() },
}).select("+paymentSessionId +processedWebhookKeys").sort({ createdAt: -1 });

const appendAuditLog = (orderId, log) => Payment.updateOne(
  { orderId },
  { $push: { auditLogs: { ...log, createdAt: new Date() } } }
);

const updatePayment = (orderId, update) => Payment.findOneAndUpdate(
  { orderId },
  update,
  { new: true }
);

const listUserPayments = (userId) => Payment.find({ userId })
  .sort({ createdAt: -1 })
  .select("-auditLogs");

module.exports = {
  createPayment,
  findByOrderId,
  findReusablePendingPayment,
  appendAuditLog,
  updatePayment,
  listUserPayments,
};
