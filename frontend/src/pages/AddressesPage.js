import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddressesPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get('/api/addresses', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAddresses(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch addresses');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/addresses', newAddress, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAddresses([...addresses, response.data]);
      setIsAdding(false);
      setNewAddress({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        isDefault: false
      });
    } catch (err) {
      setError('Failed to add address');
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      await axios.delete(`/api/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAddresses(addresses.filter(addr => addr._id !== addressId));
    } catch (err) {
      setError('Failed to delete address');
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      await axios.put(`/api/addresses/${addressId}/default`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAddresses();
    } catch (err) {
      setError('Failed to set default address');
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Address
        </button>
      </div>

      {isAdding && (
        <div className="mb-8 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Street Address</label>
              <input
                type="text"
                name="street"
                value={newAddress.street}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={newAddress.state}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={newAddress.postalCode}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={newAddress.country}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={newAddress.isDefault}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label>Set as default address</label>
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
                Save Address
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div key={address._id} className="border rounded-lg p-4">
            {address.isDefault && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Default
              </span>
            )}
            <p className="mt-2">{address.street}</p>
            <p>{address.city}, {address.state} {address.postalCode}</p>
            <p>{address.country}</p>
            <div className="mt-4 flex justify-end space-x-2">
              {!address.isDefault && (
                <button
                  onClick={() => setDefaultAddress(address._id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Set as Default
                </button>
              )}
              <button
                onClick={() => deleteAddress(address._id)}
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

export default AddressesPage; 