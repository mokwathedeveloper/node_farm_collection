import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      fetchCart();
    } else {
      setCart([]);
      setLoading(false);
    }
  }, [userInfo]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      setCart(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cart');
      toast.error(err.response?.data?.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);
      const response = await axios.post('/api/cart', 
        { productId, quantity },
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );
      setCart(response.data);
      toast.success('Item added to cart');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item to cart');
      toast.error(err.response?.data?.message || 'Failed to add item to cart');
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setError(null);
      await axios.delete(`/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      setCart(cart.filter(item => item.product._id !== productId));
      toast.success('Item removed from cart');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove item from cart');
      toast.error(err.response?.data?.message || 'Failed to remove item from cart');
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setError(null);
      const response = await axios.put(`/api/cart/${productId}`, 
        { quantity },
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );
      setCart(response.data);
      toast.success('Cart updated');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update quantity');
      toast.error(err.response?.data?.message || 'Failed to update quantity');
      return false;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      await axios.delete('/api/cart', {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      setCart([]);
      toast.success('Cart cleared');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear cart');
      toast.error(err.response?.data?.message || 'Failed to clear cart');
      return false;
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 