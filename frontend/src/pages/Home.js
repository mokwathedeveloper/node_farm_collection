import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';

function Home() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts({ search, category, page: currentPage }));
  }, [dispatch, search, category, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchProducts({ search, category, page: 1 }));
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
    dispatch(fetchProducts({ search, category: e.target.value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    dispatch(fetchProducts({ search, category, page: newPage }));
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="border p-2 rounded flex-grow"
          />
          <select
            value={category}
            onChange={handleCategoryChange}
            className="border p-2 rounded"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="home">Home & Kitchen</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {products.length > 0 ? (
          products.map((product) => (
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
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-xl text-gray-500">No products found</p>
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
          className="px-4 py-2 mx-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Home;
