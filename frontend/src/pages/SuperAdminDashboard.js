import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
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
      // Add cache-busting parameter to ensure fresh data
      const timestamp = new Date().getTime();
      const { data } = await api.get(`/superadmin/system-stats?t=${timestamp}`);

      // Use real data from backend
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch system statistics');
      toast.error('Failed to fetch system statistics');
    } finally {
      setLoading(false);
    }
  };

  const userGrowthData = {
    labels: stats.userGrowth?.map(data => `${data._id?.month}/${data._id?.year}`) || [],
    datasets: [
      {
        label: 'New Users',
        data: stats.userGrowth?.map(data => data.count) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.1,
        fill: true
      }
    ]
  };

  const salesTrendsData = {
    labels: stats.salesTrends?.map(data => `${data._id?.month}/${data._id?.year}`) || [],
    datasets: [
      {
        label: 'Revenue ($)',
        data: stats.salesTrends?.map(data => data.revenue) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">System Overview</h1>
              <p className="mt-2 text-sm text-gray-600">Monitor system performance and business metrics</p>
            </div>
            <button
              onClick={fetchSystemStats}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>

        {/* System Health */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
              <h3 className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wide">CPU Usage</h3>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{Math.round(stats.systemHealth?.cpuUsage || 0)}%</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min(stats.systemHealth?.cpuUsage || 0, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
              <h3 className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wide">Memory Usage</h3>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{Math.round(stats.systemHealth?.memoryUsage || 0)}%</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${Math.min(stats.systemHealth?.memoryUsage || 0, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
              <h3 className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wide">Disk Usage</h3>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{Math.round(stats.systemHealth?.diskUsage || 0)}%</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: `${Math.min(stats.systemHealth?.diskUsage || 0, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
              <h3 className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wide">System Uptime</h3>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{Math.floor((stats.systemHealth?.uptime || 0) / 86400)} days</p>
              <p className="text-xs text-gray-500 mt-1">
                {Math.floor(((stats.systemHealth?.uptime || 0) % 86400) / 3600)}h {Math.floor(((stats.systemHealth?.uptime || 0) % 3600) / 60)}m
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
              <h3 className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wide">Database Status</h3>
              <p className={`text-2xl lg:text-3xl font-bold mt-2 ${
                stats.systemHealth?.databaseStatus === 'connected' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.systemHealth?.databaseStatus === 'connected' ? '✓ Connected' : '✗ Disconnected'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                MongoDB Status
              </p>
            </div>
          </div>
        </div>

        {/* Business Metrics */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
              <h3 className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wide">Total Revenue</h3>
              <p className="text-2xl lg:text-3xl font-bold text-green-600 mt-2">${(stats.totalRevenue || 0).toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
              <h3 className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wide">Total Orders</h3>
              <p className="text-2xl lg:text-3xl font-bold text-blue-600 mt-2">{stats.totalOrders || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
              <h3 className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wide">Total Users</h3>
              <p className="text-2xl lg:text-3xl font-bold text-purple-600 mt-2">{stats.totalUsers || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
              <h3 className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wide">Total Products</h3>
              <p className="text-2xl lg:text-3xl font-bold text-orange-600 mt-2">{stats.totalProducts || 0}</p>
            </div>
          </div>
        </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-semibold mb-4">User Growth</h2>
          <div className="h-64 lg:h-80">
            <Line data={userGrowthData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-semibold mb-4">Sales Trends</h2>
          <div className="h-64 lg:h-80">
            <Bar data={salesTrendsData} options={chartOptions} />
          </div>
        </div>
      </div>

        {/* Recent Activity & Error Logs */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {stats.recentActivity?.length > 0 ? stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Order #{activity._id} - ${activity.totalPrice?.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.user?.name} • {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                    activity.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    activity.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              )) : (
                <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold mb-4">System Logs</h2>
            <div className="space-y-3">
              {stats.errorLogs?.length > 0 ? stats.errorLogs.map((log, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  log.level === 'error' ? 'bg-red-50 border-red-200' :
                  log.level === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-green-50 border-green-200'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-1 sm:space-y-0">
                    <p className={`text-sm font-medium pr-2 ${
                      log.level === 'error' ? 'text-red-800' :
                      log.level === 'warning' ? 'text-yellow-800' :
                      'text-green-800'
                    }`}>{log.message}</p>
                    <span className={`text-xs whitespace-nowrap ${
                      log.level === 'error' ? 'text-red-500' :
                      log.level === 'warning' ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      log.level === 'error' ? 'text-red-600 bg-red-100' :
                      log.level === 'warning' ? 'text-yellow-600 bg-yellow-100' :
                      'text-green-600 bg-green-100'
                    }`}>
                      {log.level}
                    </span>
                    <span className={`text-xs ml-2 ${
                      log.level === 'error' ? 'text-red-500' :
                      log.level === 'warning' ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      {log.source}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500 text-center py-4">No system logs available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard; 