import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo || !userInfo.token) {
    // Redirect to login page but save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (location.pathname.startsWith('/admin') && !userInfo.isAdmin) {
    // Redirect to home page if admin access is required but user is not an admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
