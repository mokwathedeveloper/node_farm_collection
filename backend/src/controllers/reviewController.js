const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

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
  product.averageRating =
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
  product.averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;

  await product.save();
  res.json({ message: 'Review deleted' });
});

module.exports = { addReview, deleteReview };