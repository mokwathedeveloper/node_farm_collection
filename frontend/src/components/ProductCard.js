import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    if (onAddToWishlist) {
      onAddToWishlist(product);
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const productUrl = `${window.location.origin}/product/${product._id}`;

    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this product: ${product.name}`,
        url: productUrl,
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(productUrl).then(() => {
        toast.success('Product link copied to clipboard!');
      }).catch(() => {
        toast.error('Failed to copy link');
      });
    }
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    handleAddToCart();
  };

  const isOutOfStock = !product.stock || product.stock === 0;
  const productImage = product.images?.[0]?.url || product.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgOTBMMTgwIDEyMEgxMjBMMTUwIDkwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNOTAgMjEwSDIxMFYxODBIOTBWMjEwWiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSIjNkI3MjgwIj5ObyBJbWFnZTwvdGV4dD4KPHN2Zz4K';
  const productPrice = typeof product.price === 'number' ? product.price.toFixed(2) : '0.00';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full flex flex-col group border border-gray-100 w-full max-w-xs mx-auto">
      {/* Image Container - Consistent size for all cards */}
      <div className="relative w-full h-48 sm:h-56 md:h-48 overflow-hidden bg-gray-50 cursor-pointer" onClick={handleClick}>
        {imageError ? (
          <div
            className="w-full h-full flex items-center justify-center cursor-pointer bg-gray-100"
            onClick={handleClick}
          >
            <div className="text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">No Image</p>
            </div>
          </div>
        ) : (
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={handleClick}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgOTBMMTgwIDEyMEgxMjBMMTUwIDkwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNOTAgMjEwSDIxMFYxODBIOTBWMjEwWiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSIjNkI3MjgwIj5ObyBJbWFnZTwvdGV4dD4KPHN2Zz4K';
              setImageError(true);
            }}
          />
        )}

        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
            Out of Stock
          </div>
        )}


      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Product Name */}
        <h3
          className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors duration-200 text-sm leading-tight overflow-hidden"
          onClick={handleClick}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '2.5rem',
          }}
        >
          {product.name}
        </h3>

        {/* Category */}
        <div className="mb-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.ratings || 0) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({product.numOfReviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <span className="text-lg font-bold text-gray-900">${productPrice}</span>
        </div>

        {/* Stock Info */}
        <div className="mt-auto">
          {isOutOfStock ? (
            <span className="text-red-600 text-xs font-medium">Out of Stock</span>
          ) : (
            <span className="text-green-600 text-xs font-medium">
              {product.stock} in stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 