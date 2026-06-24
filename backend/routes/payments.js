const express = require("express");
const paymentController = require("../controllers/paymentController");
const { requireAuth } = require("../middleware/authMiddleware");
const { paymentCreateLimiter, webhookLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.get("/config", requireAuth, paymentController.getConfig);
router.post("/create-order", requireAuth, paymentCreateLimiter, paymentController.createOrder);
router.post("/webhook", webhookLimiter, paymentController.webhook);
router.get("/status/:orderId", requireAuth, paymentController.status);
router.post("/verify", requireAuth, paymentController.verify);
router.get("/history", requireAuth, paymentController.history);

module.exports = router;
