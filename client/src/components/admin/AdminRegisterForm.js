import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import api from '../../services/api';

const AdminRegisterForm = ({ onSuccess, isInitialSetup }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { name, email, password, confirmPassword } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Use different endpoints based on whether this is initial setup or not
      const response = isInitialSetup 
        ? await api.registerAdmin({ name, email, password })
        : await api.createAdmin({ name, email, password });
      
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      if (onSuccess) {
        onSuccess(response.data.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register admin');
      console.error('Admin registration error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          placeholder="Enter full name"
          required
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Enter email"
          required
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Enter password"
          required
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          required
        />
      </Form.Group>
      
      <Button 
        variant="primary" 
        type="submit" 
        disabled={loading}
        className="w-100"
      >
        {loading ? 'Registering...' : 'Register Admin'}
      </Button>
    </Form>
  );
};

export default AdminRegisterForm;