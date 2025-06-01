import React from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';

const CartItem = ({ item, updateCartItem, removeFromCart }) => {
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      updateCartItem(item.product._id, newQuantity);
    }
  };

  return (
    <Row className="cart-item align-items-center py-3 border-bottom">
      <Col xs={3} md={2}>
        {item.product.image ? (
          <img 
            src={item.product.image} 
            alt={item.product.productName} 
            className="img-fluid rounded"
            style={{ maxHeight: '80px', objectFit: 'cover' }}
          />
        ) : (
          <div 
            className="d-flex justify-content-center align-items-center bg-light rounded"
            style={{ height: '80px', width: '80px' }}
          >
            <span style={{ fontSize: '30px' }}>🌱</span>
          </div>
        )}
      </Col>
      
      <Col xs={9} md={4}>
        <h5 className="mb-1">{item.product.productName}</h5>
        <p className="text-muted small mb-0">€{item.product.price.toFixed(2)} each</p>
      </Col>
      
      <Col xs={6} md={3} className="mt-3 mt-md-0">
        <Form.Control
          as="select"
          value={item.quantity}
          onChange={handleQuantityChange}
          className="form-select-sm"
        >
          {[...Array(10).keys()].map(num => (
            <option key={num + 1} value={num + 1}>
              {num + 1}
            </option>
          ))}
        </Form.Control>
      </Col>
      
      <Col xs={6} md={2} className="text-end mt-3 mt-md-0">
        <p className="fw-bold mb-0">€{(item.product.price * item.quantity).toFixed(2)}</p>
      </Col>
      
      <Col xs={12} md={1} className="text-end mt-2 mt-md-0">
        <Button 
          variant="link" 
          className="text-danger p-0" 
          onClick={() => removeFromCart(item.product._id)}
        >
          Remove
        </Button>
      </Col>
    </Row>
  );
};

export default CartItem;