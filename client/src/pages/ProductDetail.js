import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Badge, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import axios from 'axios';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/products/${id}`);
        
        if (response.data.status === 'success') {
          setProduct(response.data.data.product);
          setError(null);
        } else {
          throw new Error('Failed to fetch product');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    setAddedToCart(false);
    
    try {
      const success = await addToCart(id, quantity);
      if (success) {
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
      } else {
        setError('Failed to add item to cart. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" variant="success">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading product details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button as={Link} to="/products" variant="outline-primary">
            Back to Products
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Product Not Found</Alert.Heading>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <Button as={Link} to="/products" variant="outline-primary">
            Back to Products
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={6} className="mb-4">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.productName} 
              className="img-fluid rounded shadow"
              style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
            />
          ) : (
            <div 
              className="bg-light d-flex align-items-center justify-content-center rounded shadow"
              style={{ height: '400px' }}
            >
              <span className="text-muted">No image available</span>
            </div>
          )}
        </Col>
        <Col md={6}>
          <h1 className="mb-2">{product.productName}</h1>
          
          {product.category && (
            <Badge bg="secondary" className="mb-3">
              {product.category}
            </Badge>
          )}
          
          <p className="text-success fs-4 fw-bold mb-3">
            ${product.price.toFixed(2)}
          </p>
          
          <p className="mb-4">{product.description}</p>
          
          {product.inStock ? (
            <Badge bg="success" className="mb-3">In Stock</Badge>
          ) : (
            <Badge bg="danger" className="mb-3">Out of Stock</Badge>
          )}
          
          <div className="d-flex align-items-center mb-4">
            <Form.Group controlId="quantity" className="me-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                style={{ width: '80px' }}
              />
            </Form.Group>
            
            <Button 
              variant="success" 
              size="lg" 
              onClick={handleAddToCart}
              disabled={addingToCart || !product.inStock}
              className="mt-3"
            >
              {addingToCart ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Adding...
                </>
              ) : (
                'Add to Cart'
              )}
            </Button>
          </div>
          
          {addedToCart && (
            <Alert variant="success">
              Item added to cart successfully!
            </Alert>
          )}
          
          <div className="mt-4">
            <Button 
              variant="outline-secondary" 
              as={Link} 
              to="/products"
              className="me-2"
            >
              Back to Products
            </Button>
            <Button 
              variant="outline-success" 
              as={Link} 
              to="/cart"
            >
              View Cart
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetail;
