import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const api = {
  // Products
  getAllProducts: () => axios.get(`${API_URL}/products`),
  getProduct: (id) => axios.get(`${API_URL}/products/${id}`),
  createProduct: (product) => axios.post(`${API_URL}/products`, product),
  
  // Cart
  getCart: () => axios.get(`${API_URL}/cart`),
  addToCart: (id, quantity = 1) => axios.post(`${API_URL}/cart/add/${id}`, { quantity }),
  removeFromCart: (id) => axios.post(`${API_URL}/cart/remove/${id}`),
  updateCartItem: (id, quantity) => axios.patch(`${API_URL}/cart/update/${id}`, { quantity }),
  clearCart: () => axios.post(`${API_URL}/cart/clear`)
};

export default api;