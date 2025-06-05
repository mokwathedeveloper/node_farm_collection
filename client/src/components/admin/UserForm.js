import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import api from '../../services/api';

const UserForm = ({ user = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'customer',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPasswordChange, setIsPasswordChange] = useState(false);
  
  // If editing, populate form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'customer',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validateForm = () => {
    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return false;
    }
    
    if (isPasswordChange) {
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
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
      let userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      };
      
      // Only include password if it's being changed
      if (isPasswordChange && formData.password) {
        userData.password = formData.password;
      }
      
      let result;
      if (user) {
        // Update existing user
        result = await api.updateUser(user._id, userData);
      } else {
        // Create new user
        result = await api.createUser(userData);
      }
      
      setLoading(false);
      onSave(result.data.data.user);
    } catch (err) {
      console.error('User save error:', err);
      setError(err.response?.data?.message || 'Failed to save user');
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4 border rounded bg-light">
      <h3>{user ? 'Edit User' : 'Add New User'}</h3>
      
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
              <Form.Label>Email*</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        
        <Form.Group className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </Form.Select>
        </Form.Group>
        
        {user && (
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Change Password"
              checked={isPasswordChange}
              onChange={(e) => setIsPasswordChange(e.target.checked)}
            />
          </Form.Group>
        )}
        
        {(!user || isPasswordChange) && (
          <>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{user ? 'New Password' : 'Password'}*</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!user}
                    minLength={6}
                  />
                  <Form.Text className="text-muted">
                    Password must be at least 6 characters long.
                  </Form.Text>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password*</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!user}
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}
        
        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : (user ? 'Update User' : 'Add User')}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UserForm;