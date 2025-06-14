import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../config';

function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { userInfo } = useSelector((state) => state.auth || {});

  const fetchCart = async () => {
    try {
      setLoading(true);
      
      let response;
      if (userInfo && userInfo.token) {
        response = await axios.get(`${API_URL}/cart`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
      } else {
        response = await axios.get(`${API_URL}/guest-cart`);
      }
      
      if (response.data && response.data.items) {
        setCartItems(response.data.items);
      } else if (Array.isArray(response.data)) {
        setCartItems(response.data);
      } else {
        setCartItems([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.response?.data?.message || 'Failed to fetch cart');
      setCartItems([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [API_URL, userInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setCartItems(cartItems.map(item => 
        item.product._id === id ? { ...item, quantity: newQuantity } : item
      ));
      
      const endpoint = userInfo && userInfo.token ? '/cart' : '/guest-cart';
      const headers = userInfo && userInfo.token 
        ? { Authorization: `Bearer ${userInfo.token}` }
        : {};
      
      await axios.put(`${API_URL}${endpoint}/${id}`, 
        { quantity: newQuantity },
        { headers }
      );
    } catch (err) {
      console.error('Error updating quantity:', err);
      toast.error('Failed to update quantity');
      fetchCart();
    }
  };

  const removeItem = async (id) => {
    try {
      const endpoint = userInfo && userInfo.token ? '/cart' : '/guest-cart';
      const headers = userInfo && userInfo.token 
        ? { Authorization: `Bearer ${userInfo.token}` }
        : {};
      
      await axios.delete(`${API_URL}${endpoint}/${id}`, { headers });
      
      setCartItems(cartItems.filter(item => item.product._id !== id));
      toast.success('Item removed from cart');
    } catch (err) {
      console.error('Error removing item:', err);
      toast.error('Failed to remove item');
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCheckout = () => {
    if (!userInfo) {
      toast.info('Please log in to checkout');
      navigate('/login', { state: { from: '/cart' } });
    } else {
      navigate('/checkout');
    }
  };

  // Loading state with skeleton UI
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Shopping Cart</h1>
            <div className="animate-pulse">
              <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 border-b border-gray-200 last:border-0">
                    <div className="flex items-center space-x-6">
                      <div className="rounded-lg bg-gray-200 h-24 w-24"></div>
                      <div className="flex-1 space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white shadow-sm rounded-lg overflow-hidden p-6">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Your Shopping Cart</h1>
            <div className="bg-white shadow-sm rounded-lg p-8 mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">We encountered a problem</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link 
                to="/products" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Your Shopping Cart</h1>
            <div className="bg-white shadow-sm rounded-lg p-12 mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 text-gray-400 mb-6">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">Looks like you haven't added any products to your cart yet. Start shopping to add products.</p>
              <Link 
                to="/products" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cart with items
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Your Shopping Cart</h1>
            <p className="text-gray-600">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
            <div className="lg:col-span-8">
              <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item.product._id} className="p-6">
                      <div className="flex items-center sm:items-start">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-full w-full object-cover object-center"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                            }}
                          />
                        </div>

                        <div className="ml-6 flex-1 flex flex-col">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-base font-medium text-gray-900">
                                <Link to={`/product/${item.product._id}`} className="hover:text-indigo-600 transition-colors">
                                  {item.product.name}
                                </Link>
                              </h3>
                              {item.product.category && (
                                <p className="mt-1 text-sm text-gray-500">{item.product.category}</p>
                              )}
                            </div>
                            <p className="text-base font-medium text-gray-900">${item.price.toFixed(2)}</p>
                          </div>

                          <div className="flex-1 flex items-end justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <label htmlFor={`quantity-${item.product._id}`} className="text-gray-500">
                                Qty
                              </label>
                              <div className="flex items-center border border-gray-300 rounded">
                                <button
                                  type="button"
                                  className="p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
                                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                  </svg>
                                </button>
                                <span className="px-2 text-gray-900">{item.quantity}</span>
                                <button
                                  type="button"
                                  className="p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
                                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                >
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                              <button
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                                onClick={() => removeItem(item.product._id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center">
                <Link
                  to="/products"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            <div className="mt-8 lg:mt-0 lg:col-span-4">
              <div className="bg-white shadow-sm rounded-lg p-6 sticky top-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
                
                <dl className="space-y-4">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Subtotal</dt>
                    <dd className="text-sm font-medium text-gray-900">${calculateSubtotal().toFixed(2)}</dd>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Tax (10%)</dt>
                    <dd className="text-sm font-medium text-gray-900">${calculateTax().toFixed(2)}</dd>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Shipping</dt>
                    <dd className="text-sm font-medium text-gray-900">Free</dd>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-base font-medium text-gray-900">Order total</dt>
                      <dd className="text-base font-medium text-gray-900">${calculateTotal().toFixed(2)}</dd>
                    </div>
                  </div>
                </dl>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
                
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Secure checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
