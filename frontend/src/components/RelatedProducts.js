import React, { useState, useEffect } from 'react';
import { Grid, Box, CircularProgress, Alert } from '@mui/material';
import { getProducts } from '../services/api';
import ProductCard from './ProductCard';

const RelatedProducts = ({ category, currentProductId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts({
          category,
          limit: 4,
          sort: '-ratings',
        });
        // Filter out the current product and limit to 3 products
        const filteredProducts = response.data
          .filter(product => product._id !== currentProductId)
          .slice(0, 3);
        setProducts(filteredProducts);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch related products');
      } finally {
        setLoading(false);
      }
    };

    if (category && currentProductId) {
      fetchRelatedProducts();
    }
  }, [category, currentProductId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product._id}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default RelatedProducts; 