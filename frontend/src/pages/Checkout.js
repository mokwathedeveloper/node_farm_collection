import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createOrder } from '../redux/slices/orderSlice';
import { createPaymentIntent } from '../redux/slices/paymentSlice';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      shippingAddress: {
        street: userInfo?.address?.street || '',
        city: userInfo?.address?.city || '',
        state: userInfo?.address?.state || '',
        zip: userInfo?.address?.zip || '',
        country: userInfo?.address?.country || '',
      },
    },
  });

  const onSubmit = async (data) => {
    if (!stripe || !elements) return;

    try {
      // Display cart items in the form submission
      console.log('Cart items being processed:', cart?.items);
      
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: userInfo.name,
            email: userInfo.email,
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        await dispatch(createOrder(data)).unwrap();
        toast.success('Order placed successfully');
        navigate('/profile');
      }
    } catch (err) {
      toast.error(err?.message || 'Payment failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-lg font-bold">Shipping Address</h3>
      <div>
        <label className="block">Street</label>
        <input
          type="text"
          {...register('shippingAddress.street', { required: 'Street is required' })}
          className="w-full border p-2 rounded"
        />
        {errors.shippingAddress?.street && (
          <p className="text-red-500">{errors.shippingAddress.street.message}</p>
        )}
      </div>
      <div>
        <label className="block">City</label>
        <input
          type="text"
          {...register('shippingAddress.city', { required: 'City is required' })}
          className="w-full border p-2 rounded"
        />
        {errors.shippingAddress?.city && (
          <p className="text-red-500">{errors.shippingAddress.city.message}</p>
        )}
      </div>
      <div>
        <label className="block">State</label>
        <input
          type="text"
          {...register('shippingAddress.state', { required: 'State is required' })}
          className="w-full border p-2 rounded"
        />
        {errors.shippingAddress?.state && (
          <p className="text-red-500">{errors.shippingAddress.state.message}</p>
        )}
      </div>
      <div>
        <label className="block">ZIP</label>
        <input
          type="text"
          {...register('shippingAddress.zip', { required: 'ZIP is required' })}
          className="w-full border p-2 rounded"
        />
        {errors.shippingAddress?.zip && (
          <p className="text-red-500">{errors.shippingAddress.zip.message}</p>
        )}
      </div>
      <div>
        <label className="block">Country</label>
        <input
          type="text"
          {...register('shippingAddress.country', { required: 'Country is required' })}
          className="w-full border p-2 rounded"
        />
        {errors.shippingAddress?.country && (
          <p className="text-red-500">{errors.shippingAddress.country.message}</p>
        )}
      </div>
      <h3 className="text-lg font-bold">Payment Details</h3>
      <CardElement className="border p-2 rounded" />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
        disabled={!stripe}
      >
        Place Order
      </button>
    </form>
  );
}

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading: cartLoading } = useSelector((state) => state.cart);
  const { clientSecret, loading: paymentLoading } = useSelector((state) => state.payment);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else if (!cart || cart.items.length === 0) {
      navigate('/cart');
    } else if (!clientSecret) {
      dispatch(createPaymentIntent({ amount: cart.total * 100 }));
    }
  }, [userInfo, cart, clientSecret, dispatch, navigate]);

  if (cartLoading || paymentLoading) return <div className="text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <div className="mb-4">
        <h3 className="text-lg font-bold">Order Summary</h3>
        {cart?.items?.map((item) => (
          <div key={item.product._id} className="flex justify-between">
            <span>
              {item.product.name} x {item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-2">
          <span>Total</span>
          <span>${cart?.total?.toFixed(2)}</span>
        </div>
      </div>
      {clientSecret && (
        <Elements stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
}

export default Checkout;
