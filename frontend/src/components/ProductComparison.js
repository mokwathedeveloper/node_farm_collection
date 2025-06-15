import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Paper,
  Rating,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Autocomplete,
  TextField,
} from '@mui/material';
import {
  Close as CloseIcon,
  CompareArrows as CompareIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductComparison = ({ open, onClose, currentProduct }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProducts({
        category: currentProduct.category,
        limit: 20,
      });
      // Filter out the current product
      const filteredProducts = response.data.filter(
        (product) => product._id !== currentProduct._id
      );
      setProducts(filteredProducts);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products for comparison');
    } finally {
      setLoading(false);
    }
  }, [currentProduct]);

  useEffect(() => {
    if (open && currentProduct) {
      setSelectedProducts([currentProduct]);
      fetchProducts();
    }
  }, [open, currentProduct, fetchProducts]);

  const handleProductSelect = (product) => {
    if (product && !selectedProducts.find((p) => p._id === product._id)) {
      setSelectedProducts((prev) => [...prev, product].slice(0, 3));
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  const ComparisonRow = ({ label, getValue }) => (
    <Grid container sx={{ py: 1, borderBottom: 1, borderColor: 'divider' }}>
      <Grid item xs={3}>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
      </Grid>
      {selectedProducts.map((product) => (
        <Grid item xs key={product._id} sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40px' }}>
            {typeof getValue(product) === 'string' ? (
              <Typography>{getValue(product)}</Typography>
            ) : (
              getValue(product)
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '80vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CompareIcon />
          <Typography variant="h6">Compare Products</Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Autocomplete
            options={products}
            getOptionLabel={(option) => option.name}
            onChange={(_, value) => handleProductSelect(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add product to compare"
                variant="outlined"
                fullWidth
              />
            )}
            loading={loading}
            disabled={selectedProducts.length >= 3}
          />
        </Box>

        <AnimatePresence>
          {selectedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                {/* Product Images */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={3} />
                  {selectedProducts.map((product) => (
                    <Grid item xs key={product._id}>
                      <Box sx={{ position: 'relative' }}>
                        {product._id !== currentProduct._id && (
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveProduct(product._id)}
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              zIndex: 1,
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                        <img
                          src={product.images[0]?.url || 'https://via.placeholder.com/200'}
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: 200,
                            objectFit: 'contain',
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Comparison Rows */}
                <ComparisonRow
                  label="Name"
                  getValue={(product) => (
                    <Typography variant="subtitle1" fontWeight="bold">
                      {product.name}
                    </Typography>
                  )}
                />

                <ComparisonRow
                  label="Price"
                  getValue={(product) => (
                    <Typography color="primary" fontWeight="bold">
                      ${product.price.toFixed(2)}
                    </Typography>
                  )}
                />

                <ComparisonRow
                  label="Rating"
                  getValue={(product) => (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                      <Rating value={product.ratings} precision={0.5} readOnly size="small" />
                      <Typography variant="body2">({product.numOfReviews})</Typography>
                    </Box>
                  )}
                />

                <ComparisonRow
                  label="Stock"
                  getValue={(product) => (
                    <Chip
                      size="small"
                      label={product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      color={product.stock > 0 ? 'success' : 'error'}
                    />
                  )}
                />

                <ComparisonRow
                  label="Category"
                  getValue={(product) => product.category}
                />

                <ComparisonRow
                  label="Description"
                  getValue={(product) => (
                    <Typography variant="body2" sx={{ px: 2 }}>
                      {product.description}
                    </Typography>
                  )}
                />

                {/* Add to Cart Buttons */}
                <Grid container sx={{ mt: 3 }}>
                  <Grid item xs={3} />
                  {selectedProducts.map((product) => (
                    <Grid item xs key={product._id} sx={{ textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        sx={{ minWidth: 120 }}
                      >
                        Add to Cart
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default ProductComparison; 