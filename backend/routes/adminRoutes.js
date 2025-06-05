const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const User = require('../models/userModel');
const Order = require('../models/orderModel');

// Get all users (admin only)
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// Get user by ID (admin only)
router.get('/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// Update user (admin only)
router.put('/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const userData = { ...req.body };
    
    // If password is being updated, hash it
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    
    const user = await User.findByIdAndUpdate(req.params.id, userData, {
      new: true,
      runValidators: true
    }).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
});

// Delete user (admin only)
router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// Get all orders (admin only)
router.get('/orders', verifyToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
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

// Get order by ID (admin only)
router.get('/orders/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found'
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

// Update order status (admin only)
router.patch('/orders/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        status: 'fail',
        message: 'Status is required'
      });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true, runValidators: true }
    ).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found'
      });
    }
    
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

// Create a new admin (admin only)
router.post('/create-admin', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already in use'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new admin user
    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });
    
    // Remove password from response
    const admin = newAdmin.toObject();
    delete admin.password;
    
    res.status(201).json({
      status: 'success',
      data: { user: admin }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
});

module.exports = router;
