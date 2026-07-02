const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donationId: { type: String, required: true, unique: true, index: true },
  donorName: { type: String, required: true, trim: true },
  donorEmail: { type: String, required: true, lowercase: true, trim: true },
  donorPhone: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 1 },
  currency: { type: String, default: "INR" },
  message: { type: String, trim: true },
  donationCategory: {
    type: String,
    enum: [
      "Student Scholarships",
      "AI & Data Science Education",
      "Research & Innovation",
      "Digital Learning Infrastructure",
      "Faculty Development",
      "Rural STEM Education",
      "Women in STEM",
      "Innovation & Entrepreneurship",
      "Library & Knowledge Resources",
      "General Fund (Greatest Need)",
    ],
    default: "General Fund (Greatest Need)",
  },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED", "CANCELLED"],
    default: "PENDING",
    index: true,
  },
  paymentSessionId: { type: String, select: false },
  cfPaymentId: { type: String },
  cashfreeOrderStatus: { type: String },
  webhookVerified: { type: Boolean, default: false },
  processedWebhookKeys: { type: [String], default: [], select: false },
  receiptSent: { type: Boolean, default: false },
  gatewayResponse: { type: mongoose.Schema.Types.Mixed, select: false },
}, { timestamps: true });

donationSchema.index({ donorEmail: 1, createdAt: -1 });

module.exports = mongoose.model("Donation", donationSchema);
