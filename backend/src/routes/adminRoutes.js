const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getAnalytics 
} = require('../controllers/adminController');
const { 
  getUsers, 
  deleteUser, 
  getUserById, 
  updateUser 
} = require('../controllers/userController');
const { 
  getOrders, 
  updateOrderToDelivered 
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const { 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProducts 
} = require('../controllers/productController');

// Dashboard routes
router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/dashboard-stats', protect, admin, getDashboardStats);
router.get('/analytics', protect, admin, getAnalytics);

// User management routes
router.route('/users')
  .get(protect, admin, getUsers);

router.route('/users/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

// Order management routes
router.route('/orders')
  .get(protect, admin, getOrders);

router.route('/orders/:id/deliver')
  .put(protect, admin, updateOrderToDelivered);

// Product management routes
router.route('/products')
  .get(protect, admin, getProducts)
  .post(protect, admin, createProduct);

router.route('/products/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
