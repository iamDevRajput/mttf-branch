const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Payment = require('../models/Payment');
const membershipConfigRepository = require('../repositories/membershipConfigRepository');
const { requireAdmin } = require('../middleware/adminMiddleware');
const router = express.Router();

// ─── Helper: Get or init prices ──────────────────────────────────────────────
const getOrInitPrices = () => membershipConfigRepository.getPriceMap();

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildPaymentQuery = ({ status, search }) => {
  const query = {};
  if (status && Payment.statuses.includes(String(status).toUpperCase())) {
    query.paymentStatus = String(status).toUpperCase();
  }
  if (search) {
    const safeSearch = new RegExp(escapeRegex(String(search)), 'i');
    query.$or = [
      { orderId: safeSearch },
      { userName: safeSearch },
      { userEmail: safeSearch },
      { cfPaymentId: safeSearch },
    ];
  }
  return query;
};

const csvValue = (value) => {
  const raw = value == null ? '' : String(value);
  return `"${raw.replace(/"/g, '""')}"`;
};

// ─── POST /api/admin/login ────────────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password required.' });

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD)
    return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });

  const token = jwt.sign({ isAdmin: true, email }, process.env.JWT_SECRET, { expiresIn: '8h' });

  res.json({ success: true, token });
});

// ─── GET /api/admin/settings ──────────────────────────────────────────────────
router.get('/settings', requireAdmin, async (req, res) => {
  try {
    const prices = await getOrInitPrices();
    res.json({ success: true, prices });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── PUT /api/admin/settings ──────────────────────────────────────────────────
router.put('/settings', requireAdmin, async (req, res) => {
  try {
    const { individual, institutional } = req.body;
    if (!individual || !institutional || individual < 1 || institutional < 1)
      return res.status(400).json({ success: false, message: 'Valid prices required.' });

    const prices = await membershipConfigRepository.updatePrices({
      individual: Number(individual),
      institutional: Number(institutional),
    });
    res.json({ success: true, prices });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const paidUsers = await User.countDocuments({ isMembershipPaid: true });
    const pendingUsers = totalUsers - paidUsers;
    const prices = await getOrInitPrices();

    // rough revenue estimate
    const revenueAgg = await Payment.aggregate([
      { $match: { paymentStatus: 'SUCCESS', webhookVerified: true } },
      { $group: { _id: null, revenue: { $sum: '$amount' }, successfulPayments: { $sum: 1 } } },
    ]);
    const failedPayments = await Payment.countDocuments({ paymentStatus: 'FAILED' });
    const refundedPayments = await Payment.countDocuments({ paymentStatus: 'REFUNDED' });
    const pendingPayments = await Payment.countDocuments({ paymentStatus: 'PENDING' });
    const revenue = revenueAgg[0]?.revenue || 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        paidUsers,
        pendingUsers,
        revenue,
        successfulPayments: revenueAgg[0]?.successfulPayments || 0,
        failedPayments,
        refundedPayments,
        pendingPayments,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── Public: GET /api/admin/prices (for payment page) ────────────────────────
router.get('/prices', async (req, res) => {
  try {
    const prices = await getOrInitPrices();
    res.json({ success: true, prices });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── GET /api/admin/payments ──────────────────────────────────────────────────
router.get('/payments', requireAdmin, async (req, res) => {
  try {
    const { status, search, limit = 100 } = req.query;
    const payments = await Payment.find(buildPaymentQuery({ status, search }))
      .select('-auditLogs -gatewayResponse -paymentSessionId -processedWebhookKeys')
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit) || 100, 500));

    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── GET /api/admin/payments/export.csv ──────────────────────────────────────
router.get('/payments/export.csv', requireAdmin, async (req, res) => {
  try {
    const { status, search } = req.query;
    const payments = await Payment.find(buildPaymentQuery({ status, search }))
      .select('-auditLogs -gatewayResponse -paymentSessionId -processedWebhookKeys')
      .sort({ createdAt: -1 })
      .limit(5000);

    const header = [
      'Order ID',
      'User Name',
      'User Email',
      'Amount',
      'Currency',
      'Gateway',
      'CF Payment ID',
      'Status',
      'Method',
      'Membership Type',
      'Webhook Verified',
      'Created At',
      'Updated At',
    ];

    const rows = payments.map((payment) => [
      payment.orderId,
      payment.userName,
      payment.userEmail,
      payment.amount,
      payment.currency,
      payment.paymentGateway,
      payment.cfPaymentId,
      payment.paymentStatus,
      payment.paymentMethod,
      payment.membershipType,
      payment.webhookVerified,
      payment.createdAt?.toISOString(),
      payment.updatedAt?.toISOString(),
    ].map(csvValue).join(','));

    res.header('Content-Type', 'text/csv');
    res.attachment(`payments-${Date.now()}.csv`);
    res.send([header.map(csvValue).join(','), ...rows].join('\n'));
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
