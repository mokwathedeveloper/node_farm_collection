import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Container, Alert } from 'react-bootstrap';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/cart', { withCredentials: true });
        setCartItems(response.data.data.cart);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch cart items');
        setLoading(false);
        console.error(err);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await axios.put('http://localhost:3000/api/cart', {
        productId,
        quantity: newQuantity
      }, { withCredentials: true });
      
      setCartItems(cartItems.map(item => 
        item.product._id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      ));
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/api/cart/${productId}`, { withCredentials: true });
      setCartItems(cartItems.filter(item => item.product._id !== productId));
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item from cart');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0).toFixed(2);
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      <h1 className="my-4">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <Alert variant="info">
          Your cart is empty. Go back to the products page to add items.
        </Alert>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.product._id}>
                  <td>{item.product.productName}</td>
                  <td>${item.product.price.toFixed(2)}</td>
                  <td>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </td>
                  <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => removeItem(item.product._id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                <td><strong>${calculateTotal()}</strong></td>
                <td></td>
              </tr>
            </tfoot>
          </Table>
          
          <div className="d-flex justify-content-end mb-4">
            <Button variant="success" size="lg">
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default Cart;
