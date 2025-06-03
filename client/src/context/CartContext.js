import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0, itemCount: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch cart from server on initial load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/cart', { withCredentials: true });
        if (response.data.status === 'success') {
          setCart({
            items: response.data.data.cart.items || [],
            totalPrice: response.data.data.cart.totalPrice || 0,
            itemCount: response.data.data.cart.items?.length || 0
          });
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
        // If there's an error, just set loading to false but keep empty cart
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/cart/add/${productId}`, 
        { quantity }, 
        { withCredentials: true }
      );
      
      if (response.data.status === 'success') {
        setCart({
          items: response.data.data.cart.items || [],
          totalPrice: response.data.data.cart.totalPrice || 0,
          itemCount: response.data.data.cart.items?.length || 0
        });
        return true;
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      return false;
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId, quantity) => {
    try {
      const response = await axios.patch(`http://localhost:3000/api/cart/update/${productId}`, 
        { quantity }, 
        { withCredentials: true }
      );
      
      if (response.data.status === 'success') {
        setCart({
          items: response.data.data.cart.items || [],
          totalPrice: response.data.data.cart.totalPrice || 0,
          itemCount: response.data.data.cart.items?.length || 0
        });
        return true;
      }
    } catch (err) {
      console.error('Error updating cart item:', err);
      return false;
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/cart/remove/${productId}`, 
        {}, 
        { withCredentials: true }
      );
      
      if (response.data.status === 'success') {
        setCart({
          items: response.data.data.cart.items || [],
          totalPrice: response.data.data.cart.totalPrice || 0,
          itemCount: response.data.data.cart.items?.length || 0
        });
        return true;
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
      return false;
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/cart/clear', 
        {}, 
        { withCredentials: true }
      );
      
      if (response.data.status === 'success') {
        setCart({
          items: [],
          totalPrice: 0,
          itemCount: 0
        });
        return true;
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      return false;
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      loading,
      addToCart, 
      updateCartItem, 
      removeFromCart, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};
