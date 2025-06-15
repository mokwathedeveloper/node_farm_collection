const Order = require('../models/orderModel');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const { sendOrderConfirmation, sendOrderStatusUpdate } = require('../utils/emailService');

// @desc    Get all orders
// @route   GET /api/orders/admin
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching admin orders...');

    const orders = await Order.find({})
      .populate('user', '_id name email')
      .populate('deliveryOption')
      .sort({ createdAt: -1 });

    console.log(`Found ${orders.length} orders`);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('deliveryOption');
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('deliveryOption');

  if (order) {
    // Make sure user is admin or the order belongs to the user
    if (req.user.isAdmin || order.user._id.toString() === req.user._id.toString()) {
      res.json(order);
    } else {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // Validate items and update product stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(400);
        throw new Error(`Product not found: ${item.product}`);
      }
      if (product.countInStock < item.qty) {
        res.status(400);
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }
      product.countInStock -= item.qty;
      await product.save();
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Send email confirmation (don't fail if email service is down)
    try {
      await sendOrderConfirmation(createdOrder, false);
    } catch (emailError) {
      console.error('Email service error:', emailError.message);
    }

    res.status(201).json(createdOrder);
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Verify order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this order');
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    // Send email notification (don't fail if email service is down)
    try {
      await sendOrderStatusUpdate(updatedOrder, false);
    } catch (emailError) {
      console.error('Email service error:', emailError.message);
    }

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Validate status
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  // Update order status
  order.status = status;

  // Update related fields based on status
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();

  // Send email notification (don't fail if email service is down)
  try {
    await sendOrderStatusUpdate(updatedOrder, false);
  } catch (emailError) {
    console.error('Email service error:', emailError.message);
  }

  res.json(updatedOrder);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'delivered';

    const updatedOrder = await order.save();

    // Send email notification (don't fail if email service is down)
    try {
      await sendOrderStatusUpdate(updatedOrder, false);
    } catch (emailError) {
      console.error('Email service error:', emailError.message);
    }

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Verify order belongs to user or user is admin
    if (!req.user.isAdmin && order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to cancel this order');
    }

    // Only allow cancellation if order is not delivered
    if (order.isDelivered) {
      res.status(400);
      throw new Error('Cannot cancel delivered order');
    }

    // Restore product stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock += item.qty;
        await product.save();
      }
    }

    order.status = 'cancelled';
    const updatedOrder = await order.save();

    // Send email notification (don't fail if email service is down)
    try {
      await sendOrderStatusUpdate(updatedOrder, false);
    } catch (emailError) {
      console.error('Email service error:', emailError.message);
    }

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

module.exports = {
  getOrders,
  getMyOrders,
  getOrderById,
  createOrder,
  updateOrderToPaid,
  updateOrderStatus,
  updateOrderToDelivered,
  cancelOrder
};
