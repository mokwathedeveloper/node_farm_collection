import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Badge, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        setProduct(data.data.product);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value > 0 ? value : 1);
  };

  const handleAddToCart = () => {
    addToCart(product._id, quantity);
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading product...</p>
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

  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Product not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Link to="/" className="text-decoration-none mb-4 d-inline-block">
        <span className="text-success fw-bold">← Back to Products</span>
      </Link>
      
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <Row className="g-0">
          <Col md={5} className="bg-light d-flex align-items-center justify-content-center p-4">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.productName} 
                className="img-fluid" 
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
            ) : (
              <div style={{ fontSize: '120px' }}>🌱</div>
            )}
          </Col>
          
          <Col md={7} className="p-4">
            <h1 className="mb-2">{product.productName}</h1>
            
            {product.organic && (
              <Badge bg="success" className="mb-3">Organic</Badge>
            )}
            
            <h3 className="text-success mb-4">${product.price.toFixed(2)}</h3>
            
            <div className="mb-4">
              <div className="mb-2">
                <span className="me-2">📍</span>
                <span>From: {product.from || 'Local'}</span>
              </div>
              
              <div className="mb-2">
                <span className="me-2">📦</span>
                <span>Quantity: {product.quantity || 'N/A'}</span>
              </div>
              
              <div className="mb-2">
                <span className="me-2">🍎</span>
                <span>Nutrients: {product.nutrients || 'N/A'}</span>
              </div>
            </div>
            
            <p className="mb-4 text-muted">
              {product.description || 'No description available.'}
            </p>
            
            <div className="d-flex align-items-center">
              <Form.Group className="me-3" style={{ width: '100px' }}>
                <Form.Label>Quantity:</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </Form.Group>
              
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default ProductDetail;