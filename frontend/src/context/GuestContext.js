import React, { createContext, useContext, useState, useEffect } from 'react';

const GuestContext = createContext();

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
};

export const GuestProvider = ({ children }) => {
  const [guestCart, setGuestCart] = useState(() => {
    const savedCart = localStorage.getItem('guestCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [guestInfo, setGuestInfo] = useState(() => {
    const savedInfo = localStorage.getItem('guestInfo');
    return savedInfo ? JSON.parse(savedInfo) : null;
  });

  useEffect(() => {
    localStorage.setItem('guestCart', JSON.stringify(guestCart));
  }, [guestCart]);

  useEffect(() => {
    if (guestInfo) {
      localStorage.setItem('guestInfo', JSON.stringify(guestInfo));
    }
  }, [guestInfo]);

  const addToGuestCart = (product, quantity = 1) => {
    setGuestCart(prevCart => {
      const existingItem = prevCart.find(item => item.product._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromGuestCart = (productId) => {
    setGuestCart(prevCart => prevCart.filter(item => item.product._id !== productId));
  };

  const updateGuestCartItemQuantity = (productId, quantity) => {
    setGuestCart(prevCart =>
      prevCart.map(item =>
        item.product._id === productId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const clearGuestCart = () => {
    setGuestCart([]);
    localStorage.removeItem('guestCart');
  };

  const setGuestUserInfo = (info) => {
    setGuestInfo(info);
  };

  const clearGuestInfo = () => {
    setGuestInfo(null);
    localStorage.removeItem('guestInfo');
  };

  const value = {
    guestCart,
    guestInfo,
    addToGuestCart,
    removeFromGuestCart,
    updateGuestCartItemQuantity,
    clearGuestCart,
    setGuestUserInfo,
    clearGuestInfo
  };

  return (
    <GuestContext.Provider value={value}>
      {children}
    </GuestContext.Provider>
  );
};

export default GuestContext; 