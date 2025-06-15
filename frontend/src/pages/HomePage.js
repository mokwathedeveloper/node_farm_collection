import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('/api/products/featured?limit=4');
        
        if (response.data && response.data.products) {
          setFeaturedProducts(response.data.products);
        } else if (Array.isArray(response.data)) {
          setFeaturedProducts(response.data);
        } else {
          setFeaturedProducts([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setError('Failed to fetch featured products');
        setLoading(false);
        toast.error('Failed to fetch featured products');
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-16">
        <div className="bg-blue-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Shop</h1>
          <p className="text-xl mb-6">Discover amazing products at great prices</p>
          <Link 
            to="/products" 
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse bg-white rounded-lg shadow-md p-4">
                <div className="bg-gray-300 h-48 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={(product) => {
                  // Add to cart functionality - you can implement this
                  console.log('Add to cart:', product);
                }}
                onAddToWishlist={(product) => {
                  // Add to wishlist functionality - you can implement this
                  console.log('Add to wishlist:', product);
                }}
              />
            ))}
            {featuredProducts.length === 0 && (
              <div className="col-span-4 text-center text-gray-500">
                No featured products available
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
