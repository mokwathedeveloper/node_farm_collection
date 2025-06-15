import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Fade,
  Zoom
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';
import { toast } from 'react-toastify';

const OrderStatusStep = styled(Step)(({ theme, active }) => ({
  '& .MuiStepLabel-label': {
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
    fontWeight: active ? 'bold' : 'normal'
  }
}));

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const orderStatuses = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
  ];

  const handleTrackOrder = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (!orderId || !email) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/orders/track/${orderId}`, {
        params: { email }
      });
      setOrder(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to track order');
    } finally {
      setLoading(false);
    }
  }, [orderId, email]);

  const handleRefreshOrder = async () => {
    if (!order) return;
    setRefreshing(true);
    try {
      const response = await axios.get(`/api/orders/${orderId}?email=${email}`);
      setOrder(response.data.data);
      toast.success('Order information refreshed');
    } catch (error) {
      toast.error('Failed to refresh order information');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCopyTrackingNumber = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      toast.success('Tracking number copied to clipboard');
    }
  };

  const handlePrintOrder = () => {
    window.print();
  };

  const handleEmailOrder = () => {
    if (order) {
      const subject = `Order Details - Order #${order._id}`;
      const body = `
Order ID: ${order._id}
Status: ${order.status}
Total: $${order.total.toFixed(2)}
Date: ${new Date(order.createdAt).toLocaleDateString()}
${order.trackingNumber ? `Tracking Number: ${order.trackingNumber}` : ''}

View order details: ${window.location.href}
      `;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'success.main';
      case 'cancelled':
        return 'error.main';
      case 'shipped':
        return 'info.main';
      default:
        return 'text.secondary';
    }
  };

  useEffect(() => {
    if (orderId && email) {
      handleTrackOrder();
    }
  }, [orderId, email, handleTrackOrder]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Track Your Order
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleTrackOrder}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Order ID"
                value={orderId}
                disabled
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
                error={!!error}
                helperText={error}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ height: '56px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Track'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {order && (
        <Fade in={true}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">
                Order Status
              </Typography>
              <Box>
                <Tooltip title="Refresh">
                  <IconButton onClick={handleRefreshOrder} disabled={refreshing}>
                    {refreshing ? <CircularProgress size={24} /> : '↻'}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Print">
                  <IconButton onClick={handlePrintOrder}>
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Email">
                  <IconButton onClick={handleEmailOrder}>
                    <EmailIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Stepper activeStep={orderStatuses.indexOf(order.status)} sx={{ my: 4 }}>
              {orderStatuses.map((status) => (
                <OrderStatusStep
                  key={status}
                  active={orderStatuses.indexOf(status) <= orderStatuses.indexOf(order.status)}
                >
                  <StepLabel>{status.charAt(0).toUpperCase() + status.slice(1)}</StepLabel>
                </OrderStatusStep>
              ))}
            </Stepper>

            {order.trackingNumber && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Tracking Number:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold' }}>
                    {order.trackingNumber}
                  </Typography>
                  <Tooltip title="Copy tracking number">
                    <IconButton onClick={handleCopyTrackingNumber} size="small">
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Order Details
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Order ID
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {order._id}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Order Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {new Date(order.createdAt).toLocaleDateString()}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Total Amount
                </Typography>
                <Typography variant="body1" gutterBottom>
                  ${order.total.toFixed(2)}
                </Typography>

                {order.deliveryOption && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary">
                      Delivery Method
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {order.deliveryOption.name} by {order.deliveryOption.provider}
                    </Typography>

                    <Typography variant="subtitle2" color="text.secondary">
                      Estimated Delivery
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {order.deliveryOption.estimatedDays.min}-{order.deliveryOption.estimatedDays.max} days
                    </Typography>

                    {order.trackingNumber && (
                      <>
                        <Typography variant="subtitle2" color="text.secondary">
                          Tracking Number
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {order.trackingNumber}
                        </Typography>
                      </>
                    )}
                  </>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Shipping Address
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                  <br />
                  {order.shippingInfo.street}
                  <br />
                  {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.postalCode}
                  <br />
                  {order.shippingInfo.country}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>

            {order.items.map((item) => (
              <Zoom in={true} key={item._id}>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <Typography variant="body1">
                        {item.product.name} x {item.quantity}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      <Typography variant="body1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Zoom>
            ))}
          </Paper>
        </Fade>
      )}
    </Container>
  );
};

export default OrderTrackingPage; 