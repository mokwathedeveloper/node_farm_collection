import React, { useState } from 'react';
import { Table, Button, Badge, Form, InputGroup, Modal, Image } from 'react-bootstrap';
import api from '../../services/api';

const ProductsTable = ({ products, onProductUpdated, onProductDeleted }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Get unique categories for filter
  const categories = [...new Set(products.map(product => product.category))].filter(Boolean);
  
  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortField === 'price') {
      return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
    } else if (sortField === 'stock') {
      return sortDirection === 'asc' ? a.stock - b.stock : b.stock - a.stock;
    } else {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      return sortDirection === 'asc'
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    }
  });
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await api.deleteProduct(productToDelete._id);
      onProductDeleted(productToDelete._id);
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting product:', err);
      // You could add error handling here
    }
  };
  
  const getStockBadge = (stock) => {
    if (stock <= 0) {
      return <Badge bg="danger">Out of Stock</Badge>;
    } else if (stock < 10) {
      return <Badge bg="warning">Low Stock</Badge>;
    } else {
      return <Badge bg="success">In Stock</Badge>;
    }
  };
  
  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };
  
  return (
    <>
      <div className="mb-3 d-flex gap-3">
        <InputGroup className="flex-grow-1">
          <Form.Control
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button 
              variant="outline-secondary" 
              onClick={() => setSearchTerm('')}
            >
              Clear
            </Button>
          )}
        </InputGroup>
        
        {categories.length > 0 && (
          <Form.Select 
            style={{ width: 'auto' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Form.Select>
        )}
      </div>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{width: '80px'}}>Image</th>
            <th onClick={() => handleSort('name')} style={{cursor: 'pointer'}}>
              Name {getSortIcon('name')}
            </th>
            <th onClick={() => handleSort('category')} style={{cursor: 'pointer'}}>
              Category {getSortIcon('category')}
            </th>
            <th onClick={() => handleSort('price')} style={{cursor: 'pointer'}}>
              Price {getSortIcon('price')}
            </th>
            <th onClick={() => handleSort('stock')} style={{cursor: 'pointer'}}>
              Stock {getSortIcon('stock')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.length > 0 ? (
            sortedProducts.map(product => (
              <tr key={product._id}>
                <td>
                  {product.imageUrl ? (
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      thumbnail 
                      style={{width: '50px', height: '50px', objectFit: 'cover'}} 
                    />
                  ) : (
                    <div className="bg-light d-flex align-items-center justify-content-center" 
                         style={{width: '50px', height: '50px'}}>
                      No img
                    </div>
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.category || 'Uncategorized'}</td>
                <td>${product.price?.toFixed(2) || '0.00'}</td>
                <td>
                  {getStockBadge(product.stock)}
                  <span className="ms-2">{product.stock}</span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => onProductUpdated(product)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteClick(product)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-3">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'No products match your search criteria' 
                  : 'No products available'}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the product <strong>{productToDelete?.name}</strong>?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete Product
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductsTable;
