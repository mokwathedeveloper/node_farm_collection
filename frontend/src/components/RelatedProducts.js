import React, { useState, useEffect } from 'react';
import { getRelatedProducts } from '../services/api';
import ProductCard from './ProductCard';

const RelatedProducts = ({ currentProductId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getRelatedProducts(currentProductId);

        // The API returns { success: true, products: [...] }
        const relatedProducts = response.products || [];
        setProducts(relatedProducts.slice(0, 4)); // Limit to 4 products
      } catch (err) {
        console.error('Error fetching related products:', err);

        // If the API call fails, try to fallback to a general products call
        try {
          console.log('Attempting fallback to general products...');
          const { getProducts } = await import('../services/api');
          const fallbackResponse = await getProducts({ limit: 4 });
          const fallbackProducts = fallbackResponse.data || fallbackResponse.products || [];

          // Filter out current product if it exists in the results
          const filteredProducts = fallbackProducts.filter(p => p._id !== currentProductId);
          setProducts(filteredProducts.slice(0, 4));
          setError(null); // Clear error since fallback worked
        } catch (fallbackErr) {
          console.error('Fallback also failed:', fallbackErr);
          setError('Failed to fetch related products');
        }
      } finally {
        setLoading(false);
      }
    };

    if (currentProductId) {
      fetchRelatedProducts();
    }
  }, [currentProductId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        <p>No related products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default RelatedProducts; 