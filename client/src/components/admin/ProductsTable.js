import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import api from '../../services/api';

const ProductsTable = ({ products, onProductUpdated, onProductDeleted }) => {
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(productId);
        onProductDeleted(productId);
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product. Please try again.');
      }
    }
  };
  
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product._id}>
            <td>
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
              />
            </td>
            <td>{product.name}</td>
            <td>{product.category}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>
              <Badge bg={product.countInStock > 0 ? 'success' : 'danger'}>
                {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out of Stock'}
              </Badge>
            </td>
            <td>
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="me-2"
                onClick={() => onProductUpdated(product)}
              >
                Edit
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => handleDelete(product._id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ProductsTable;