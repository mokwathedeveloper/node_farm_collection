import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  
  if (!userInfo) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allow access to protected route
  return <Outlet />;
};

export default ProtectedRoute;
