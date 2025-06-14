import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';

const WishlistPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { wishlist, loading, error, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleRemoveFromWishlist = async (productId) => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    await removeFromWishlist(productId);
  };

  const handleAddToCart = async (productId) => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    try {
      // Add to cart logic here
      navigate('/cart');
    } catch (err) {
      toast.error('Failed to add item to cart');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-red-500 text-center">
        <p className="text-xl font-semibold mb-2">Error</p>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="text-center p-4">
          <p className="text-gray-600">Your wishlist is empty</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item._id} className="border rounded-lg p-4 shadow-sm">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
              <p className="text-gray-600 mb-2">${item.price}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleAddToCart(item._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemoveFromWishlist(item._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage; 