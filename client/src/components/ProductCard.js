import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Card className="h-100 shadow-sm border-0 product-card">
      <Link to={`/product/${product._id}`} className="text-decoration-none">
        <div style={{ height: '200px', overflow: 'hidden' }}>
          {product.image ? (
            <Card.Img 
              variant="top" 
              src={product.image} 
              alt={product.productName}
              style={{ height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div 
              className="d-flex justify-content-center align-items-center bg-light"
              style={{ height: '100%' }}
            >
              <span style={{ fontSize: '50px' }}>🌱</span>
            </div>
          )}
        </div>
        <Card.Body className="d-flex flex-column">
          <Card.Title className="mb-2">{product.productName}</Card.Title>
          <Card.Text className="text-muted small mb-2 flex-grow-1">
            {product.description && product.description.length > 80 
              ? `${product.description.substring(0, 80)}...` 
              : product.description}
          </Card.Text>
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <span className="fw-bold text-success">€{product.price.toFixed(2)}</span>
            <Button 
              variant="outline-success" 
              size="sm"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </Card.Body>
      </Link>
    </Card>
  );
};

export default ProductCard;