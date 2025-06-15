/**
 * Permission definitions for role-based access control
 */

// Client permissions
const CLIENT_PERMISSIONS = [
  'view_products',
  'manage_own_profile',
  'place_orders',
  'view_own_orders',
  'manage_cart'
];

// Admin permissions
const ADMIN_PERMISSIONS = [
  ...CLIENT_PERMISSIONS,
  'manage_products',
  'view_all_orders',
  'update_order_status',
  'view_clients',
  'manage_clients'
];

// Super Admin permissions
const SUPERADMIN_PERMISSIONS = [
  ...ADMIN_PERMISSIONS,
  'manage_admins',
  'view_analytics',
  'manage_site_settings',
  'manage_permissions',
  'system_backup',
  'system_restore'
];

// Permission mapping by role
const ROLE_PERMISSIONS = {
  client: CLIENT_PERMISSIONS,
  admin: ADMIN_PERMISSIONS,
  superadmin: SUPERADMIN_PERMISSIONS
};

// Get permissions for a specific role
const getPermissionsForRole = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

// Check if a role has a specific permission
const roleHasPermission = (role, permission) => {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};

module.exports = {
  CLIENT_PERMISSIONS,
  ADMIN_PERMISSIONS,
  SUPERADMIN_PERMISSIONS,
  getPermissionsForRole,
  roleHasPermission
};