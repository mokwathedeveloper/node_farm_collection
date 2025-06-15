const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderToPaid,
  updateOrderStatus,
  updateOrderToDelivered,
  getMyOrders,
  cancelOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Specific routes MUST come before parameterized routes
router.route('/')
  .post(protect, createOrder);

router.route('/myorders')
  .get(protect, getMyOrders);

// Admin routes (must come before /:id routes)
router.route('/admin')
  .get(protect, admin, getOrders);

router.route('/admin/:id')
  .get(protect, admin, getOrderById);

router.route('/admin/:id/deliver')
  .put(protect, admin, updateOrderToDelivered);

// Parameterized routes (must come AFTER specific routes)
router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/pay')
  .put(protect, updateOrderToPaid);

router.route('/:id/cancel')
  .put(protect, cancelOrder);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

module.exports = router;
