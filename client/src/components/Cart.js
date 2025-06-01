import React, { useContext, useState } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CartItem from './CartItem';
import Checkout from './Checkout';

const Cart = () => {
  const { cart, updateCartItem, removeFromCart } = useContext(CartContext);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleOrderComplete = () => {
    setOrderComplete(true);
    setShowCheckout(false);
  };

  if (orderComplete) {
    return (
      <Container className="py-5">
        <Alert variant="success">
          <Alert.Heading>Thank you for your order!</Alert.Heading>
          <p>
            Your order has been placed successfully. You will receive a confirmation email shortly.
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Link to="/">
              <Button variant="outline-success">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  if (cart.items.length === 0) {
    return (
      <Container className="py-5">
        <h1 className="mb-4">Your Cart</h1>
        <Alert variant="info">
          Your cart is empty. <Link to="/" className="alert-link">Continue shopping</Link>.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">{showCheckout ? 'Checkout' : 'Your Cart'}</h1>
      
      {!showCheckout ? (
        <>
          <div className="bg-light p-4 rounded mb-4">
            {cart.items.map(item => (
              <CartItem 
                key={item.product._id} 
                item={item} 
                updateCartItem={updateCartItem}
                removeFromCart={removeFromCart}
              />
            ))}
            
            <Row className="mt-4">
              <Col md={6}>
                <Link to="/">
                  <Button variant="outline-secondary">
                    Continue Shopping
                  </Button>
                </Link>
              </Col>
              <Col md={6} className="text-end">
                <div className="d-flex flex-column align-items-end">
                  <h4 className="mb-3">
                    Total: <span className="text-success">€{cart.totalPrice.toFixed(2)}</span>
                  </h4>
                  <Button 
                    variant="success" 
                    size="lg"
                    onClick={() => setShowCheckout(true)}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </>
      ) : (
        <Checkout onOrderComplete={handleOrderComplete} />
      )}
    </Container>
  );
};

export default Cart;