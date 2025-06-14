import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SuperAdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  
  // Check if user is logged in and has superadmin role
  if (!userInfo || !userInfo.isSuperAdmin) {
    // Redirect to login if not authenticated or not superadmin
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <Outlet />;
};

export default SuperAdminRoute;
