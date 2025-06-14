import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../redux/slices/orderSlice';
import { toast } from 'react-toastify';

function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fetchAttempted, setFetchAttempted] = useState(false);
  
  const { orders = [], loading = false, error = null } = useSelector((state) => state.order || {});
  const { userInfo } = useSelector((state) => state.auth || {});

  useEffect(() => {
    if (!userInfo) {
      // If not logged in, redirect to login
      navigate('/login', { state: { from: '/orders' } });
      return;
    }
    
    // Check if token exists and is valid
    if (!userInfo.token || typeof userInfo.token !== 'string' || userInfo.token.trim() === '') {
      console.error('Invalid token format in userInfo');
      toast.error('Authentication error. Please login again.');
      // Clear invalid auth data
      localStorage.removeItem('userInfo');
      navigate('/login', { state: { from: '/orders' } });
      return;
    }
    
    // Fetch orders if not already attempted
    if (!fetchAttempted) {
      console.log('Fetching orders with token:', userInfo.token.substring(0, 10) + '...');
      dispatch(getOrders())
        .unwrap()
        .then(() => {
          console.log('Orders fetched successfully');
        })
        .catch((err) => {
          console.error('Error fetching orders:', err);
          if (err.includes('Not authorized') || err.includes('token failed')) {
            toast.error('Session expired. Please login again.');
            localStorage.removeItem('userInfo');
            navigate('/login', { state: { from: '/orders' } });
          } else {
            toast.error(err || 'Failed to fetch orders');
          }
        });
      setFetchAttempted(true);
    }
  }, [dispatch, navigate, userInfo, fetchAttempted]);

  if (loading) return <div className="text-center p-4">Loading orders...</div>;
  
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          <button 
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setFetchAttempted(false);
              dispatch(getOrders());
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {!orders || orders.length === 0 ? (
        <p className="text-gray-600">No orders found. Start shopping to place your first order!</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded shadow">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Total:</strong> ${order.total?.toFixed(2) || '0.00'}</p>
              <p><strong>Status:</strong> {order.status || 'Processing'}</p>
              <div>
                <strong>Items:</strong>
                {order.items?.map((item, itemIndex) => (
                  <p key={item.product?._id || `item-${itemIndex}`} className="ml-4">
                    {item.product?.name || 'Product'} (x{item.quantity || 1}) - ${item.price?.toFixed(2) || '0.00'}
                  </p>
                )) || <p className="ml-4">No items</p>}
              </div>
              <p><strong>Shipping Address:</strong> {order.shippingAddress ? Object.values(order.shippingAddress).join(', ') : 'Not provided'}</p>
              <p><strong>Ordered At:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
