import React, { useState, useContext } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';

const Checkout = ({ onOrderComplete }) => {
  const { cart, clearCart } = useContext(CartContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'credit-card'
  });
  const [validated, setValidated] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Simulate order submission
    setOrderPlaced(true);
    clearCart();
    
    // Call the callback to notify parent component
    if (onOrderComplete) {
      onOrderComplete();
    }
  };

 