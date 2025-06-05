const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');

// Get user's orders
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: { orders }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// Get order by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found'
      });
    }
    
    // Check if order belongs to user or user is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to view this order'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { order }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// Create new order from cart
router.post('/', verifyToken, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        status: 'fail',
        message: 'Shipping address and payment method are required'
      });
    }
    
    // Get user with cart
    const user = await User.findById(req.user.id).populate({
      path: 'cart.product',
      select: 'name price imageUrl'
    });
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    
    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Your cart is empty'
      });
    }
    
    // Create order items from cart
    const orderItems = user.cart.map(item => {
      const product = item.product;
      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        imageUrl: product.imageUrl
      };
    });
    
    // Calculate total price
    const totalPrice = orderItems.reduce(
      (total, item) => total + (item.price * item.quantity), 
      0
    );
    
    // Create new order
    const newOrder = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalPrice,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      isPaid: paymentMethod === 'cod' ? false : true,
      paidAt: paymentMethod === 'cod' ? null : Date.now()
    });
    
    // Clear user's cart
    user.cart = [];
    await user.save();
    
    res.status(201).json({
      status: 'success',
      data: { order: newOrder }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
});

// Update order status (admin only)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        status: 'fail',
        message: 'Status is required'
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found'
      });
    }
    
    // Only admins can update order status
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to update this order'
      });
    }
    
    order.status = status;
    
    // If status is delivered, update isDelivered and deliveredAt
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    
    await order.save();
    
    res.status(200).json({
      status: 'success',
      data: { order }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
});

module.exports = router;