import React, { useState } from 'react';
import {
  Box,
  Button,
  Rating,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Collapse,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { addProductReview } from '../services/api';
import { useSelector } from 'react-redux';

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: theme.palette.primary.main,
  },
  '& .MuiRating-iconHover': {
    color: theme.palette.primary.dark,
  },
}));

const ProductReviewForm = ({ productId, onReviewSubmitted }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Debug authentication state
  console.log('ProductReviewForm - Auth state:', {
    userInfo,
    hasUserInfo: !!userInfo,
    userRole: userInfo?.role,
    isAdmin: userInfo?.isAdmin
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!userInfo) {
      setError('Please log in to submit a review');
      toast.error('Please log in to submit a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Review must be at least 10 characters long');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Submit review to API
      await addProductReview(productId, {
        rating,
        comment: comment.trim()
      });

      toast.success('Review submitted successfully!');
      setRating(0);
      setComment('');
      setShowForm(false);

      // Refresh the product details to show the new review
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      let errorMessage = 'Failed to submit review';

      if (err.response?.status === 401) {
        errorMessage = 'Please log in to submit a review';
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.message || 'You have already reviewed this product';
      } else {
        errorMessage = err.response?.data?.message || err.message || 'Failed to submit review';
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      {userInfo ? (
        <Button
          variant="outlined"
          onClick={() => setShowForm(!showForm)}
          sx={{ mb: 2 }}
        >
          {showForm ? 'Cancel Review' : 'Write a Review'}
        </Button>
      ) : (
        <Alert severity="info" sx={{ mb: 2 }}>
          Please log in to write a review
        </Alert>
      )}

      <Collapse in={showForm && userInfo}>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 3,
            mt: 2,
            backgroundColor: 'background.paper',
            transition: 'all 0.3s ease-in-out',
          }}
          elevation={3}
        >
          <Typography variant="h6" gutterBottom>
            Write Your Review
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography component="legend" gutterBottom>
              Your Rating
            </Typography>
            <StyledRating
              name="rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
                setError('');
              }}
              precision={0.5}
              size="large"
            />
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setError('');
            }}
            error={Boolean(error && comment.trim().length < 10)}
            helperText={
              error && comment.trim().length < 10
                ? 'Review must be at least 10 characters long'
                : ''
            }
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              position: 'relative',
              minWidth: 120,
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ position: 'absolute' }} />
            ) : (
              'Submit Review'
            )}
          </Button>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default ProductReviewForm; 