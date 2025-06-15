const express = require('express');
const { 
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  refundPayment,
  getPaymentMethods,
  addPaymentMethod,
  removePaymentMethod
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Client routes
router.route('/create-payment-intent')
  .post(protect, createPaymentIntent);

router.route('/confirm')
  .post(protect, confirmPayment);

router.route('/history')
  .get(protect, getPaymentHistory);

router.route('/methods')
  .get(protect, getPaymentMethods)
  .post(protect, addPaymentMethod);

router.route('/methods/:id')
  .delete(protect, removePaymentMethod);

// Admin routes
router.route('/refund/:paymentId')
  .post(protect, admin, refundPayment);

module.exports = router;