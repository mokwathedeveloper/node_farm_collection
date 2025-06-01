import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    // For demo purposes, we'll use mock products
    // In a real app, you would fetch from your API
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockProducts = [
        {
          _id: "1",
          productName: "Organic Apples",
          description: "Fresh organic apples from local farms. These apples are grown without pesticides and are harvested at peak ripeness for maximum flavor and nutrition.",
          price: 3.99,
          category: "Fruits",
          quantity: 100,
          image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
        },
        {
          _id: "2",
          productName: "Fresh Carrots",
          description: "Locally grown carrots, perfect for salads and cooking. Our carrots are harvested daily to ensure maximum freshness and nutritional value.",
          price: 2.49,
          category: "Vegetables",
          quantity: 150,
          image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
        },
        {
          _id: "3",
          productName: "Organic Milk",
          description: "Fresh organic milk from grass-fed cows. Our milk comes from local farms where cows are treated humanely and allowed to graze on open pastures.",
          price: 4.99,
          category: "Dairy",
          quantity: 50,
          image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80"
        },
        {
          _id: "4",
          productName: "Free-Range Eggs",
          description: "Eggs from free-range chickens, rich in nutrients. Our chickens are raised in a stress-free environment with access to outdoor areas.",
          price: 5.99,
          category: "Dairy",
          quantity: 80,
          image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
        },
        {
          _id: "5",
          productName: "Organic Spinach",
          description: "Fresh organic spinach, packed with vitamins and minerals. Our spinach is grown using sustainable farming practices that protect the environment.",
          price: 3.49,
          category: "Vegetables",
          quantity: 120,
          image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
        },
        {
          _id: "6",
          productName: "Organic Honey",
          description: "Pure organic honey from local beekeepers. Our honey is raw, unfiltered, and contains all the natural enzymes and pollen that make honey so beneficial.",
          price: 8.99,
          category: "Pantry",
          quantity: 40,
          image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
        }
      ];
      
      const foundProduct = mockProducts.find(p => p._id === id);
      
      if (foundProduct) {
        setProduct(foundProduct);
        setLoading(false);
      } else {
        setError("Product not found");
        setLoading(false);
      }
    }, 500);
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading product details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Link to="/" className="btn btn-primary mt-3">Back to Products</Link>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Product not found</Alert>
        <Link to="/" className="btn btn-primary mt-3">Back to Products</Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Link to="/" className="btn btn-outline-secondary mb-4">
        &larr; Back to Products
      </Link>
      
      <Row>
        <Col md={6} className="mb-4">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.productName} 
              className="img-fluid rounded"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
          ) : (
            <div 
              className="d-flex justify-content-center align-items-center bg-light rounded"
              style={{ height: '400px' }}
            >
              <span style={{ fontSize: '100px' }}>🌱</span>
            </div>
          )}
        </Col>
        
        <Col md={6}>
          <h1 className="mb-3">{product.productName}</h1>
          <p className="text-success fs-4 fw-bold mb-3">€{product.price.toFixed(2)}</p>
          <p className="mb-4">{product.description}</p>
          
          <div className="d-flex align-items-center mb-4">
            <Form.Label className="me-3 mb-0">Quantity:</Form.Label>
            <Form.Select 
              value={quantity} 
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              style={{ width: '80px' }}
            >
              {[...Array(10).keys()].map(num => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </Form.Select>
          </div>
          
          <Button 
            variant="success" 
            size="lg" 
            onClick={handleAddToCart}
            className="mb-3"
          >
            Add to Cart
          </Button>
          
          <div className="mt-4">
            <h5>Product Details</h5>
            <ul className="list-unstyled">
              <li><strong>Category:</strong> {product.category}</li>
              <li><strong>Available:</strong> {product.quantity} in stock</li>
            </ul>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;