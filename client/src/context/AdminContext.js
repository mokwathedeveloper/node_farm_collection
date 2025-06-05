import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  
  // Check if user is logged in as admin on page load
  useEffect(() => {
    const checkAdminStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setAdminLoading(false);
        return;
      }
      
      try {
        api.setAuthToken(token);
        const response = await api.getCurrentUser();
        const user = response.data.data.user;
        
        if (user && user.role === 'admin') {
          setIsAdmin(true);
          setAdminUser(user);
        } else {
          setIsAdmin(false);
          setAdminUser(null);
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsAdmin(false);
        setAdminUser(null);
        api.removeAuthToken();
      } finally {
        setAdminLoading(false);
      }
    };
    
    checkAdminStatus();
  }, []);
  
  // Admin login
  const adminLogin = async (email, password) => {
    setAdminError(null);
    
    try {
      const response = await api.adminLogin(email, password);
      const { token, data } = response.data;
      
      if (data.user.role !== 'admin') {
        setAdminError('You do not have admin privileges');
        return false;
      }
      
      api.setAuthToken(token);
      setIsAdmin(true);
      setAdminUser(data.user);
      return true;
    } catch (err) {
      console.error('Admin login error:', err);
      setAdminError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };
  
  // Admin logout
  const adminLogout = () => {
    api.removeAuthToken();
    setIsAdmin(false);
    setAdminUser(null);
  };
  
  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        adminLoading,
        adminError,
        adminUser,
        adminLogin,
        adminLogout
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
