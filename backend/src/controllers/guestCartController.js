const asyncHandler = require('express-async-handler');
const GuestCart = require('../models/GuestCart');
const Product = require('../models/Product');
const { v4: uuidv4 } = require('uuid');

// Helper to get or create session ID
const getSessionId = (req) => {
  if (!req.cookies.sessionId) {
    const sessionId = uuidv4();
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict'
    });
    return sessionId;
  }
  return req.cookies.sessionId;
};

// @desc    Get guest cart
// @route   GET /api/guest-cart
// @access  Public
const getGuestCart = asyncHandler(async (req, res) => {
  const sessionId = getSessionId(req);
  
  let cart = await GuestCart.findOne({ sessionId })
    .populate('items.product', 'name image price');
  
  if (!cart) {
    // Create a new cart if none exists
    cart = await GuestCart.create({
      sessionId,
      items: [],
      totalAmount: 0
    });
  }
  
  res.json(cart);
});

// @desc    Add item to guest cart
// @route   POST /api/guest-cart
// @access  Public
const addToGuestCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const sessionId = getSessionId(req);
  
  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // Find guest cart or create new one
  let cart = await GuestCart.findOne({ sessionId });
  if (!cart) {
    cart = await GuestCart.create({
      sessionId,
      items: [],
      totalAmount: 0
    });
  }
  
  // Check if product already in cart
  const itemIndex = cart.items.findIndex(item => 
    item.product.toString() === productId
  );
  
  if (itemIndex > -1) {
    // Product exists in cart, update quantity
    cart.items[itemIndex].quantity += quantity;
  } else {
    // Product not in cart, add new item
    cart.items.push({
      product: productId,
      quantity,
      price: product.price
    });
  }
  
  // Save cart
  await cart.save();
  
  // Return updated cart
  res.status(201).json(await cart.populate('items.product', 'name image price'));
});

// @desc    Update guest cart item quantity
// @route   PUT /api/guest-cart/:productId
// @access  Public
const updateGuestCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const sessionId = getSessionId(req);
  
  if (!quantity || quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }
  
  // Find guest cart
  const cart = await GuestCart.findOne({ sessionId });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  
  // Find item in cart
  const itemIndex = cart.items.findIndex(item => 
    item.product.toString() === productId
  );
  
  if (itemIndex === -1) {
    res.status(404);
    throw new Error('Item not found in cart');
  }
  
  // Update quantity
  cart.items[itemIndex].quantity = quantity;
  
  // Save cart
  await cart.save();
  
  // Return updated cart
  res.json(await cart.populate('items.product', 'name image price'));
});

// @desc    Remove item from guest cart
// @route   DELETE /api/guest-cart/:productId
// @access  Public
const removeFromGuestCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const sessionId = getSessionId(req);
  
  // Find guest cart
  const cart = await GuestCart.findOne({ sessionId });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  
  // Remove item from cart
  cart.items = cart.items.filter(item => 
    item.product.toString() !== productId
  );
  
  // Save cart
  await cart.save();
  
  // Return updated cart
  res.json(await cart.populate('items.product', 'name image price'));
});

// @desc    Clear guest cart
// @route   DELETE /api/guest-cart
// @access  Public
const clearGuestCart = asyncHandler(async (req, res) => {
  const sessionId = getSessionId(req);
  
  // Find guest cart
  const cart = await GuestCart.findOne({ sessionId });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  
  // Clear items
  cart.items = [];
  
  // Save cart
  await cart.save();
  
  res.json({ message: 'Cart cleared' });
});

// @desc    Transfer guest cart to user cart
// @route   POST /api/guest-cart/transfer
// @access  Private
const transferGuestCart = asyncHandler(async (req, res) => {
  const sessionId = req.cookies.sessionId;
  const userId = req.user._id;
  
  if (!sessionId) {
    res.status(400);
    throw new Error('No guest cart found');
  }
  
  // Find guest cart
  const guestCart = await GuestCart.findOne({ sessionId });
  if (!guestCart || guestCart.items.length === 0) {
    res.status(404);
    throw new Error('Guest cart not found or empty');
  }
  
  // Find user cart or create new one
  let userCart = await Cart.findOne({ user: userId });
  if (!userCart) {
    userCart = await Cart.create({
      user: userId,
      items: [],
      totalAmount: 0
    });
  }
  
  // Transfer items from guest cart to user cart
  for (const guestItem of guestCart.items) {
    const existingItemIndex = userCart.items.findIndex(
      item => item.product.toString() === guestItem.product.toString()
    );
    
    if (existingItemIndex > -1) {
      // Item exists in user cart, update quantity
      userCart.items[existingItemIndex].quantity += guestItem.quantity;
    } else {
      // Add new item to user cart
      userCart.items.push({
        product: guestItem.product,
        quantity: guestItem.quantity,
        price: guestItem.price
      });
    }
  }
  
  // Save user cart
  await userCart.save();
  
  // Clear guest cart
  await GuestCart.findOneAndDelete({ sessionId });
  
  // Clear session cookie
  res.clearCookie('sessionId');
  
  // Return updated user cart
  res.json(await userCart.populate('items.product', 'name image price'));
});

module.exports = {
  getGuestCart,
  addToGuestCart,
  updateGuestCartItem,
  removeFromGuestCart,
  clearGuestCart,
  transferGuestCart
};