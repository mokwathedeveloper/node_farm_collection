const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
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

// Static routes (must be before dynamic :id routes)
router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/admin')
  .get(protect, admin, getProducts);

router.route('/top')
  .get(getTopProducts);

router.route('/categories')
  .get(getProductCategories);

router.route('/featured')
  .get(getFeaturedProducts);

router.route('/compare')
  .get(getProductsForComparison);

router.route('/category/:category')
  .get(getProductsByCategory);

// Dynamic :id routes (must be last)
router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/reviews')
  .get(getProductReviews)
  .post(protect, createProductReview);

router.route('/:id/related')
  .get(getRelatedProducts);

router.route('/:id/share')
  .post(trackProductShare);

router.route('/:id/view')
  .post(trackProductView);

router.route('/:id/specifications')
  .get(getProductSpecifications)
  .put(protect, admin, updateProductSpecifications);

module.exports = router;
