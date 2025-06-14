const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const catchAsync = require('../utils/catchAsync');
const ErrorHandler = require('../utils/errorHandler');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = catchAsync(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  // If it's an admin request, return all products without pagination
  if (req.path === '/admin') {
    const products = await Product.find({});
    return res.json(products);
  }
    
  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  
  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = catchAsync(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    seller = 'Store'
  } = req.body;

  const product = new Product({
    name,
    price,
    description,
    image,
    brand,
    category,
    stock: Number(countInStock),
    seller,
    user: req.user._id,
    images: [{ url: image }]
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = catchAsync(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.stock = Number(countInStock);

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product removed successfully' });
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = catchAsync(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(5);
  res.json(products);
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const products = await Product.find({ category: req.params.category });
  res.json(products);
});

// @desc    Get all product categories
// @route   GET /api/products/categories
// @access  Public
const getProductCategories = catchAsync(async (req, res) => {
  const categories = await Product.distinct('category');
  
  res.status(200).json({
    success: true,
    categories
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 4;
  
  // Try to get a mix of featured and top-rated products
  let products = await Product.find({})
    .sort({ ratings: -1, createdAt: -1 })
    .limit(limit)
    .select('name price description images category stock ratings numOfReviews');

  if (!products || products.length === 0) {
    // If no products found, return empty array with success status
    return res.status(200).json({
      success: true,
      products: []
    });
  }

  res.status(200).json({
    success: true,
    products
  });
});

// @desc    Get products for comparison
// @route   GET /api/products/compare
// @access  Public
const getProductsForComparison = catchAsync(async (req, res) => {
  const { ids } = req.query;
  
  if (!ids) {
    return res.status(400).json({
      success: false,
      message: 'Please provide product IDs for comparison'
    });
  }
  
  const productIds = ids.split(',');
  const products = await Product.find({ _id: { $in: productIds } });
  
  res.status(200).json({
    success: true,
    products
  });
});

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    category: product.category
  }).limit(4);
  
  res.status(200).json({
    success: true,
    products: relatedProducts
  });
});

// @desc    Track product share
// @route   POST /api/products/:id/share
// @access  Public
const trackProductShare = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  product.shareCount = (product.shareCount || 0) + 1;
  await product.save();
  
  res.status(200).json({
    success: true,
    shareCount: product.shareCount
  });
});

// @desc    Track product view
// @route   POST /api/products/:id/view
// @access  Public
const trackProductView = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  product.viewCount = (product.viewCount || 0) + 1;
  await product.save();
  
  res.status(200).json({
    success: true,
    viewCount: product.viewCount
  });
});

// @desc    Get product specifications
// @route   GET /api/products/:id/specifications
// @access  Public
const getProductSpecifications = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id).select('specifications');
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  res.status(200).json({
    success: true,
    specifications: product.specifications || {}
  });
});

// @desc    Update product specifications
// @route   PUT /api/products/:id/specifications
// @access  Private/Admin
const updateProductSpecifications = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  product.specifications = req.body.specifications;
  await product.save();
  
  res.status(200).json({
    success: true,
    specifications: product.specifications
  });
});

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id).select('reviews');
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  res.status(200).json({
    success: true,
    reviews: product.reviews
  });
});

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getProductReviews,
  getProductCategories,
  getFeaturedProducts,
  getProductsForComparison,
  getRelatedProducts,
  trackProductShare,
  trackProductView,
  getProductSpecifications,
  updateProductSpecifications,
  getTopProducts,
  getProductsByCategory
};
