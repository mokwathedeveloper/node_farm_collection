import React, { useState, useEffect } from 'react';
import { Container, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AdminRegisterForm from '../components/admin/AdminRegisterForm';

const AdminRegister = () => {
  const [loading, setLoading] = useState(true);
  const [hasAdmins, setHasAdmins] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Check if there are any admin users
  useEffect(() => {
    const checkAdmins = async () => {
      try {
        const response = await api.checkAdminExists();
        const adminExists = response.data.data.adminExists;
        setHasAdmins(adminExists);
        setLoading(false);
        
        // If admin already exists, redirect to login
        if (adminExists) {
          navigate('/admin/login');
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        setError('Failed to check if admin exists');
        setLoading(false);
      }
    };
    
    checkAdmins();
  }, [navigate]);
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Checking admin status...</p>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}. Please try again or contact support.
        </Alert>
        <div className="text-center mt-3">
          <Link to="/" className="btn btn-primary">Go to Homepage</Link>
        </div>
      </Container>
    );
  }
  
  // This will only render if there are no admins
  if (hasAdmins) {
    return (
      <Container className="py-5">
        <Card className="shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
          <Card.Body className="p-4">
            <h2 className="text-center mb-4">Admin Already Exists</h2>
            <Alert variant="info">
              An admin account already exists. Please login instead.
            </Alert>
            <div className="text-center mt-3">
              <Link to="/admin/login" className="btn btn-primary">Go to Admin Login</Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      <Card className="shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">Initial Admin Setup</h2>
          <Alert variant="info">
            No admin users found. Create the first admin account to manage your store.
          </Alert>
          
          {/* Use the AdminRegisterForm component here */}
          <AdminRegisterForm 
            onSuccess={() => navigate('/admin/login')}
            isInitialSetup={true}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminRegister;
