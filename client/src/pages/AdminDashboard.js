import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Alert, Tabs, Tab, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import api from '../services/api';
import AdminRegisterForm from '../components/admin/AdminRegisterForm';
import ProductsTable from '../components/admin/ProductsTable';
import OrdersTable from '../components/admin/OrdersTable';
import UsersTable from '../components/admin/UsersTable';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { isAdmin, adminLogout } = useContext(AdminContext);
  const navigate = useNavigate();
  
  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);
  
  // Load dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch products
        const productsResponse = await api.getAllProducts();
        setProducts(productsResponse.data.data.products);
        
        // Fetch orders
        const ordersResponse = await api.getAllOrders();
        setOrders(ordersResponse.data.data.orders);
        
        // Fetch users
        const usersResponse = await api.getAllUsers();
        setUsers(usersResponse.data.data.users);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);
  
  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };
  
  const handleAdminRegistered = () => {
    // Refresh users list after new admin registration
    api.getAllUsers()
      .then(response => {
        setUsers(response.data.data.users);
      })
      .catch(err => {
        console.error('Error refreshing users:', err);
      });
  };
  
  const handleProductUpdated = (product) => {
    // This would typically open a modal or navigate to edit page
    console.log('Edit product:', product);
    // For now, just log the product
  };
  
  const handleProductDeleted = (productId) => {
    // Update the products state by filtering out the deleted product
    setProducts(products.filter(product => product._id !== productId));
  };
  
  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Admin Dashboard</h1>
            <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
          </div>
        </Col>
      </Row>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading dashboard data...</p>
        </div>
      ) : (
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
        >
          <Tab eventKey="products" title="Products">
            <h3 className="mb-3">Manage Products</h3>
            {products.length > 0 ? (
              <ProductsTable 
                products={products} 
                onProductUpdated={handleProductUpdated}
                onProductDeleted={handleProductDeleted}
              />
            ) : (
              <Alert variant="info">No products available. Add your first product to get started.</Alert>
            )}
          </Tab>
          
          <Tab eventKey="orders" title="Orders">
            <h3 className="mb-3">Manage Orders</h3>
            {orders.length > 0 ? (
              <OrdersTable orders={orders} />
            ) : (
              <Alert variant="info">No orders available yet.</Alert>
            )}
          </Tab>
          
          <Tab eventKey="users" title="Users">
            <h3 className="mb-3">Manage Users</h3>
            {users.length > 0 ? (
              <UsersTable 
                users={users} 
                onUserDeleted={(userId) => setUsers(users.filter(user => user._id !== userId))}
              />
            ) : (
              <Alert variant="info">No users available yet.</Alert>
            )}
          </Tab>
          
          <Tab eventKey="admin-register" title="Register Admin">
            <h3 className="mb-3">Register New Admin</h3>
            <Row>
              <Col md={8} lg={6}>
                <AdminRegisterForm 
                  onSuccess={handleAdminRegistered} 
                  isInitialSetup={false}
                />
              </Col>
            </Row>
          </Tab>
        </Tabs>
      )}
    </Container>
  );
};

export default AdminDashboard;
