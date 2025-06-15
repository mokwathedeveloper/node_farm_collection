import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';

function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlist, loading, error } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      dispatch(getWishlist());
    }
  }, [dispatch, navigate, userInfo]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    toast.success('Added to cart');
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wishlist.map((product) => (
            <div key={product._id} className="border p-4 rounded shadow">
              {product.image && (
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-2" />
              )}
              <h3 className="text-lg font-semibold">
                <Link to={`/product/${product._id}`} className="hover:underline">
                  {product.name}
                </Link>
              </h3>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-green-600 font-bold">${product.price.toFixed(2)}</p>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={product.stock === 0}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button
                  onClick={() => handleRemove(product._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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
}

export default Wishlist;