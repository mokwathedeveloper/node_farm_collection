import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

function OrderPage() {
  const { id } = useParams();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';
  
  // Show success message if redirected from checkout
  useEffect(() => {
    if (location.state?.success) {
      toast.success('Order placed successfully!');
    }
  }, [location.state]);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!userInfo?.token) {
          setError('Please log in to view this order');
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`${API_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.response?.data?.message || 'Failed to load order details');
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [API_URL, id, userInfo]);

  // Handle payment (mock implementation)
  const handlePayment = async () => {
    try {
      // In