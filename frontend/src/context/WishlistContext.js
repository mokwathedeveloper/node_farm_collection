import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      fetchWishlist();
    } else {
      setWishlist([]);
      setLoading(false);
    }
  }, [userInfo]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/wishlist', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setWishlist(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch wishlist');
      toast.error(err.response?.data?.message || 'Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      setError(null);
      const response = await axios.post('/api/wishlist', 
        { productId },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setWishlist(response.data.wishlist);
      toast.success('Product added to wishlist');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to wishlist');
      toast.error(err.response?.data?.message || 'Failed to add to wishlist');
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setError(null);
      const response = await axios.delete(`/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setWishlist(response.data.wishlist);
      toast.success('Product removed from wishlist');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove from wishlist');
      toast.error(err.response?.data?.message || 'Failed to remove from wishlist');
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  const value = {
    wishlist,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    fetchWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext; 