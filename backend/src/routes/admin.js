const express = require('express');
const router = express.Router();
const { protect, admin, requirePermission } = require('../middleware/authMiddleware');
const { ADMIN_PERMISSIONS } = require('../models/User');

// Admin Dashboard Stats
router.get('/dashboard-stats', protect, admin, async (req, res) => {
  try {
    const stats = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    res.json({
      totalOrders: stats[0],
      totalProducts: stats[1],
      totalCustomers: stats[2],
      totalRevenue: stats[3][0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Product Management
router.get('/products', protect, requirePermission(ADMIN_PERMISSIONS.MANAGE_PRODUCTS), async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/products', protect, requirePermission(ADMIN_PERMISSIONS.MANAGE_PRODUCTS), async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Order Management
router.get('/orders', protect, requirePermission(ADMIN_PERMISSIONS.MANAGE_ORDERS), async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/orders/:id/status', protect, requirePermission(ADMIN_PERMISSIONS.MANAGE_ORDERS), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// User Management
router.get('/users', protect, requirePermission(ADMIN_PERMISSIONS.MANAGE_USERS), async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Analytics
router.get('/analytics', protect, requirePermission(ADMIN_PERMISSIONS.VIEW_ANALYTICS), async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          total: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      salesByMonth: salesData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Returns Management
router.get('/returns', protect, requirePermission(ADMIN_PERMISSIONS.MANAGE_RETURNS), async (req, res) => {
  try {
    const returns = await Return.find({})
      .populate('order')
      .populate('user', 'name email')
      .sort('-createdAt');
    res.json(returns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/returns/:id/status', protect, requirePermission(ADMIN_PERMISSIONS.MANAGE_RETURNS), async (req, res) => {
  try {
    const return_ = await Return.findById(req.params.id);
    if (return_) {
      return_.status = req.body.status;
      const updatedReturn = await return_.save();
      res.json(updatedReturn);
    } else {
      res.status(404).json({ message: 'Return request not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Promotions Management
router.get('/promotions', protect, requirePermission(ADMIN_PERMISSIONS.MANAGE_PROMOTIONS), async (req, res) => {
  try {
    const promotions = await Promotion.find({}).sort('-createdAt');
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/promotions', protect, requirePermission(ADMIN_PERMISSIONS.MANAGE_PROMOTIONS), async (req, res) => {
  try {
    const promotion = new Promotion(req.body);
    await promotion.save();
    res.status(201).json(promotion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;