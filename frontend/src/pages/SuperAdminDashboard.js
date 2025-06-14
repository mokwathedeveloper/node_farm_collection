import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SuperAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    systemHealth: {
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      uptime: 0
    },
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    recentActivity: [],
    userGrowth: [],
    salesTrends: [],
    errorLogs: []
  });

  useEffect(() => {
    fetchSystemStats();
  }, []);

  const fetchSystemStats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/superadmin/system-stats');
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch system statistics');
      toast.error('Failed to fetch system statistics');
    } finally {
      setLoading(false);
    }
  };

  const userGrowthData = {
    labels: stats.userGrowth.map(data => data.date),
    datasets: [
      {
        label: 'New Users',
        data: stats.userGrowth.map(data => data.count),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false
      }
    ]
  };

  const salesTrendsData = {
    labels: stats.salesTrends.map(data => data.period),
    datasets: [
      {
        label: 'Sales',
        data: stats.salesTrends.map(data => data.amount),
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      }
    ]
  };

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
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">System Overview</h1>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">CPU Usage</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.systemHealth.cpuUsage}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Memory Usage</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.systemHealth.memoryUsage}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Disk Usage</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.systemHealth.diskUsage}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">System Uptime</h3>
          <p className="text-3xl font-bold text-gray-900">{Math.floor(stats.systemHealth.uptime / 86400)} days</p>
        </div>
      </div>

      {/* Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">User Growth</h2>
          <Line data={userGrowthData} options={{ responsive: true }} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Sales Trends</h2>
          <Bar data={salesTrendsData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Recent Activity & Error Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  activity.type === 'user' ? 'bg-blue-100 text-blue-800' :
                  activity.type === 'order' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Error Logs</h2>
          <div className="space-y-4">
            {stats.errorLogs.map((log, index) => (
              <div key={index} className="p-4 bg-red-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-red-800">{log.message}</p>
                  <span className="text-xs text-red-500">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-xs text-red-600 mt-2">{log.stack}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard; 