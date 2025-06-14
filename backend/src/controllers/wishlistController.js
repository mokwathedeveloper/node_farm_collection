const asyncHandler = require('express-async-handler');
const { User } = require('../models/User');
const Product = require('../models/Product');

// Get user wishlist
const getWishlist = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Populate wishlist with product details
    await user.populate({
      path: 'wishlist',
      model: 'Product',
      select: 'name price description image'
    });
    
    res.json(user.wishlist);
  } catch (error) {
    console.error('Error in getWishlist:', error);
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
});

// Add product to wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Check if product is already in wishlist
    if (user.wishlist.includes(productId)) {
      res.status(400).json({ message: 'Product already in wishlist' });
      return;
    }
    
    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();
    
    // Populate wishlist with product details
    await user.populate({
      path: 'wishlist',
      model: 'Product',
      select: 'name price description image'
    });
    
    res.status(201).json({ message: 'Product added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error('Error in addToWishlist:', error);
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
  }
});

// Remove product from wishlist
const removeFromWishlist = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Check if product is in wishlist
    if (!user.wishlist.includes(productId)) {
      res.status(400).json({ message: 'Product not in wishlist' });
      return;
    }
    
    // Remove from wishlist
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    
    // Populate wishlist with product details
    await user.populate({
      path: 'wishlist',
      model: 'Product',
      select: 'name price description image'
    });
    
    res.json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error('Error in removeFromWishlist:', error);
    res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
  }
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
