import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Table, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart, clearCart } = useContext(CartContext);
  const [isProcessing] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(productId, newQuantity);
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  const handleCheckout = () => {
    // Navigate to checkout page
    navigate('/checkout');
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" variant="success">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading your cart...</p>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Your Shopping Cart</h1>
      
      {cart.items.length === 0 ? (
        <Alert variant="info">
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn btn-success mt-2">
            Continue Shopping
          </Link>
        </Alert>
      ) : (
        <>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th className="text-end">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map(item => (
                <tr key={item.product._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      {item.product.image && (
                        <img 
                          src={item.product.image} 
                          alt={item.product.productName} 
                          style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                          className="rounded"
                        />
                      )}
                      <div>
                        <Link to={`/products/${item.product._id}`} className="text-decoration-none">
                          {item.product.productName}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td>${item.product.price.toFixed(2)}</td>
                  <td style={{ width: '150px' }}>
                    <div className="d-flex align-items-center">
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td className="text-end">${(item.product.price * item.quantity).toFixed(2)}</td>
                  <td className="text-end">
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleRemoveItem(item.product._id)}
                    >
                      <i className="bi bi-trash"></i> Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end">
                  <strong>Total:</strong>
                </td>
                <td className="text-end">
                  <strong>${cart.totalPrice.toFixed(2)}</strong>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </Table>
          
          <Row className="mt-4 mb-5">
            <Col xs={12} md={6}>
              <Button 
                variant="outline-secondary" 
                as={Link} 
                to="/products"
                className="me-2"
              >
                Continue Shopping
              </Button>
              <Button 
                variant="outline-danger" 
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            </Col>
            <Col xs={12} md={6} className="text-md-end mt-3 mt-md-0">
              <Button 
                variant="success" 
                size="lg" 
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Processing...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Cart;
