import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import api from '../config/api';

function OrderDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/orders/${id}`);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order details');
        setLoading(false);
        toast.error(err.response?.data?.message || 'Failed to fetch order details');
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) return <Loader />;
  
  if (error) return <div className="text-center text-red-500">{error}</div>;
  
  if (!order) return <div className="text-center">Order not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order #{order._id}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <p className="mb-2"><strong>Name:</strong> {order.user?.name}</p>
            <p className="mb-2"><strong>Email:</strong> {order.user?.email}</p>
            <p className="mb-2">
              <strong>Address:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
            </p>
            <p className={`mt-4 ${order.isDelivered ? 'text-green-600' : 'text-red-600'}`}>
              {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Not Delivered'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            {order.deliveryOption ? (
              <>
                <p className="mb-2"><strong>Method:</strong> {order.deliveryOption.name}</p>
                <p className="mb-2"><strong>Provider:</strong> {order.deliveryOption.provider}</p>
                <p className="mb-2">
                  <strong>Estimated Delivery:</strong> {order.deliveryOption.estimatedDays.min}-{order.deliveryOption.estimatedDays.max} days
                </p>
                <p className="mb-2"><strong>Cost:</strong> ${order.deliveryOption.price.toFixed(2)}</p>
                {order.trackingNumber && (
                  <p className="mb-2"><strong>Tracking Number:</strong> {order.trackingNumber}</p>
                )}
              </>
            ) : (
              <p className="text-gray-600">No delivery information available</p>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <p className="mb-2"><strong>Method:</strong> {order.paymentMethod}</p>
            <p className={`mt-4 ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
              {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            {order.orderItems?.length === 0 ? (
              <p>Order is empty</p>
            ) : (
              <div>
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="flex items-center py-4 border-b last:border-b-0">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img 
                        src={item.image || 'https://via.placeholder.com/80?text=No+Image'} 
                        alt={item.name} 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <Link to={`/products/${item.product}`} className="text-blue-600 hover:text-blue-800">
                        {item.name}
                      </Link>
                      <p className="text-gray-600">
                        {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between py-2 border-b">
              <span>Items</span>
              <span>${order.itemsPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Shipping</span>
              <span>${order.shippingPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Tax</span>
              <span>${order.taxPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 font-bold">
              <span>Total</span>
              <span>${order.totalPrice?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;