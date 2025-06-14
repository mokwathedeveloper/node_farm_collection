import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

function SuperAdminPage() {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if not superadmin
    if (!userInfo) {
      console.log('SuperAdminPage - not logged in, redirecting to login');
      navigate('/login');
      return;
    }
    
    if (userInfo.role !== 'superadmin') {
      console.log('SuperAdminPage - not superadmin, redirecting to login');
      navigate('/login');
      return;
    }
    
    console.log('SuperAdminPage - access granted for:', userInfo.name);
  }, [userInfo, navigate]);

  if (!userInfo || userInfo.role !== 'superadmin') {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Superadmin Dashboard</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Welcome, {userInfo.name}</h2>
        <p className="text-gray-600 mb-2">Role: {userInfo.role}</p>
        <p className="text-gray-600 mb-4">Email: {userInfo.email}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Management */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">User Management</h3>
          <p className="text-gray-600 mb-4">Manage users, admins, and their permissions.</p>
          <Link 
            to="/superadmin/users" 
            className="inline-block bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
          >
            Manage Users
          </Link>
        </div>
        
        {/* System Settings */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">System Settings</h3>
          <p className="text-gray-600 mb-4">Configure system-wide settings and preferences.</p>
          <Link 
            to="/superadmin/settings" 
            className="inline-block bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
          >
            System Settings
          </Link>
        </div>
        
        {/* Permissions Management */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Permissions</h3>
          <p className="text-gray-600 mb-4">Manage user roles and permissions.</p>
          <Link 
            to="/superadmin/permissions" 
            className="inline-block bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
          >
            Manage Permissions
          </Link>
        </div>
        
        {/* System Logs */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">System Logs</h3>
          <p className="text-gray-600 mb-4">View system logs and activity.</p>
          <Link 
            to="/superadmin/logs" 
            className="inline-block bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
          >
            View Logs
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminPage;
