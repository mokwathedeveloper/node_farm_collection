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

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: theme.palette.primary.main,
  },
  '& .MuiRating-iconHover': {
    color: theme.palette.primary.dark,
  },
}));

const ProductReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      
      toast.success('Review submitted successfully!');
      setRating(0);
      setComment('');
      setShowForm(false);
      onReviewSubmitted();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
      toast.error('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Button
        variant="outlined"
        onClick={() => setShowForm(!showForm)}
        sx={{ mb: 2 }}
      >
        {showForm ? 'Cancel Review' : 'Write a Review'}
      </Button>

      <Collapse in={showForm}>
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
            error={error && comment.trim().length < 10}
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