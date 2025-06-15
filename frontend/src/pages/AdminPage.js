// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

function AdminPage() {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only allow admin role, not superadmin
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Welcome, {userInfo?.name}</h2>
        <p className="text-gray-600 mb-2">Role: {userInfo?.role}</p>
        <p className="text-gray-600 mb-4">Email: {userInfo?.email}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Product Management */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Product Management</h3>
          <p className="text-gray-600 mb-4">Add, edit, and manage products in the store.</p>
          <Link 
            to="/admin/products" 
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Manage Products
          </Link>
        </div>
        
        {/* Order Management */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Order Management</h3>
          <p className="text-gray-600 mb-4">View and manage customer orders.</p>
          <Link 
            to="/admin/orders" 
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Manage Orders
          </Link>
        </div>
        
        {/* Customer Management */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Customer Management</h3>
          <p className="text-gray-600 mb-4">View customer accounts and details.</p>
          <Link 
            to="/admin/customers" 
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            View Customers
          </Link>
        </div>
        
        {/* Analytics */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Sales Analytics</h3>
          <p className="text-gray-600 mb-4">View sales reports and analytics.</p>
          <Link 
            to="/admin/analytics" 
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            View Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
