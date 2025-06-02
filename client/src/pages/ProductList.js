import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Row, Col, Button } from 'react-bootstrap';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        setProducts(response.data.data.products);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="mb-4">Our Products</h1>
      <Row>
        {products.map(product => (
          <Col key={product._id} md={4} className="mb-4">
            <Card>
              {product.image && (
                <Card.Img variant="top" src={product.image} alt={product.productName} />
              )}
              <Card.Body>
                <Card.Title>{product.productName}</Card.Title>
                <Card.Text>
                  ${product.price.toFixed(2)}
                </Card.Text>
                <Button as={Link} to={`/products/${product._id}`} variant="primary">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductList;
