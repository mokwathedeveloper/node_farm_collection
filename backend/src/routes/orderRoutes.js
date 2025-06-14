const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  cancelOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Client routes
router.route('/')
  .post(protect, createOrder);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/pay')
  .put(protect, updateOrderToPaid);

router.route('/:id/cancel')
  .put(protect, cancelOrder);

// Admin routes
router.route('/admin')
  .get(protect, admin, getOrders);

router.route('/admin/:id')
  .get(protect, admin, getOrderById);

router.route('/admin/:id/deliver')
  .put(protect, admin, updateOrderToDelivered);

module.exports = router;
