import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Pagination,
  CircularProgress,
  Alert,
  useMediaQuery,
  Drawer,
  IconButton,
  Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';

const ProductsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All Categories',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    inStock: searchParams.get('inStock') === 'true',
    sort: searchParams.get('sort') || '-createdAt',
    page: parseInt(searchParams.get('page')) || 1
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProducts(filters);
      setProducts(response.products || []);
      setStats(response.stats || {});
      setCategories(response.categories || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch products');
      toast.error(err.response?.data?.error || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
    // Update URL with filters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  }, [filters, fetchProducts, setSearchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handlePageChange = (event, newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo(0, 0);
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      setFilters({ ...filters, search: event.target.value, page: 1 });
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
    toast.success(`${product.name} added to wishlist`);
  };

  const FiltersContent = () => (
    <ProductFilters
      filters={filters}
      categories={categories}
      stats={stats}
      onFilterChange={handleFilterChange}
    />
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid xs>
            <TextField
              fullWidth
              placeholder="Search products..."
              defaultValue={filters.search}
              onKeyPress={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {isMobile && (
            <Grid>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => setDrawerOpen(true)}
              >
                Filters
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
          
      <Grid container spacing={3}>
        {/* Filters - Desktop */}
        {!isMobile && (
          <Grid md={3}>
            <FiltersContent />
          </Grid>
        )}

        {/* Products Grid */}
        <Grid md={9}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <>
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid xs={12} sm={6} md={4} key={product._id}>
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                    />
                  </Grid>
                ))}
              </Grid>
          
              {/* Pagination */}
              {products.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={Math.max(1, Math.ceil((stats.totalProducts || 0) / 10))}
                    page={filters.page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}

              {products.length === 0 && (
                <Box sx={{ py: 8, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    No products found
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>

      {/* Filters Drawer - Mobile */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <FiltersContent />
        </Box>
      </Drawer>
    </Container>
  );
};

export default ProductsPage;
