import axios from 'axios';
import { API_URL } from '../config';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Products API
export const getProducts = async (filters) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    minRating,
    inStock,
    sort,
    page,
  } = filters;

  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category && category !== 'All Categories') params.append('category', category);
  if (minPrice) params.append('minPrice', minPrice);
  if (maxPrice) params.append('maxPrice', maxPrice);
  if (minRating) params.append('minRating', minRating);
  if (inStock) params.append('inStock', 'true');
  if (sort) params.append('sort', sort);
  if (page) params.append('page', page);

  const response = await api.get(`/products?${params.toString()}`);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getProductCategories = async () => {
  const response = await api.get('/products/categories');
  return response.data;
};

export const getProductStats = async () => {
  const response = await api.get('/products/stats');
  return response.data;
};

export const getRelatedProducts = async (productId) => {
  const response = await api.get(`/products/${productId}/related`);
  return response.data;
};

// Review API functions
export const getProductReviews = async (productId) => {
  const response = await api.get(`/products/${productId}/reviews`);
  return response.data;
};

export const addProductReview = async (productId, reviewData) => {
  const response = await api.post(`/products/${productId}/reviews`, reviewData);
  return response.data;
};

export const deleteProductReview = async (productId, reviewId) => {
  const response = await api.delete(`/products/${productId}/reviews/${reviewId}`);
  return response.data;
};

// Cart API
export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post('/cart', { productId, quantity });
  return response.data;
};

export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const updateCartItem = async (productId, quantity) => {
  const response = await api.put('/cart', { productId, quantity });
  return response.data;
};

export const removeFromCart = async (productId) => {
  const response = await api.delete(`/cart/${productId}`);
  return response.data;
};

// Wishlist API
export const addToWishlist = async (productId) => {
  const response = await api.post('/wishlist', { productId });
  return response.data;
};

export const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data;
};

export const removeFromWishlist = async (productId) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
};

// Admin Orders API
export const getAdminOrders = async () => {
  const response = await api.get('/orders/admin');
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/orders/${orderId}/status`, { status });
  return response.data;
};

// User Management API (Superadmin)
export const getAllUsers = async () => {
  const response = await api.get('/superadmin/users');
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/superadmin/users/${userId}/role`, { role });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

export const createAdminUser = async (userData) => {
  const response = await api.post('/auth/superadmin/create-admin', userData);
  return response.data;
};

export default api;