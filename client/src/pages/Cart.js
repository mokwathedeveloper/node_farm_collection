import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';

function Cart() {
  const { cart, loading, error, removeFromCart, updateCartItem, clearCart, fetchCart } = useContext(CartContext);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = (productId, quantity) => {
    updateCartItem(productId, quantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading cart...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  const isEmpty = !cart?.items?.length;

  return (
    <Container className="py-5">
      <h2 className="mb-4">Your Shopping Cart</h2>
      
      {isEmpty ? (
        <Alert variant="info">
          Your cart is empty. <Link to="/" className="alert-link">Continue shopping</Link>
        </Alert>
      ) : (
        <>
          <div className="table-responsive mb-4">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.product._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {item.product.image ? (
                          <img 
                            src={item.product.image} 
                            alt={item.product.productName} 
                            style={{ width: '50px', height: '50px', objectFit: 'contain', marginRight: '10px' }}
                          />
                        ) : (
                          <div style={{ fontSize: '30px', marginRight: '10px' }}>🌱</div>
                        )}
                        <Link to={`/products/${item.product._id}`}>
                          {item.product.productName}
                        </Link>
                      </div>
                    </td>
                    <td>${item.product.price.toFixed(2)}</td>
                    <td>
                      <div className="d-flex align-items-center" style={{ maxWidth: '120px' }}>
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => handleQuantityChange(item.product._id, Math.max(1, item.quantity - 1))}
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
                    <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleRemoveItem(item.product._id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Button 
              variant="outline-danger" 
              onClick={handleClearCart}
            >
              Clear Cart
            </Button>
            <Card className="text-end" style={{ width: '300px' }}>
              <Card.Body>
                <Card.Title>Order Summary</Card.Title>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
                <Button 
                  variant="success" 
                  className="w-100 mt-3"
                >
                  Checkout
                </Button>
              </Card.Body>
            </Card>
          </div>
        </>
      )}
    </Container>
  );
}

export default Cart;
