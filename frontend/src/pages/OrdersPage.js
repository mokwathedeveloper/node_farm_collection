import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
// import { format } from 'date-fns';

function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        
        const response = await axios.get('/api/orders/myorders', config);
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo, navigate]);

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!userInfo) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      {loading ? (
        <div className="animate-pulse">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-4">
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-1/4 mt-4"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm font-semibold hover:text-red-800"
          >
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl mb-6">You haven't placed any orders yet.</p>
          <Link 
            to="/products" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">DATE</th>
                <th className="py-3 px-4 text-left">TOTAL</th>
                <th className="py-3 px-4 text-left">PAID</th>
                <th className="py-3 px-4 text-left">DELIVERED</th>
                <th className="py-3 px-4 text-left">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">
                    {order._id.substring(order._id.length - 8)}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    ${order.totalPrice?.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {order.isPaid ? (
                      <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs">
                        {formatDate(order.paidAt)}
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 py-1 px-2 rounded-full text-xs">
                        Not Paid
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {order.isDelivered ? (
                      <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs">
                        {formatDate(order.deliveredAt)}
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full text-xs">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <Link 
                      to={`/order/${order._id}`}
                      className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-1 px-3 rounded"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
