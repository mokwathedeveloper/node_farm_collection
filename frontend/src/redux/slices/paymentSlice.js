import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';

// Async thunks
export const createPaymentIntent = createAsyncThunk(
  'payment/createPaymentIntent',
  async ({ amount }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/payments/create-payment-intent`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.clientSecret;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create payment intent');
    }
  }
);

const initialState = {
  clientSecret: null,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentIntent: (state) => {
      state.clientSecret = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPaymentIntent } = paymentSlice.actions;
export default paymentSlice.reducer;
