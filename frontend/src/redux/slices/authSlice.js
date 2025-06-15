import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('Attempting login with:', { email });
      
      const { data } = await api.post('/auth/login', { email, password });
      
      console.log('Login successful, received data:', { 
        id: data._id, 
        name: data.name, 
        role: data.role,
        tokenExists: !!data.token 
      });
      
      // Store user info and token in localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('Token stored in localStorage');
      } else {
        console.warn('No token received in login response');
      }

      return data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message || 'Login failed'
      );
    }
  }
);

// Initial state
const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  loading: false,
  error: null,
};

// Initialize token from userInfo if it exists but token doesn't exist separately
const initializeToken = () => {
  const userInfo = localStorage.getItem('userInfo');
  const token = localStorage.getItem('token');

  if (userInfo && !token) {
    try {
      const parsedUserInfo = JSON.parse(userInfo);
      if (parsedUserInfo.token) {
        localStorage.setItem('token', parsedUserInfo.token);
        console.log('Token initialized from userInfo');
      }
    } catch (error) {
      console.error('Error parsing userInfo:', error);
    }
  }
};

// Initialize token on module load
initializeToken();

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      state.userInfo = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
