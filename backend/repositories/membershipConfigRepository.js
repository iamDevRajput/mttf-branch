const MembershipConfig = require("../models/MembershipConfig");

const DEFAULT_CONFIGS = [
  { membershipType: "individual", amount: 2000, currency: "INR", active: true },
  { membershipType: "institutional", amount: 5000, currency: "INR", active: true },
];

const ensureDefaultMembershipConfigs = async () => {
  await Promise.all(DEFAULT_CONFIGS.map((config) => (
    MembershipConfig.updateOne(
      { membershipType: config.membershipType },
      { $setOnInsert: config },
      { upsert: true }
    )
  )));
};

const getActiveConfig = async (membershipType) => {
  await ensureDefaultMembershipConfigs();
  return MembershipConfig.findOne({ membershipType, active: true });
};

const getPriceMap = async () => {
  await ensureDefaultMembershipConfigs();
  const configs = await MembershipConfig.find({ active: true }).sort({ membershipType: 1 });
  return configs.reduce((acc, config) => {
    acc[config.membershipType] = config.amount;
    return acc;
  }, {});
};

const updatePrices = async ({ individual, institutional }) => {
  await ensureDefaultMembershipConfigs();
  const updates = [];

  if (individual != null) {
    updates.push(MembershipConfig.findOneAndUpdate(
      { membershipType: "individual" },
      { amount: Number(individual), currency: "INR", active: true },
      { upsert: true, new: true }
    ));
  }

  if (institutional != null) {
    updates.push(MembershipConfig.findOneAndUpdate(
      { membershipType: "institutional" },
      { amount: Number(institutional), currency: "INR", active: true },
      { upsert: true, new: true }
    ));
  }

  await Promise.all(updates);
  return getPriceMap();
};

module.exports = {
  ensureDefaultMembershipConfigs,
  getActiveConfig,
  getPriceMap,
  updatePrices,
};
