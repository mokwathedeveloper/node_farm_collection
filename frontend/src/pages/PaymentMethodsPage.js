import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaymentMethodsPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    isDefault: false
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get('/api/payment-methods', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPaymentMethods(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch payment methods');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPaymentMethod(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/payment-methods', newPaymentMethod, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPaymentMethods([...paymentMethods, response.data]);
      setIsAdding(false);
      setNewPaymentMethod({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        isDefault: false
      });
    } catch (err) {
      setError('Failed to add payment method');
    }
  };

  const deletePaymentMethod = async (paymentMethodId) => {
    try {
      await axios.delete(`/api/payment-methods/${paymentMethodId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPaymentMethods(paymentMethods.filter(method => method._id !== paymentMethodId));
    } catch (err) {
      setError('Failed to delete payment method');
    }
  };

  const setDefaultPaymentMethod = async (paymentMethodId) => {
    try {
      await axios.put(`/api/payment-methods/${paymentMethodId}/default`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchPaymentMethods();
    } catch (err) {
      setError('Failed to set default payment method');
    }
  };

  const formatCardNumber = (number) => {
    return `**** **** **** ${number.slice(-4)}`;
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payment Methods</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Card
        </button>
      </div>

      {isAdding && (
        <div className="mb-8 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Add New Card</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={newPaymentMethod.cardNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="1234 5678 9012 3456"
                required
                maxLength="19"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={newPaymentMethod.expiryDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="MM/YY"
                  required
                  maxLength="5"
                />
              </div>
              <div>
                <label className="block mb-1">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={newPaymentMethod.cvv}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="123"
                  required
                  maxLength="3"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1">Cardholder Name</label>
              <input
                type="text"
                name="cardholderName"
                value={newPaymentMethod.cardholderName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={newPaymentMethod.isDefault}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label>Set as default payment method</label>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save Card
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paymentMethods.map((method) => (
          <div key={method._id} className="border rounded-lg p-4">
            {method.isDefault && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Default
              </span>
            )}
            <div className="mt-2">
              <p className="text-lg font-semibold">{formatCardNumber(method.cardNumber)}</p>
              <p className="text-gray-600">{method.cardholderName}</p>
              <p className="text-gray-600">Expires: {method.expiryDate}</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              {!method.isDefault && (
                <button
                  onClick={() => setDefaultPaymentMethod(method._id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Set as Default
                </button>
              )}
              <button
                onClick={() => deletePaymentMethod(method._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodsPage; 