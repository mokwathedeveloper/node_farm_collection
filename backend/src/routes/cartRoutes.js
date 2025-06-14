const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// Log all cart requests for debugging
router.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Cart route accessed:', {
    method: req.method,
    url: req.originalUrl,
    body: req.method === 'POST' ? req.body : undefined,
    params: req.params,
    hasToken: !!token
  });
  next();
});

// Middleware to handle both authenticated and guest users
const handleAuth = async (req, res, next) => {
  try {
    // Try to authenticate the user
    if (req.headers.authorization?.startsWith('Bearer')) {
      await protect(req, res, () => {
        // If authentication succeeds, continue
        next();
      });
    } else {
      // If no token, treat as guest
      req.isGuest = true;
      next();
    }
  } catch (error) {
    // If authentication fails, treat as guest
    req.isGuest = true;
    next();
  }
};

// Get cart and add to cart
router.route('/')
  .get(handleAuth, getCart)
  .post(handleAuth, addToCart);

// Remove from cart
router.route('/:productId')
  .delete(handleAuth, removeFromCart);

module.exports = router;
