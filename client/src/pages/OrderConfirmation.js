import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Alert, Button } from 'react-bootstrap';

const OrderConfirmation = () => {
  // Generate a random order number
  const orderNumber = Math.floor(100000 + Math.random() * 900000);

  return (
    <Container className="py-5">
      <Alert variant="success">
        <Alert.Heading>Thank you for your order!</Alert.Heading>
        <p>
          Your order has been placed successfully. We've sent a confirmation email with your order details.
        </p>
        <hr />
        <p className="mb-0">
          Order Number: <strong>#{orderNumber}</strong>
        </p>
      </Alert>
      
      <div className="text-center mt-4">
        <p>Your order will be processed and shipped soon.</p>
        <Button as={Link} to="/products" variant="success" className="mt-3">
          Continue Shopping
        </Button>
      </div>
    </Container>
  );
};

export default OrderConfirmation;
