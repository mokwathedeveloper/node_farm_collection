const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { User, ROLES, PERMISSIONS } = require('../models/User');

// Protect routes - verify token and attach user to req object
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

// Superadmin middleware
const superadmin = (req, res, next) => {
  if (req.user && req.user.isSuperAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a superadmin' });
  }
};

// Role-based middleware
const checkRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user' });
    }

    if (req.user.hasRole(role)) {
      next();
    } else {
      res.status(403).json({ 
        message: `Not authorized, requires ${role} role or higher` 
      });
    }
  };
};

// Client middleware - any authenticated user
const client = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized');
  }
};

// Permission-based middleware
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user' });
    }

    if (req.user.hasPermission(permission)) {
      next();
    } else {
      res.status(403).json({ 
        message: `Not authorized - requires ${permission} permission` 
      });
    }
  };
};

// Multiple permissions middleware
const requirePermissions = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user' });
    }

    const hasAllPermissions = permissions.every(permission => 
      req.user.hasPermission(permission)
    );

    if (hasAllPermissions) {
      next();
    } else {
      res.status(403).json({ 
        message: `Not authorized - requires all permissions: ${permissions.join(', ')}` 
      });
    }
  };
};

// Validate frontend-backend alignment
const validateAlignment = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      role: user.role,
      permissions: user.permissions || [],
      validationTimestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500);
    throw new Error('Validation check failed');
  }
});

module.exports = {
  protect,
  admin,
  superadmin,
  checkRole,
  requirePermission,
  requirePermissions,
  ROLES,
  PERMISSIONS,
  validateAlignment
};
