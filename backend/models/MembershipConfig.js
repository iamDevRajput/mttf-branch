const mongoose = require("mongoose");

const membershipConfigSchema = new mongoose.Schema({
  membershipType: {
    type: String,
    required: true,
    enum: ["individual", "institutional"],
    unique: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  currency: {
    type: String,
    default: "INR",
    uppercase: true,
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
    index: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("MembershipConfig", membershipConfigSchema);
