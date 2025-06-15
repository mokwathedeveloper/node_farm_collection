import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/productSlice';

function ElectronicsPage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    // Fetch only electronics products
    dispatch(fetchProducts({ category: 'electronics', page: currentPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) return <div className="text-center py-10">Loading electronics...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Electronics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="border rounded-lg overflow-hidden shadow-md">
              <img
                src={product.image || 'https://via.placeholder.com/300'}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-700 mb-2">${product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mb-4">Electronics</p>
                <Link
                  to={`/product/${product._id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-center hover:bg-blue-700 block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-xl text-gray-500">No electronics products found</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 mx-1 bg-blue-600 text-white rounded">
          {currentPage}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={products && products.length === 0}
          className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ElectronicsPage;