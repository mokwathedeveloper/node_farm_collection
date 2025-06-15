const { User, ROLES } = require('../models/User');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  // Add pagination
  const pageSize = 10;
  const page = Number(req.query.page) || 1;
  
  // Add filtering
  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { email: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};
    
  // Add role filtering
  const roleFilter = req.query.role ? { role: req.query.role } : {};
  
  // Combine filters
  const filter = { ...keyword, ...roleFilter };
  
  // Superadmins can see all users, admins can't see superadmins
  if (req.user.role !== 'superadmin') {
    filter.role = { $ne: 'superadmin' };
  }
  
  const count = await User.countDocuments(filter);
  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
    
  res.json({
    users,
    page,
    pages: Math.ceil(count / pageSize),
    total: count
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Prevent deleting superadmin if not superadmin
    if (user.role === 'superadmin' && req.user.role !== 'superadmin') {
      res.status(403);
      throw new Error('Not authorized to delete superadmin');
    }
    
    // Prevent self-deletion
    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('Cannot delete your own account');
    }
    
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    // Admins can't view superadmin details
    if (user.role === 'superadmin' && req.user.role !== 'superadmin') {
      res.status(403);
      throw new Error('Not authorized to view superadmin details');
    }
    
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Prevent updating superadmin if not superadmin
    if (user.role === 'superadmin' && req.user.role !== 'superadmin') {
      res.status(403);
      throw new Error('Not authorized to update superadmin');
    }
    
    // Prevent role escalation (admin can't make someone superadmin)
    if (req.body.role === 'superadmin' && req.user.role !== 'superadmin') {
      res.status(403);
      throw new Error('Not authorized to assign superadmin role');
    }
    
    // Update fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
    user.role = req.body.role || user.role;
    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
    
    // Update permissions if provided and authorized
    if (req.body.permissions && (req.user.role === 'superadmin' || req.user.role === 'admin')) {
      user.permissions = req.body.permissions;
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
      isAdmin: updatedUser.isAdmin,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      permissions: updatedUser.permissions
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Create a new user (by admin)
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, permissions } = req.body;

  // Validate input
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Prevent role escalation
  if (role === 'superadmin' && req.user.role !== 'superadmin') {
    res.status(403);
    throw new Error('Not authorized to create superadmin');
  }

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: role || 'client',
    isAdmin: ['admin', 'superadmin'].includes(role),
    permissions: permissions || [],
    createdBy: req.user._id
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Create a super admin user
// @route   POST /api/users/create-superadmin
// @access  Public (but requires setup key)
const createSuperAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, setupKey } = req.body;

  // Validate setup key
  if (!setupKey || setupKey !== process.env.SUPER_ADMIN_SETUP_KEY) {
    res.status(401);
    throw new Error('Invalid setup key');
  }

  // Check if super admin already exists
  const superAdminExists = await User.findOne({ role: 'superadmin' });
  if (superAdminExists) {
    res.status(400);
    throw new Error('Super admin already exists');
  }

  // Check if email is already in use
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Email already in use');
  }

  // Create super admin user
  const user = await User.create({
    name,
    email,
    password,
    isAdmin: true,
    role: 'superadmin',
  });

  if (user) {
    res.status(201).json({
      message: 'Super admin created successfully',
      success: true
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Check if superadmin exists
const checkSuperAdminExists = async (req, res) => {
  const superAdmin = await User.findOne({ role: 'superadmin' });
  
  res.json({
    exists: !!superAdmin
  });
};

// @desc    Get user addresses
// @route   GET /api/users/profile/addresses
// @access  Private
const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('address');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user.address);
});

// @desc    Add a new address
// @route   POST /api/users/profile/addresses
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
  const { street, city, state, postalCode, country } = req.body;

  if (!street || !city || !state || !postalCode || !country) {
    res.status(400);
    throw new Error('Please provide all address fields');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.address = {
    street,
    city,
    state,
    postalCode,
    country
  };

  const updatedUser = await user.save();
  res.status(201).json(updatedUser.address);
});

// @desc    Update an address
// @route   PUT /api/users/profile/addresses/:id
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { street, city, state, postalCode, country } = req.body;
  
  user.address = {
    ...user.address,
    ...(street && { street }),
    ...(city && { city }),
    ...(state && { state }),
    ...(postalCode && { postalCode }),
    ...(country && { country })
  };

  const updatedUser = await user.save();
  res.json(updatedUser.address);
});

// @desc    Delete an address
// @route   DELETE /api/users/profile/addresses/:id
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.address = {
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  };

  await user.save();
  res.json({ message: 'Address removed' });
});

module.exports = {
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  createUser,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  checkSuperAdminExists
};
