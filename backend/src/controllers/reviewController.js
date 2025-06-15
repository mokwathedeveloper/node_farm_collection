const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.productId);

  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400).json({ message: 'You already reviewed this product' });
    return;
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.numOfReviews = product.reviews.length;
  product.ratings =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added', review });
});

const deleteReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const reviewIndex = product.reviews.findIndex(
    (r) => r._id.toString() === reviewId
  );

  if (reviewIndex === -1) {
    res.status(404).json({ message: 'Review not found' });
    return;
  }

  product.reviews.splice(reviewIndex, 1);
  product.numOfReviews = product.reviews.length;
  product.ratings =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;

  await product.save();
  res.json({ message: 'Review deleted' });
});

const updateReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.params;
  const { rating, comment } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const review = product.reviews.find(r => r._id.toString() === reviewId);

  if (!review) {
    res.status(404).json({ message: 'Review not found' });
    return;
  }

  // Check if user owns the review
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403).json({ message: 'Not authorized to update this review' });
    return;
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;

  // Recalculate average rating
  product.numOfReviews = product.reviews.length;
  product.ratings = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.json({ message: 'Review updated', review });
});

const getProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId).select('reviews');

  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  res.json({
    success: true,
    reviews: product.reviews
  });
});

const getUserReviews = asyncHandler(async (req, res) => {
  const products = await Product.find({ 'reviews.user': req.user._id });

  const userReviews = [];
  products.forEach(product => {
    const userReview = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (userReview) {
      userReviews.push({
        ...userReview.toObject(),
        productId: product._id,
        productName: product.name
      });
    }
  });

  res.json({
    success: true,
    reviews: userReviews
  });
});

const getReviewById = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const review = product.reviews.find(r => r._id.toString() === reviewId);

  if (!review) {
    res.status(404).json({ message: 'Review not found' });
    return;
  }

  res.json({
    success: true,
    review
  });
});

const reportReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.params;
  const { reason } = req.body;

  // For now, just log the report - in a real app you'd store this in a reports collection
  console.log(`Review reported: Product ${productId}, Review ${reviewId}, Reason: ${reason}`);

  res.json({ message: 'Review reported successfully' });
});

const getReportedReviews = asyncHandler(async (req, res) => {
  // For now, return empty array - in a real app you'd fetch from a reports collection
  res.json({
    success: true,
    reports: []
  });
});

module.exports = {
  addReview,
  deleteReview,
  updateReview,
  getProductReviews,
  getUserReviews,
  getReviewById,
  reportReview,
  getReportedReviews
};