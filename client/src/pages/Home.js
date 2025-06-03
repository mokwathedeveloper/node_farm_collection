import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        // Get first 3 products as featured products
        const featured = response.data.data.products.slice(0, 3);
        setFeaturedProducts(featured);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container>
      {/* Hero Section */}
      <div className="text-center my-5 py-5 bg-light rounded">
        <h1 className="display-4">Welcome to Farm Collection</h1>
        <p className="lead">Browse our selection of fresh, organic farm products.</p>
        <Link to="/products" className="btn btn-success btn-lg mt-3">
          View All Products
        </Link>
      </div>

      {/* Featured Products Section */}
      <div className="my-5">
        <h2 className="text-center mb-4">Featured Products</h2>
        
        {loading ? (
          <p className="text-center">Loading products...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : (
          <Row>
            {featuredProducts.map(product => (
              <Col key={product._id} md={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  {product.image && (
                    <Card.Img 
                      variant="top" 
                      src={product.image} 
                      alt={product.productName}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{product.productName}</Card.Title>
                    <Card.Text className="text-primary fw-bold">
                      ${product.price.toFixed(2)}
                    </Card.Text>
                    <Card.Text className="flex-grow-1">
                      {product.description.substring(0, 100)}...
                    </Card.Text>
                    <Button 
                      as={Link} 
                      to={`/products/${product._id}`} 
                      variant="outline-success"
                      className="mt-auto"
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* About Section */}
      <div className="my-5 py-4 bg-light rounded">
        <Row className="align-items-center">
          <Col md={6} className="px-4">
            <h2>About Our Farm</h2>
            <p>
              At Farm Collection, we're dedicated to bringing you the freshest, 
              organic produce straight from our farms to your table. Our farmers 
              use sustainable practices to grow nutritious, delicious fruits and 
              vegetables.
            </p>
            <p>
              We believe in transparency, quality, and supporting local agriculture.
              Every product we offer is carefully selected to ensure the highest quality.
            </p>
          </Col>
          <Col md={6} className="text-center">
            <div style={{ fontSize: '120px' }}>🌱</div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Home;
