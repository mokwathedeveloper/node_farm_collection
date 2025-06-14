import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Rating,
  Divider,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  Paper,
  Chip,
  IconButton,
  ImageList,
  ImageListItem,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  CompareArrows as CompareArrowsIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import RelatedProducts from '../components/RelatedProducts';
import ProductReviewForm from '../components/ProductReviewForm';
import SizeGuide from '../components/SizeGuide';
import ProductComparison from '../components/ProductComparison';
import SocialShare from '../components/SocialShare';
import axios from 'axios';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product details');
      toast.error('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    const success = await addToCart(product, quantity);
    if (success) {
      toast.success(`${product.name} added to cart`);
    }
  };

  const handleAddToWishlist = async () => {
    const success = await addToWishlist(product);
    if (success) {
      toast.success(`${product.name} added to wishlist`);
    }
  };

  const handleShare = () => {
    navigator.share({
      title: product.name,
      text: product.description,
      url: window.location.href,
    }).catch(() => {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Product not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                <Box
                  component="img"
                  src={product.images[selectedImage]?.url || 'https://via.placeholder.com/500'}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    height: 400,
                    objectFit: 'contain',
                    mb: 2,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
                <ImageList sx={{ height: 100 }} cols={4} rowHeight={100}>
                  {product.images.map((image, index) => (
                    <ImageListItem
                      key={image.url}
                      sx={{
                        cursor: 'pointer',
                        border: index === selectedImage ? '2px solid' : 'none',
                        borderColor: 'primary.main',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                        },
                      }}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} ${index + 1}`}
                        style={{ objectFit: 'contain' }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Paper>
            </motion.div>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={product.ratings} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({product.numOfReviews} reviews)
                </Typography>
              </Box>

              <Typography variant="h5" color="primary" gutterBottom>
                ${product.price.toFixed(2)}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Chip label={product.category} color="primary" />
                <Chip
                  label={product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  color={product.stock > 0 ? 'success' : 'error'}
                />
                {product.category === 'clothing' && (
                  <Chip
                    label="Size Guide"
                    variant="outlined"
                    onClick={() => setShowSizeGuide(true)}
                    sx={{ cursor: 'pointer' }}
                  />
                )}
              </Box>

              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ mx: 2 }}>{quantity}</Typography>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                >
                  <AddIcon />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ flex: 1 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<CartIcon />}
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    fullWidth
                  >
                    Add to Cart
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <IconButton
                    color={isInWishlist(product._id) ? 'primary' : 'default'}
                    onClick={handleAddToWishlist}
                    sx={{ border: 1 }}
                  >
                    <FavoriteIcon />
                  </IconButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <IconButton 
                    onClick={() => setShowShare(true)} 
                    sx={{ border: 1 }}
                  >
                    <ShareIcon />
                  </IconButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Tooltip title="Compare with other products">
                    <IconButton
                      onClick={() => setShowComparison(true)}
                      sx={{ border: 1 }}
                    >
                      <CompareArrowsIcon />
                    </IconButton>
                  </Tooltip>
                </motion.div>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ width: '100%' }}>
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  sx={{ mb: 2 }}
                >
                  <Tab label="Description" />
                  <Tab label="Reviews" />
                  <Tab label="Shipping" />
                </Tabs>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 0 && (
                      <Typography variant="body1">
                        {product.description}
                      </Typography>
                    )}

                    {activeTab === 1 && (
                      <Box>
                        {product.reviews.map((review) => (
                          <motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <Paper sx={{ p: 2, mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Rating value={review.rating} readOnly size="small" />
                                <Typography variant="subtitle2" sx={{ ml: 1 }}>
                                  {review.name}
                                </Typography>
                              </Box>
                              <Typography variant="body2">{review.comment}</Typography>
                            </Paper>
                          </motion.div>
                        ))}
                        <ProductReviewForm
                          productId={product._id}
                          onReviewSubmitted={fetchProductDetails}
                        />
                      </Box>
                    )}

                    {activeTab === 2 && (
                      <Box>
                        <Typography variant="body1" paragraph>
                          Free shipping on orders over $50
                        </Typography>
                        <Typography variant="body1" paragraph>
                          Estimated delivery: 3-5 business days
                        </Typography>
                      </Box>
                    )}
                  </motion.div>
                </AnimatePresence>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>

      {/* Related Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Related Products
          </Typography>
          <RelatedProducts
            category={product.category}
            currentProductId={product._id}
          />
        </Box>
      </motion.div>

      {/* Size Guide Modal */}
      <SizeGuide
        open={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        category={product.category}
      />

      <ProductComparison
        open={showComparison}
        onClose={() => setShowComparison(false)}
        currentProduct={product}
      />

      <SocialShare
        open={showShare}
        onClose={() => setShowShare(false)}
        product={product}
      />
    </Container>
  );
};

export default ProductDetailsPage;
