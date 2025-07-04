const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const GuestCart = require('../models/GuestCart');
const Product = require('../models/Product');
const { v4: uuidv4 } = require('uuid');

// Helper function to calculate cart total
const calculateCartTotal = (items) => {
  return items.reduce((total, item) => {
    const price = item.price || (item.product?.price) || 0;
    const quantity = item.quantity || 0;
    return total + (price * quantity);
  }, 0);
};

// Helper function to format cart response
const formatCartResponse = (cart) => {
  if (!cart) {
    return { _id: null, items: [], total: 0 };
  }

  const validItems = cart.items.filter(item => item.product);

  return {
    _id: cart._id,
    items: validItems.map(item => ({
      product: {
        _id: item.product._id,
        name: item.product.name || 'Unknown Product',
        image: item.product.images?.[0]?.url || item.product.image,
        price: item.product.price || 0,
        stock: item.product.stock || 0,
        category: item.product.category
      },
      quantity: item.quantity || 0,
      price: item.price || item.product.price || 0
    })),
    total: calculateCartTotal(validItems)
  };
};

// Helper to get or create session ID
const getSessionId = (req, res) => {
  let sessionId = req.cookies.sessionId;
  if (!sessionId) {
    sessionId = uuidv4();
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict'
    });
  }
  return sessionId;
};

// @desc    Get cart (handles both authenticated and guest users)
// @route   GET /api/cart
// @access  Public/Private
const getCart = asyncHandler(async (req, res) => {
  if (!req.isGuest) {
    // Handle authenticated user
    console.log('Getting cart for authenticated user:', req.user._id);
    
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name images price stock'
    });
    
    if (!cart) {
      console.log('No cart found, creating new cart for user');
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    
    console.log('Returning cart with items:', cart.items.length);
    res.json(formatCartResponse(cart));
  } else {
    // Handle guest user
    console.log('Getting cart for guest user');
    const sessionId = getSessionId(req, res);
    
    let cart = await GuestCart.findOne({ sessionId }).populate({
      path: 'items.product',
      select: 'name images price stock'
    });
    
    if (!cart) {
      console.log('No guest cart found, creating new cart');
      cart = await GuestCart.create({ sessionId, items: [] });
    }
    
    console.log('Returning guest cart with items:', cart.items.length);
    res.json(formatCartResponse(cart));
  }
});

// @desc    Add item to cart (handles both authenticated and guest users)
// @route   POST /api/cart
// @access  Public/Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  
  if (!productId || !quantity) {
    res.status(400);
    throw new Error('Product ID and quantity are required');
  }

  // Find product
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // Check if requested quantity exceeds available stock
  if (quantity > product.stock) {
    res.status(400);
    throw new Error(`Sorry, only ${product.stock} items available in stock`);
  }

  if (!req.isGuest) {
    // Handle authenticated user
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
        total: 0
      });
    }
    
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity = quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }
    
    cart.total = calculateCartTotal(cart.items);
    await cart.save();
    
    const updatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name images price stock'
    });
    
    res.status(200).json(formatCartResponse(updatedCart));
  } else {
    // Handle guest user
    const sessionId = getSessionId(req, res);
    let cart = await GuestCart.findOne({ sessionId });
    
    if (!cart) {
      cart = new GuestCart({
        sessionId,
        items: [],
        total: 0
      });
    }
    
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity = quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }
    
    cart.total = calculateCartTotal(cart.items);
    await cart.save();
    
    const updatedCart = await GuestCart.findOne({ sessionId }).populate({
      path: 'items.product',
      select: 'name images price stock'
    });
    
    res.status(200).json(formatCartResponse(updatedCart));
  }
});

// @desc    Remove item from cart (handles both authenticated and guest users)
// @route   DELETE /api/cart/:productId
// @access  Public/Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  
  if (!req.isGuest) {
    // Handle authenticated user
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }
    
    cart.items = cart.items.filter(item => 
      item.product.toString() !== productId
    );
    
    cart.total = calculateCartTotal(cart.items);
    await cart.save();
    
    const updatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name images price stock'
    });
    
    res.status(200).json(formatCartResponse(updatedCart));
  } else {
    // Handle guest user
    const sessionId = getSessionId(req, res);
    let cart = await GuestCart.findOne({ sessionId });
    
    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }
    
    cart.items = cart.items.filter(item => 
      item.product.toString() !== productId
    );
    
    cart.total = calculateCartTotal(cart.items);
    await cart.save();
    
    const updatedCart = await GuestCart.findOne({ sessionId }).populate({
      path: 'items.product',
      select: 'name images price stock'
    });
    
    res.status(200).json(formatCartResponse(updatedCart));
  }
});

// @desc    Update cart item quantity (handles both authenticated and guest users)
// @route   PUT /api/cart/:productId
// @access  Public/Private
const updateCartItem = asyncHandler(async (req, res) => {
  console.log('updateCartItem called with:', {
    productId: req.params.productId,
    quantity: req.body.quantity,
    isGuest: req.isGuest,
    hasUser: !!req.user
  });

  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  // Find product to check stock
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if requested quantity exceeds available stock
  if (quantity > product.stock) {
    res.status(400);
    throw new Error(`Sorry, only ${product.stock} items available in stock`);
  }

  if (!req.isGuest) {
    // Handle authenticated user
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    const itemIndex = cart.items.findIndex(item =>
      item.product.toString() === productId
    );

    if (itemIndex === -1) {
      res.status(404);
      throw new Error('Item not found in cart');
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    cart.total = calculateCartTotal(cart.items);
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name images price stock'
    });

    res.status(200).json(formatCartResponse(updatedCart));
  } else {
    // Handle guest user
    const sessionId = getSessionId(req, res);
    let cart = await GuestCart.findOne({ sessionId });

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    const itemIndex = cart.items.findIndex(item =>
      item.product.toString() === productId
    );

    if (itemIndex === -1) {
      res.status(404);
      throw new Error('Item not found in cart');
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    cart.total = calculateCartTotal(cart.items);
    await cart.save();

    const updatedCart = await GuestCart.findOne({ sessionId }).populate({
      path: 'items.product',
      select: 'name images price stock'
    });

    res.status(200).json(formatCartResponse(updatedCart));
  }
});

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem
};
