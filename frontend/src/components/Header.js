import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Add fallback for when auth state is undefined
  const auth = useSelector((state) => state.auth) || {};
  const { userInfo } = auth;
  
  // Add fallback for when cart state is undefined
  const cart = useSelector((state) => state.cart) || {};
  const cartItems = cart?.cartItems || [];

  const handleLogout = () => {
    try {
      console.log('Logging out from Header component...');
      dispatch(logout());
      
      // Navigate after logout
      navigate('/login');
      
      // Optional: Show success message
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error in Header:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">E-Commerce</Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-200 transition">Home</Link>
            <Link to="/products" className="hover:text-blue-200 transition">Products</Link>
            {userInfo && (
              <Link to="/orders" className="hover:text-blue-200 transition">Orders</Link>
            )}
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative hover:text-blue-200 transition">
              <i className="fas fa-shopping-cart"></i>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + (item.qty || 1), 0)}
                </span>
              )}
            </Link>
            
            {userInfo ? (
              <div className="relative group">
                <button className="flex items-center hover:text-blue-200 transition">
                  <span className="mr-1">{userInfo.name}</span>
                  <i className="fas fa-chevron-down text-xs"></i>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white text-gray-800 rounded shadow-lg py-2 z-10 hidden group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 transition">Profile</Link>
                  {userInfo.isAdmin && (
                    <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100 transition">Admin Dashboard</Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-red-100 hover:text-red-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hover:text-blue-200 transition">
                <i className="fas fa-user mr-1"></i> Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
