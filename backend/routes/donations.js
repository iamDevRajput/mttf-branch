const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const donationService = require("../services/donationService");
const { webhookLimiter } = require("../middleware/rateLimiters");
const rateLimit = require("express-rate-limit");

const donationCreateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many donation attempts. Please wait." },
});

router.post("/create-order", donationCreateLimiter, asyncHandler(async (req, res) => {
  const { donorName, donorEmail, donorPhone, amount, message, donationCategory } = req.body;
  const order = await donationService.createDonationOrder({ donorName, donorEmail, donorPhone, amount, message, donationCategory });
  res.status(201).json({ success: true, order });
}));

router.get("/status/:donationId", asyncHandler(async (req, res) => {
  const donation = await donationService.getDonationStatus(req.params.donationId);
  res.json({ success: true, donation });
}));

router.post("/verify", asyncHandler(async (req, res) => {
  const donation = await donationService.verifyDonationWithGateway({ donationId: req.body.donationId });
  res.json({ success: true, donation });
}));

router.post("/webhook", webhookLimiter, asyncHandler(async (req, res) => {
  const result = await donationService.handleDonationWebhook({ req });
  res.json({ success: true, ...result });
}));

module.exports = router;
