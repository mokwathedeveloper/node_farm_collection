import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Try to get cart from localStorage
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [], totalPrice: 0 };
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (product, quantity) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.items.findIndex(
        item => item.product._id === product._id
      );

      let updatedItems;

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
      } else {
        // Add new item if it doesn't exist
        updatedItems = [...prevCart.items, { product, quantity }];
      }

      // Calculate new total price
      const totalPrice = updatedItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );

      return { items: updatedItems, totalPrice };
    });
  };

  // Update cart item quantity
  const updateCartItem = (productId, quantity) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item => 
        item.product._id === productId ? { ...item, quantity } : item
      );

      const totalPrice = updatedItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );

      return { items: updatedItems, totalPrice };
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(
        item => item.product._id !== productId
      );

      const totalPrice = updatedItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );

      return { items: updatedItems, totalPrice };
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart({ items: [], totalPrice: 0 });
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      updateCartItem, 
      removeFromCart, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};
