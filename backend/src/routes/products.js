const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  getProductCategories,
  getFeaturedProducts,
  getProductsForComparison,
  getRelatedProducts,
  trackProductShare,
  trackProductView,
  getProductSpecifications,
  updateProductSpecifications,
  getTopProducts,
  getProductsByCategory
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getProductCategories);
router.get('/top', getTopProducts);
router.get('/compare', getProductsForComparison);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);
router.get('/:id/reviews', getProductReviews);
router.get('/:id/specifications', getProductSpecifications);
router.get('/:id/related', getRelatedProducts);

// Protected routes
router.post('/:id/reviews', protect, createProductReview);
router.post('/:id/share', protect, trackProductShare);
router.post('/:id/view', protect, trackProductView);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.put('/:id/specifications', protect, admin, updateProductSpecifications);

module.exports = router;