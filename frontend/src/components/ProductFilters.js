import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Select,
  MenuItem,
  TextField,
  Rating,
  Divider
} from '@mui/material';

const ProductFilters = ({ filters, categories, stats, onFilterChange }) => {
  const handlePriceChange = (event, newValue) => {
    onFilterChange({
      ...filters,
      minPrice: newValue[0],
      maxPrice: newValue[1]
    });
  };

  const handleRatingChange = (event, newValue) => {
    onFilterChange({
      ...filters,
      minRating: newValue
    });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>

      {/* Category Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Category
        </Typography>
        <Select
          fullWidth
          size="small"
          value={filters.category || 'All Categories'}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
        >
          <MenuItem value="All Categories">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Price Range Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Price Range
        </Typography>
        <Slider
          value={[filters.minPrice || stats.minPrice || 0, filters.maxPrice || stats.maxPrice || 1000]}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={stats.minPrice || 0}
          max={stats.maxPrice || 1000}
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption">
            ${filters.minPrice || stats.minPrice || 0}
          </Typography>
          <Typography variant="caption">
            ${filters.maxPrice || stats.maxPrice || 1000}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Rating Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Minimum Rating
        </Typography>
        <Rating
          value={filters.minRating || 0}
          onChange={handleRatingChange}
          precision={0.5}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Stock Filter */}
      <Box sx={{ mb: 3 }}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.inStock || false}
                onChange={(e) => onFilterChange({ ...filters, inStock: e.target.checked })}
              />
            }
            label="In Stock Only"
          />
        </FormGroup>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Sort Options */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Sort By
        </Typography>
        <Select
          fullWidth
          size="small"
          value={filters.sort || '-createdAt'}
          onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
        >
          <MenuItem value="-createdAt">Newest First</MenuItem>
          <MenuItem value="createdAt">Oldest First</MenuItem>
          <MenuItem value="-price">Price: High to Low</MenuItem>
          <MenuItem value="price">Price: Low to High</MenuItem>
          <MenuItem value="-ratings">Rating: High to Low</MenuItem>
          <MenuItem value="ratings">Rating: Low to High</MenuItem>
        </Select>
      </Box>
    </Paper>
  );
};

export default ProductFilters; 