import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../config';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = 
      error.response?.data?.message || 
      error.message || 
      'An unexpected error occurred';
    
    // Handle different error status codes
    switch (error.response?.status) {
      case 401:
        // Unauthorized - could redirect to login
        toast.error('Session expired. Please login again.');
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(message);
    }
    
    console.error('API Error:', error);
    
    return Promise.reject(error);
  }
);

export default api;
