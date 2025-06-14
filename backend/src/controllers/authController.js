const asyncHandler = require('express-async-handler');
const { User, ROLES } = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const logger = require('../utils/logger');

// Generate JWT access token (short-lived)
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// Generate refresh token (long-lived)
const generateRefreshToken = async (userId, req) => {
  // Create a secure random token
  const refreshToken = crypto.randomBytes(40).toString('hex');
  
  // Store in database with expiration
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days
  
  await RefreshToken.create({
    token: refreshToken,
    user: userId,
    expiresAt,
    userAgent: req.headers['user-agent'] || '',
    ipAddress: req.ip || req.connection.remoteAddress,
  });
  
  return refreshToken;
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate role
    if (role && !Object.values(ROLES).includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || ROLES.CLIENT // Default to client if no role specified
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic info
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    
    // Update address if provided
    if (req.body.address) {
      user.address = {
        ...user.address,
        ...req.body.address
      };
    }

    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isAdmin: updatedUser.isAdmin,
      isSuperAdmin: updatedUser.isSuperAdmin,
      phone: updatedUser.phone,
      address: updatedUser.address,
      token: generateToken(updatedUser._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user password
// @route   PUT /api/auth/profile/password
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both current and new password' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Setup superadmin (first-time setup)
// @route   POST /api/auth/setup-superadmin
// @access  Public
const setupSuperadmin = async (req, res) => {
  try {
    const { name, email, password, setupKey } = req.body;
    
    if (setupKey !== process.env.SUPER_ADMIN_SETUP_KEY) {
      return res.status(401).json({ message: 'Invalid setup key' });
    }
    
    const superAdminExists = await User.findOne({ role: ROLES.SUPERADMIN });
    if (superAdminExists) {
      return res.status(400).json({ message: 'Super admin already exists' });
    }
    
    const user = await User.create({
      name,
      email,
      password,
      role: ROLES.SUPERADMIN
    });
    
    res.status(201).json({
      message: 'Super admin created successfully',
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Setup admin
// @route   POST /api/auth/setup-admin
// @access  Private/SuperAdmin
const setupAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if requester is superadmin
    if (!req.user.isSuperAdmin) {
      return res.status(403).json({ message: 'Not authorized to create admin accounts' });
    }
    
    const user = await User.create({
      name,
      email,
      password,
      role: ROLES.ADMIN,
      createdBy: req.user._id
    });
    
    res.status(201).json({
      message: 'Admin created successfully',
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
    
    const storedToken = await RefreshToken.findOne({ token: refreshToken })
      .populate('user');
      
    if (!storedToken || storedToken.isExpired()) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
    
    const accessToken = generateAccessToken(storedToken.user._id);
    
    res.json({
      accessToken,
      user: {
        _id: storedToken.user._id,
        name: storedToken.user.name,
        email: storedToken.user.email,
        role: storedToken.user.role,
        isAdmin: storedToken.user.isAdmin,
        isSuperAdmin: storedToken.user.isSuperAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      // Delete refresh token if provided
      await RefreshToken.deleteOne({ token: refreshToken });
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  updatePassword,
  setupSuperadmin,
  setupAdmin,
  refreshToken,
  logout
};
