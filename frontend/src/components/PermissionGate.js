import React from 'react';
import { useSelector } from 'react-redux';

// Component that renders children only if user has the required permission
export const PermissionGate = ({ permissions, children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  
  if (!userInfo || !userInfo.permissions) {
    return null;
  }
  
  // Check if user has any of the required permissions
  const hasPermission = Array.isArray(permissions)
    ? permissions.some(permission => userInfo.permissions.includes(permission))
    : userInfo.permissions.includes(permissions);
  
  return hasPermission ? <>{children}</> : null;
};

// Component that renders children only if user has the required role
export const RoleGate = ({ roles, children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  
  if (!userInfo || !userInfo.role) {
    return null;
  }
  
  // Check if user has the required role
  const hasRole = Array.isArray(roles)
    ? roles.includes(userInfo.role)
    : userInfo.role === roles;
  
  return hasRole ? <>{children}</> : null;
};

// Create a named object before exporting as default
const PermissionComponents = { PermissionGate, RoleGate };

export default PermissionComponents;
