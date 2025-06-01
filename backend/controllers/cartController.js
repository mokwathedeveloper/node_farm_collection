const mongoose = require('mongoose');
const Product = mongoose.model('Product');

// We'll use a simple in-memory cart store for this example
// In a production app, you'd use a database collection
const carts = new Map();

// Helper to get or create a cart
const getCart = (userId) => {
  if (!carts.has(userId)) {
    carts.set(userId, { 
      items: [], 
      userId,
      createdAt: new Date()
    });
  }
  return carts.get(userId);
};

// Calculate cart totals
const calculateCartTotals = async (cart) => {
  // Get all product IDs from cart
  const productIds = cart.items.map(item => item.productId);
  
  // Fetch all products in one query
  const products = await Product.find({ _id: { $in: productIds } });
  
  // Create a map of products by ID for easy lookup
  const productMap = new Map();
  products.forEach(product => {
    productMap.set(product._id.toString(), product);
  });
  
  // Calculate totals and add product details
  let totalPrice = 0;
  const enrichedItems = cart.items.map(item => {
    const product = productMap.get(item.productId.toString());
    const itemTotal = product.price * item.quantity;
    totalPrice += itemTotal;
    
    return {
      product: {
        _id: product._id,
        productName: product.productName,
        price: product.price,
        image: product.image
      },
      quantity: item.quantity,
      total: itemTotal
    };
  });
  
  return {
    items: enrichedItems,
    totalPrice,
    itemCount: enrichedItems.length,
    userId: cart.userId
  };
};

// Get cart
exports.getCart = async (req, res) => {
  try {
    // In a real app, get userId from authenticated session
    const userId = req.cookies.userId || 'anonymous';
    
    const cart = getCart(userId);
    const enrichedCart = await calculateCartTotals(cart);
    
    res.status(200).json({
      status: 'success',
      data: {
        cart: enrichedCart
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const quantity = parseInt(req.body.quantity) || 1;
    
    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found'
      });
    }
    
    // Get userId (in a real app, from authenticated session)
    const userId = req.cookies.userId || 'anonymous';
    
    // Get or create cart
    const cart = getCart(userId);
    
    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity if product already in cart
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        productId: new mongoose.Types.ObjectId(productId),
        quantity
      });
    }
    
    // Calculate updated cart totals
    const enrichedCart = await calculateCartTotals(cart);
    
    res.status(200).json({
      status: 'success',
      data: {
        cart: enrichedCart
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
