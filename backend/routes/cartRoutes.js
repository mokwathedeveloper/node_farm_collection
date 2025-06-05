const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const User = require('../models/userModel');
const Product = require('../models/productModel');

// Get user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'cart.product',
      select: 'name price imageUrl description'
    });
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    
    // Calculate total price
    const cartItems = user.cart.map(item => {
      const product = item.product;
      return {
        product: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: item.quantity,
        subtotal: product.price * item.quantity
      };
    });
    
    const totalPrice = cartItems.reduce((total, item) => total + item.subtotal, 0);
    
    res.status(200).json({
      status: 'success',
      data: { 
        items: cartItems,
        totalPrice
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// Add item to cart
router.post('/add/:id', verifyToken, async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const productId = req.params.id;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found'
      });
    }
    
    // Get user with cart
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    
    // Initialize cart if it doesn't exist
    if (!user.cart) {
      user.cart = [];
    }
    
    // Check if product already in cart
    const cartItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );
    
    if (cartItemIndex > -1) {
      // Product exists in cart, update quantity
      user.cart[cartItemIndex].quantity += parseInt(quantity);
    } else {
      // Product not in cart, add it
      user.cart.push({
        product: productId,
        quantity: parseInt(quantity)
      });
    }
    
    // Save updated cart
    await user.save();
    
    // Return updated cart
    const updatedUser = await User.findById(req.user.id).populate({
      path: 'cart.product',
      select: 'name price imageUrl description'
    });
    
    // Calculate total price
    const cartItems = updatedUser.cart.map(item => {
      const product = item.product;
      return {
        product: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: item.quantity,
        subtotal: product.price * item.quantity
      };
    });
    
    const totalPrice = cartItems.reduce((total, item) => total + item.subtotal, 0);
    
    res.status(200).json({
      status: 'success',
      data: { 
        items: cartItems,
        totalPrice
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
});

// Remove item from cart
router.post('/remove/:id', verifyToken, async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Get user with cart
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    
    // Remove product from cart
    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    
    // Save updated cart
    await user.save();
    
    // Return updated cart
    const updatedUser = await User.findById(req.user.id).populate({
      path: 'cart.product',
      select: 'name price imageUrl description'
    });
    
    // Calculate total price
    const cartItems = updatedUser.cart.map(item => {
      const product = item.product;
      return {
        product: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: item.quantity,
        subtotal: product.price * item.quantity
      };
    });
    
    const totalPrice = cartItems.reduce((total, item) => total + item.subtotal, 0);
    
    res.status(200).json({
      status: 'success',
      data: { 
        items: cartItems,
        totalPrice
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
});

// Update cart item quantity
router.patch('/update/:id', verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.id;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        status: 'fail',
        message: 'Quantity must be at least 1'
      });
    }
    
    // Get user with cart
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    
    // Find product in cart
    const cartItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );
    
    if (cartItemIndex === -1) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found in cart'
      });
    }
    
    // Update quantity
    user.cart[cartItemIndex].quantity = parseInt(quantity);
    
    // Save updated cart
    await user.save();
    
    // Return updated cart
    const updatedUser = await User.findById(req.user.id).populate({
      path: 'cart.product',
      select: 'name price imageUrl description'
    });
    
    // Calculate total price
    const cartItems = updatedUser.cart.map(item => {
      const product = item.product;
      return {
        product: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: item.quantity,
        subtotal: product.price * item.quantity
      };
    });
    
    const totalPrice = cartItems.reduce((total, item) => total + item.subtotal, 0);
    
    res.status(200).json({
      status: 'success',
      data: { 
        items: cartItems,
        totalPrice
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
});

// Clear cart
router.post('/clear', verifyToken, async (req, res) => {
  try {
    // Get user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    
    // Clear cart
    user.cart = [];
    
    // Save updated cart
    await user.save();
    
    res.status(200).json({
      status: 'success',
      data: { 
        items: [],
        totalPrice: 0
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
});

module.exports = router;
