import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  Button,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const isOutOfStock = !product.stock || product.stock === 0;
  const productImage = product.images?.[0]?.url || product.image || 'https://via.placeholder.com/200?text=No+Image';
  const productPrice = typeof product.price === 'number' ? product.price.toFixed(2) : '0.00';

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        opacity: isOutOfStock ? 0.8 : 1,
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
          transition: 'all 0.3s ease-in-out'
        }
      }}
    >
      {imageError ? (
        <Box
          sx={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.100',
            cursor: 'pointer'
          }}
          onClick={handleClick}
        >
          <ImageNotSupportedIcon sx={{ fontSize: 60, color: 'grey.500' }} />
        </Box>
      ) : (
        <CardMedia
          component="img"
          height="200"
          image={productImage}
          alt={product.name}
          sx={{ objectFit: 'contain', p: 2, cursor: 'pointer' }}
          onClick={handleClick}
          onError={handleImageError}
        />
      )}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="h2" 
          sx={{ 
            cursor: 'pointer',
            '&:hover': { color: 'primary.main' }
          }}
          onClick={handleClick}
        >
          {product.name}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            ${productPrice}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={product.ratings || 0} precision={0.5} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.numOfReviews || 0} reviews)
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip 
            label={product.category} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
          {isOutOfStock ? (
            <Chip 
              label="Out of stock" 
              size="small" 
              color="error"
            />
          ) : (
            <Chip 
              label={`${product.stock} in stock`} 
              size="small" 
              color="success" 
              variant="outlined" 
            />
          )}
        </Box>

        <Box sx={{ 
          mt: 'auto', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Button
            variant={isOutOfStock ? "outlined" : "contained"}
            startIcon={<ShoppingCartIcon />}
            onClick={() => onAddToCart && onAddToCart(product)}
            disabled={isOutOfStock}
            sx={{ 
              flexGrow: 1, 
              mr: 1,
              '&.Mui-disabled': {
                color: 'error.main',
                borderColor: 'error.main'
              }
            }}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
          {onAddToWishlist && (
            <Tooltip title="Add to Wishlist">
              <IconButton 
                color="primary" 
                onClick={() => onAddToWishlist(product)}
                sx={{ border: 1, borderColor: 'primary.main' }}
              >
                <FavoriteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 