import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col, Image } from 'react-bootstrap';
import api from '../../services/api';

const ProductForm = ({ product = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
    featured: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  
  // If editing, populate form with product data
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        category: product.category || '',
        imageUrl: product.imageUrl || '',
        featured: product.featured || false
      });
      
      if (product.imageUrl) {
        setImagePreview(product.imageUrl);
      }
    }
  }, [product]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageFile(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const validateForm = () => {
    if (!formData.name || !formData.price) {
      setError('Name and price are required');
      return false;
    }
    
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      setError('Price must be a valid number');
      return false;
    }
    
    if (formData.stock && (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0)) {
      setError('Stock must be a valid number');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare product data
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('price', formData.price);
      productData.append('stock', formData.stock || '0');
      productData.append('category', formData.category);
      productData.append('featured', formData.featured.toString());
      
      // If there's a new image file, add it to the form data
      if (imageFile) {
        productData.append('image', imageFile);
      } else if (formData.imageUrl) {
        productData.append('imageUrl', formData.imageUrl);
      }
      
      let result;
      if (product) {
        // Update existing product
        result = await api.updateProduct(product._id, productData);
      } else {
        // Create new product
        result = await api.createProduct(productData);
      }
      
      setLoading(false);
      onSave(result.data.data.product);
    } catch (err) {
      console.error('Product save error:', err);
      setError(err.response?.data?.message || 'Failed to save product');
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4 border rounded bg-light">
      <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Name*</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Electronics, Clothing, etc."
              />
            </Form.Group>
          </Col>
        </Row>
        
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Price*</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                step="1"
                min="0"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Featured Product"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Product Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <Form.Text className="text-muted">
            Upload a new image or keep the existing one.
          </Form.Text>
        </Form.Group>
        
        {imagePreview && (
          <div className="mb-3">
            <p>Image Preview:</p>
            <Image 
              src={imagePreview} 
              alt="Product preview" 
              thumbnail 
              style={{maxHeight: '200px'}} 
            />
          </div>
        )}
        
        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProductForm;
