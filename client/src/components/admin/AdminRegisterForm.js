import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import api from '../../services/api';

const AdminRegisterForm = ({ onSuccess, isInitialSetup = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
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
      const { name, email, password } = formData;
      
      // Use different API endpoints based on whether this is initial setup or creating additional admin
      if (isInitialSetup) {
        await api.registerAdmin({ name, email, password });
      } else {
        await api.createAdmin({ name, email, password });
      }
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Admin registration error:', err);
      setError(err.response?.data?.message || 'Failed to register admin user');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h3 className="mb-4">{isInitialSetup ? 'Create First Admin Account' : 'Register New Admin'}</h3>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Admin user registered successfully!</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            <Form.Text className="text-muted">
              Password must be at least 6 characters long.
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <div className="d-grid gap-2">
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Registering...' : isInitialSetup ? 'Create Admin Account' : 'Register Admin'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AdminRegisterForm;
