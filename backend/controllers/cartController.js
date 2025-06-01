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
  