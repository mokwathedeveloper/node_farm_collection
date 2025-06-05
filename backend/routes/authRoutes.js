
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { verifyToken, JWT_SECRET } = require('../middleware/authMiddleware');

// Helper function to sign JWT token
const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET || 'your_jwt_secret_key', {
    expiresIn: '30d'
  });
};

// Register a new user
router.post('/register', async (req, res) => {
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
    
    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'customer'
    });
    
    // Generate JWT token
    const token = signToken(newUser._id);
    
    // Remove password from response
    const user = newUser.toObject();
    delete user.password;
    
    res.status(201).json({
      status: 'success',
      token,
      data: { user }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
});

// Register a new admin (only if no admin exists)
router.post('/register-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({
        status: 'fail',
        message: 'Admin already exists'
      });
    }
    
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
    
    // Generate JWT token
    const token = signToken(newAdmin._id);
    
    // Remove password from response
    const admin = newAdmin.toObject();
    delete admin.password;
    
    res.status(201).json({
      status: 'success',
      token,
      data: { user: admin }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
});

// Check if admin exists
router.get('/check-admin', async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    res.status(200).json({
      status: 'success',
      data: { adminExists: !!adminExists }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }
    
    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }
    
    // Generate JWT token
    const token = signToken(user._id);
    
    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;
    
    res.status(200).json({
      status: 'success',
      token,
      data: { user: userObj }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
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

module.exports = router;
