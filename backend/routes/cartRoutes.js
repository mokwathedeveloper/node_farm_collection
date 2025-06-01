const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Cart API routes
router.get('/', cartController.getCart);
router.post('/add/:id', cartController.addToCart);
router.post('/remove/:id', cartController.removeFromCart);
router.patch('/update/:id', cartController.updateCartItem);
router.post('/clear', cartController.clearCart);

module.exports = router;
