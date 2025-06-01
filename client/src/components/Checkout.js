import React, { useState, useContext } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';

const Checkout = ({ onOrderComplete }) => {
  const { cart, clearCart } = useContext(CartContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'credit-card'
  });
  const [validated, setValidated] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Simulate order submission
    setOrderPlaced(true);
    clearCart();
    
    // Call the callback to notify parent component
    if (onOrderComplete) {
      onOrderComplete();
    }
  };

  if (orderPlaced) {
    return (
      <Alert variant="success">
        <Alert.Heading>Order Placed Successfully!</Alert.Heading>
        <p>
          Thank you for your order. We've received your payment and will process your order shortly.
          You will receive a confirmation email with your order details.
        </p>
      </Alert>
    );
  }

  return (
    <div>
      <h4 className="mb-4">Checkout</h4>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Col md={6} className="mb-3">
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                required
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide your first name.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={6} className="mb-3">
            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                required
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide your last name.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email address.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            required
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide your address.
          </Form.Control.Feedback>
        </Form.Group>

        <Row>
          <Col md={6} className="mb-3">
            <Form.Group controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                required
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide your city.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={3} className="mb-3">
            <Form.Group controlId="postalCode">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                required
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide your postal code.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={3} className="mb-3">
            <Form.Group controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control
                required
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide your country.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-4">
          <Form.Label>Payment Method</Form.Label>
          <div>
            <Form.Check
              type="radio"
              label="Credit Card"
              name="paymentMethod"
              id="credit-card"
              value="credit-card"
              checked={formData.paymentMethod === 'credit-card'}
              onChange={handleChange}
              required
            />
            <Form.Check
              type="radio"
              label="PayPal"
              name="paymentMethod"
              id="paypal"
              value="paypal"
              checked={formData.paymentMethod === 'paypal'}
              onChange={handleChange}
              required
            />
          </div>
        </Form.Group>

        <div className="d-grid">
          <Button 
            variant="success" 
            type="submit" 
            size="lg"
            disabled={cart.items.length === 0}
          >
            Place Order (€{cart.totalPrice.toFixed(2)})
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Checkout;