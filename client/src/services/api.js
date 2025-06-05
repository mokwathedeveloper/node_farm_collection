
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api', // Update port if needed
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request/response interceptors for better error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Add auth token to requests
const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Remove auth token
const removeAuthToken = () => {
  delete axiosInstance.defaults.headers.common['Authorization'];
  localStorage.removeItem('token');
};

// Check for token on page load
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

// API methods
const api = {
  // Auth
  setAuthToken,
  removeAuthToken,
  register: (userData) => axiosInstance.post('/auth/register', userData),
  registerAdmin: (userData) => axiosInstance.post('/auth/register-admin', userData),
  createAdmin: (userData) => axiosInstance.post('/admin/create-admin', userData),
  login: (email, password) => axiosInstance.post('/auth/login', { email, password }),
  adminLogin: (email, password) => axiosInstance.post('/auth/admin-login', { email, password }),
  getCurrentUser: () => axiosInstance.get('/auth/me'),
  checkAdminExists: () => axiosInstance.get('/auth/check-admin'),
  
  // Products
  getAllProducts: () => axiosInstance.get('/products'),
  getProduct: (id) => axiosInstance.get(`/products/${id}`),
  createProduct: (productData) => axiosInstance.post('/products', productData),
  updateProduct: (id, productData) => axiosInstance.put(`/products/${id}`, productData),
  deleteProduct: (id) => axiosInstance.delete(`/products/${id}`),
  
  // Cart
  getCart: () => axiosInstance.get('/cart'),
  addToCart: (id, quantity = 1) => axiosInstance.post(`/cart/add/${id}`, { quantity }),
  removeFromCart: (id) => axiosInstance.post(`/cart/remove/${id}`),
  updateCartItem: (id, quantity) => axiosInstance.patch(`/cart/update/${id}`, { quantity }),
  clearCart: () => axiosInstance.post('/cart/clear'),
  
  // Orders
  getOrders: () => axiosInstance.get('/orders'),
  getOrder: (id) => axiosInstance.get(`/orders/${id}`),
  createOrder: (orderData) => axiosInstance.post('/orders', orderData),
  updateOrderStatus: (id, status) => axiosInstance.patch(`/orders/${id}/status`, { status }),
  
  // Admin
  getAllUsers: () => axiosInstance.get('/admin/users'),
  getAllOrders: () => axiosInstance.get('/admin/orders'),
  
  // User
  getUserProfile: () => axiosInstance.get('/users/profile'),
  updateUserProfile: (userData) => axiosInstance.put('/users/profile', userData)
};

export default api;
