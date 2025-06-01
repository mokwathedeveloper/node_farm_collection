import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const { cart } = useContext(CartContext);
  
  // Calculate total items in cart
  const itemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm py-3">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <h1 className="m-0" style={{ fontFamily: 'Arial', color: '#27ae60', fontSize: '28px' }}>
            Node Farm
          </h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/" className="mx-2 fw-semibold">Products</Nav.Link>
            <Nav.Link as={Link} to="/cart" className="mx-2 fw-semibold position-relative">
              Cart
              {itemCount > 0 && (
                <Badge 
                  bg="success" 
                  pill 
                  className="position-absolute" 
                  style={{ top: '-8px', right: '-8px' }}
                >
                  {itemCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;