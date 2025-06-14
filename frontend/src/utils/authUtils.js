import api from '../config/api';
import { store } from '../redux/store';
import { logout, updateUserInfo } from '../redux/slices/authSlice';

/**
 * Validates that the frontend auth state is aligned with the backend
 * @returns {Promise<boolean>} True if aligned, false if not
 */
export const validateAuthAlignment = async () => {
  try {
    // Get current auth state from Redux
    const { userInfo } = store.getState().auth;
    
    // If no user is logged in, no need to validate
    if (!userInfo) {
      console.log('No user logged in, skipping validation');
      return true;
    }
    
    // Call backend validation endpoint - remove the /api prefix since it's already in the baseURL
    const response = await api.get('/users/validate-alignment');
    const backendUserData = response.data;
    
    // Compare critical fields
    const isAligned = (
      userInfo.id === backendUserData.id &&
      userInfo.isAdmin === backendUserData.isAdmin &&
      userInfo.role === backendUserData.role
    );
    
    if (!isAligned) {
      console.warn('Auth state misalignment detected:', {
        frontend: {
          id: userInfo.id,
          isAdmin: userInfo.isAdmin,
          role: userInfo.role
        },
        backend: {
          id: backendUserData.id,
          isAdmin: backendUserData.isAdmin,
          role: backendUserData.role
        }
      });
      
      // Update frontend state to match backend
      store.dispatch(updateUserInfo({
        ...userInfo,
        isAdmin: backendUserData.isAdmin,
        role: backendUserData.role,
        permissions: backendUserData.permissions
      }));
    }
    
    return isAligned;
  } catch (error) {
    console.error('Auth validation failed:', error);
    
    // If we get a 401 error, the token is invalid - log the user out
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Invalid authentication detected, logging out');
      store.dispatch(logout());
    }
    
    return false;
  }
};

/**
 * Checks if the current user has a specific permission
 * @param {string} permission The permission to check
 * @returns {boolean} True if the user has the permission
 */
export const hasPermission = (permission) => {
  const { userInfo } = store.getState().auth;
  
  if (!userInfo) return false;
  
  // Superadmins have all permissions
  if (userInfo.role === 'superadmin') return true;
  
  // Define admin-specific permissions
  const adminPermissions = [
    'view_products',
    'edit_products',
    'view_orders',
    'edit_orders',
    'view_customers',
    'view_analytics',
    'manage_inventory'
  ];
  
  // Check admin permissions
  if (userInfo.role === 'admin') {
    return adminPermissions.includes(permission);
  }
  
  // Check user's permission array
  return userInfo.permissions && userInfo.permissions.includes(permission);
};