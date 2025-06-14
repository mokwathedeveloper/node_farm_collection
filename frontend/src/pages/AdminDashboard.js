// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('/api/admin/dashboard-stats', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        });
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userInfo, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!userInfo || !userInfo.isAdmin) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm font-semibold hover:text-red-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="space-x-4">
          <Link 
            to="/admin/products/new" 
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-200"
          >
            Add New Product
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
          <Link to="/admin/products" className="text-sm text-blue-500 hover:text-blue-700 mt-2 inline-block">
            Manage Products →
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
          <Link to="/admin/orders" className="text-sm text-green-500 hover:text-green-700 mt-2 inline-block">
            View Orders →
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Customers</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalCustomers}</p>
          <Link to="/admin/customers" className="text-sm text-purple-500 hover:text-purple-700 mt-2 inline-block">
            View Customers →
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
          <p className="text-3xl font-bold text-yellow-600">
            ${stats.totalRevenue?.toFixed(2)}
          </p>
          <Link to="/admin/reports" className="text-sm text-yellow-500 hover:text-yellow-700 mt-2 inline-block">
            View Reports →
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link 
              to="/admin/products/new"
              className="block w-full bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600 transition duration-200"
            >
              Add New Product
            </Link>
            <Link 
              to="/admin/orders"
              className="block w-full bg-green-500 text-white py-2 px-4 rounded text-center hover:bg-green-600 transition duration-200"
            >
              View Orders
            </Link>
            <Link 
              to="/admin/products"
              className="block w-full bg-purple-500 text-white py-2 px-4 rounded text-center hover:bg-purple-600 transition duration-200"
            >
              Manage Products
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          {stats.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order._id} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Order #{order._id.slice(-8)}</p>
                      <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                      <p className="text-sm text-gray-600">
                        Status: {' '}
                        <span className={`font-semibold ${
                          order.isDelivered ? 'text-green-600' : 
                          order.isPaid ? 'text-blue-600' : 'text-yellow-600'
                        }`}>
                          {order.isDelivered ? 'Delivered' : 
                           order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.totalPrice?.toFixed(2)}</p>
                      <Link 
                        to={`/admin/order/${order._id}`}
                        className="text-sm text-blue-500 hover:text-blue-700"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              <Link 
                to="/admin/orders"
                className="text-blue-500 hover:text-blue-700 text-sm font-semibold inline-block mt-4"
              >
                View All Orders →
              </Link>
            </div>
          ) : (
            <p className="text-gray-600">No recent orders to display</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
