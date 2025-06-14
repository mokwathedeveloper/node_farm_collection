const express = require('express');
const router = express.Router();
const { 
  getGuestCart, 
  addToGuestCart, 
  updateGuestCartItem, 
  removeFromGuestCart, 
  clearGuestCart,
  transferGuestCart
} = require('../controllers/guestCartController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.route('/')
  .get(getGuestCart)
  .post(addToGuestCart)
  .delete(clearGuestCart);

router.route('/:productId')
  .put(updateGuestCartItem)
  .delete(removeFromGuestCart);

// Protected route
router.post('/transfer', protect, transferGuestCart);

module.exports = router;