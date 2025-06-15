const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin'
};

const PERMISSIONS = {
  // Admin permissions
  MANAGE_PRODUCTS: 'manage_products',
  MANAGE_ORDERS: 'manage_orders',
  VIEW_CUSTOMERS: 'view_customers',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_PROMOTIONS: 'manage_promotions',
  MANAGE_RETURNS: 'manage_returns',

  // Superadmin permissions
  MANAGE_ADMINS: 'manage_admins',
  SYSTEM_SETTINGS: 'system_settings',
  VIEW_LOGS: 'view_logs',
  MANAGE_PERMISSIONS: 'manage_permissions'
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.USER
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  permissions: {
    type: [String],
    default: []
  },
  profileImage: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: '' }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user has required role
userSchema.methods.hasRole = function(requiredRole) {
  const roleHierarchy = {
    [ROLES.USER]: 1,
    [ROLES.ADMIN]: 2,
    [ROLES.SUPERADMIN]: 3
  };
  return roleHierarchy[this.role] >= roleHierarchy[requiredRole];
};

// Method to check permission
userSchema.methods.hasPermission = function(permission) {
  // Superadmin has all permissions
  if (this.role === ROLES.SUPERADMIN) return true;
  
  // Check specific permission
  return this.permissions.includes(permission);
};

// Virtual for checking admin status
userSchema.virtual('isAdmin').get(function() {
  return this.role === ROLES.ADMIN || this.role === ROLES.SUPERADMIN;
});

// Virtual for checking superadmin status
userSchema.virtual('isSuperAdmin').get(function() {
  return this.role === ROLES.SUPERADMIN;
});

// Set default permissions based on role
userSchema.pre('save', function(next) {
  if (this.isModified('role')) {
    switch (this.role) {
      case ROLES.ADMIN:
        this.permissions = [
          PERMISSIONS.MANAGE_PRODUCTS,
          PERMISSIONS.MANAGE_ORDERS,
          PERMISSIONS.VIEW_CUSTOMERS,
          PERMISSIONS.VIEW_ANALYTICS,
          PERMISSIONS.MANAGE_PROMOTIONS,
          PERMISSIONS.MANAGE_RETURNS
        ];
        break;
      case ROLES.SUPERADMIN:
        this.permissions = Object.values(PERMISSIONS);
        break;
      default:
        this.permissions = [];
    }
  }
  next();
});

// Ensure virtuals are included in JSON output
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  ROLES,
  PERMISSIONS
};
