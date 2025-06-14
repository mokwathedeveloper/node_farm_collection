import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../config/api';
import { addToCart, removeFromCart, clearCartItems } from '../redux/slices/cartSlice';
import Loader from '../components/Loader';
import DeliveryOptionsSection from '../components/DeliveryOptionsSection';

function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, total } = useSelector((state) => state.cart || { cartItems: [], total: 0 });
  const { userInfo } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(null);
  const [step, setStep] = useState(1);

  // Calculate prices
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryPrice = selectedDeliveryOption ? selectedDeliveryOption.price : 0;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + deliveryPrice + taxPrice).toFixed(2);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      toast.error('Please fill all shipping fields');
      return;
    }
    setStep(2);
  };

  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    if (!selectedDeliveryOption) {
      toast.error('Please select a delivery option');
      return;
    }
    setStep(3);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    setStep(4);
  };

  const placeOrderHandler = async () => {
    if (!selectedDeliveryOption) {
      toast.error('Please select a delivery option');
      return;
    }

    try {
      setLoading(true);
      
      const { data } = await api.post('/api/orders', {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice: deliveryPrice,
        taxPrice,
        totalPrice,
        deliveryOption: selectedDeliveryOption._id
      });
      
      dispatch(clearCartItems());
      setLoading(false);
      navigate(`/orders/${data._id}`);
      toast.success('Order placed successfully');
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  if (loading) return <Loader />;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <p className="mb-6">Your cart is empty</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <form onSubmit={handleShippingSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="mb-4">
                <label htmlFor="address" className="block mb-2">Address</label>
                <input
                  type="text"
                  id="address"
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="block mb-2">City</label>
                <input
                  type="text"
                  id="city"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="postalCode" className="block mb-2">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="country" className="block mb-2">Country</label>
                <input
                  type="text"
                  id="country"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
              >
                Continue to Delivery
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Options</h2>
              <DeliveryOptionsSection
                onSelect={setSelectedDeliveryOption}
                selectedOption={selectedDeliveryOption}
              />
              <button
                onClick={handleDeliverySubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full mt-4"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handlePaymentSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="mb-4">
                <label className="block mb-2">Select Method</label>
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="PayPal"
                    checked={paymentMethod === 'PayPal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="paypal">PayPal or Credit Card</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="stripe"
                    name="paymentMethod"
                    value="Stripe"
                    checked={paymentMethod === 'Stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="stripe">Stripe</label>
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
              >
                Continue to Review
              </button>
            </form>
          )}
          
          {step === 4 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Shipping</h3>
                <p>
                  Address: {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Delivery Option</h3>
                <p>{selectedDeliveryOption?.name} - ${selectedDeliveryOption?.price}</p>
                <p className="text-sm text-gray-600">
                  Estimated delivery: {selectedDeliveryOption?.estimatedDays.min}-{selectedDeliveryOption?.estimatedDays.max} days
                </p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <p>{paymentMethod}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Order Items</h3>
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                    <div className="flex items-center">
                      <img 
                        src={item.image || 'https://via.placeholder.com/50?text=No+Image'} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded mr-4"
                      />
                      <span>{item.name}</span>
                    </div>
                    <span>
                      {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Items:</span>
                  <span>${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Delivery:</span>
                  <span>${deliveryPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax:</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
              <button
                onClick={placeOrderHandler}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full mt-4"
              >
                Place Order
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Items:</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Delivery:</span>
              <span>${deliveryPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax:</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total:</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
