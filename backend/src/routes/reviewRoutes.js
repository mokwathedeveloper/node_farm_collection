const express = require('express');
const { 
  addReview, 
  deleteReview, 
  updateReview,
  getProductReviews,
  getUserReviews,
  getReviewById,
  reportReview
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.route('/product/:productId')
  .get(getProductReviews);

// User routes
router.route('/user')
  .get(protect, getUserReviews);

router.route('/:productId')
  .post(protect, addReview);

router.route('/:productId/:reviewId')
  .get(getReviewById)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

router.route('/:productId/:reviewId/report')
  .post(protect, reportReview);

// Admin routes
router.route('/admin/reports')
  .get(protect, admin, getReportedReviews);

router.route('/admin/:productId/:reviewId')
  .delete(protect, admin, deleteReview);

module.exports = router;