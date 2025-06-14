const express = require('express');
const router = express.Router();
const { 
  getSalesAnalytics, 
  getUserAnalytics, 
  getProductAnalytics,
  getDashboardStats
} = require('../controllers/analyticsController');
const { 
  protect, 
  requirePermission 
} = require('../middleware/authMiddleware');

// All analytics routes require authentication and view_analytics permission
router.use(protect);
router.use(requirePermission('view_analytics'));

router.get('/sales', getSalesAnalytics);
router.get('/users', getUserAnalytics);
router.get('/products', getProductAnalytics);
router.get('/dashboard', getDashboardStats);

module.exports = router;