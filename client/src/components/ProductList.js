import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // For demo purposes, we'll use mock products
    // In a real app, you would fetch from your API
    const mockProducts = [
      {
        _id: "1",
        productName: "Organic Apples",
        description: "Fresh organic apples from local farms.",
        price: 3.99,
        category: "Fruits",
        quantity: 100,
        image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
      },
      {
        _id: "2",
        productName: "Fresh Carrots",
        description: "Locally grown carrots, perfect for salads and cooking.",
        price: 2.49,
        category: "Vegetables",
        quantity: 150,
        image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
      },
      {
        _id: "3",
        productName: "Organic Milk",
        description: "Fresh organic milk from grass-fed cows.",
        price: 4.99,
        category: "Dairy",
        quantity: 50,
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80"
      },
      {
        _id: "4",
        productName: "Free-Range Eggs",
        description: "Eggs from free-range chickens, rich in nutrients.",
        price: 5.99,
        category: "Dairy",
        quantity: 80,
        image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
      },
      {
        _id: "5",
        productName: "Organic Spinach",
        description: "Fresh organic spinach, packed with vitamins and minerals.",
        price: 3.49,
        category: "Vegetables",
        quantity: 120,
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
      },
      {
        _id: "6",
        productName: "Organic Honey",
        description: "Pure organic honey from local beekeepers.",
        price: 8.99,
        category: "Pantry",
        quantity: 40,
        image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
      }
    ];
    
    setProducts(mockProducts);
  }, []);

  return (
    <Container className="my-4">
      <h1>Node Farm Products</h1>
      <Row>
        {products.map(product => (
          <Col md={4} key={product._id} className="mb-4"> 
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductList;
