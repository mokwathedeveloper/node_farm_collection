const express = require('express');
const router = express.Router();
const { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist 
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

// All wishlist routes require authentication
router.use(protect);

router.route('/')
  .get(getWishlist)
  .post(addToWishlist);

router.delete('/:id', removeFromWishlist);

module.exports = router;
