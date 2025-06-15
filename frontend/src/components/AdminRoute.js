import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  // Check if user is logged in and has admin or superadmin role
  if (!userInfo || (userInfo.role !== 'admin' && userInfo.role !== 'superadmin')) {
    // Redirect to login if not authenticated or not admin/superadmin
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
