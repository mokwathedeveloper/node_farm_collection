const asyncHandler = require('express-async-handler');
const { User } = require('../models/User');
const Order = require('../models/orderModel');
const Product = require('../models/Product');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  // Get total users
  const totalUsers = await User.countDocuments();
  
  // Get total orders and revenue
  const orders = await Order.find({});
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
  
  // Get total products
  const totalProducts = await Product.countDocuments();
  
  // Get recent orders
  const recentOrders = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email')
    .populate('deliveryOption');
  
  // Get delivery stats
  const deliveryStats = {
    pending: await Order.countDocuments({ status: 'pending' }),
    processing: await Order.countDocuments({ status: 'processing' }),
    shipped: await Order.countDocuments({ status: 'shipped' }),
    delivered: await Order.countDocuments({ status: 'delivered' }),
    cancelled: await Order.countDocuments({ status: 'cancelled' })
  };
  
  res.json({
    totalUsers,
    totalOrders,
    totalRevenue,
    totalProducts,
    recentOrders,
    deliveryStats
  });
});

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = asyncHandler(async (req, res) => {
  // Get sales by month for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  // Get monthly sales data
  const monthlySales = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
        isPaid: true
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        total: { $sum: "$totalPrice" }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    }
  ]);

  // Format monthly sales data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const salesByMonth = [];
  
  // Initialize with last 6 months
  for (let i = 0; i < 6; i++) {
    const date = new Date(sixMonthsAgo);
    date.setMonth(date.getMonth() + i);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const monthData = monthlySales.find(
      sale => sale._id.year === year && sale._id.month === month + 1
    );
    
    salesByMonth.push({
      month: `${months[month]} ${year}`,
      total: monthData ? monthData.total : 0
    });
  }

  // Get sales by category
  const salesByCategory = await Order.aggregate([
    {
      $match: {
        isPaid: true
      }
    },
    {
      $unwind: "$items"
    },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "product"
      }
    },
    {
      $unwind: "$product"
    },
    {
      $group: {
        _id: "$product.category",
        total: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
      }
    },
    {
      $sort: { total: -1 }
    }
  ]);

  // Get user activity data
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get new users per day
  const newUsersData = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
    }
  ]);

  // Get active users per day (based on orders)
  const activeUsersData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
          user: "$user"
        }
      }
    },
    {
      $group: {
        _id: {
          year: "$_id.year",
          month: "$_id.month",
          day: "$_id.day"
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
    }
  ]);

  // Format user activity data
  const userActivity = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(thirtyDaysAgo);
    date.setDate(date.getDate() + i);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const newUsersEntry = newUsersData.find(
      entry => entry._id.year === year && entry._id.month === month && entry._id.day === day
    );

    const activeUsersEntry = activeUsersData.find(
      entry => entry._id.year === year && entry._id.month === month && entry._id.day === day
    );

    userActivity.push({
      date: date.toISOString().split('T')[0],
      newUsers: newUsersEntry ? newUsersEntry.count : 0,
      activeUsers: activeUsersEntry ? activeUsersEntry.count : 0
    });
  }
  
  res.json({
    salesByMonth,
    salesByCategory,
    userActivity
  });
});

module.exports = {
  getDashboardStats,
  getAnalytics
};
