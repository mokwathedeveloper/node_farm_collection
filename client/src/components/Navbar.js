import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Badge } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  
  // Calculate total items in cart
  const itemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleLogoClick = () => {
    // Navigate to home page
    navigate('/');
  };

  return (
    <BootstrapNavbar bg="light" expand="lg" className="shadow-sm mb-3">
      <Container>
        <BootstrapNavbar.Brand 
          as={Link} 
          to="/" 
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
        >
          <div className="d-flex align-items-center">
            <span style={{ fontSize: '24px', marginRight: '10px' }}>🌾</span>
            <span style={{ fontWeight: 'bold', color: '#27ae60' }}>Farm Collection</span>
          </div>
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            <Nav.Link as={Link} to="/cart" className="position-relative">
              Cart
              {itemCount > 0 && (
                <Badge 
                  bg="success" 
                  pill 
                  className="position-absolute" 
                  style={{ top: '0', right: '0', transform: 'translate(50%, -50%)' }}
                >
                  {itemCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
