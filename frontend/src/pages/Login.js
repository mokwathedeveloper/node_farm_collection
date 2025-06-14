import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [superadminExists, setSuperadminExists] = useState(true);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { userInfo, loading, error } = useSelector((state) => state.auth);
  
  const redirect = location.state?.from || '/';
  
  useEffect(() => {
    // If already logged in, redirect
    if (userInfo) {
      console.log('User already logged in, redirecting to:', redirect);
      console.log('User info:', userInfo);
      
      // Redirect based on role
      if (userInfo.role === 'superadmin') {
        navigate('/superadmin');
      } else if (userInfo.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    }
  }, [navigate, userInfo, redirect]);

  useEffect(() => {
    const checkSuperadmin = async () => {
      try {
        const { data } = await axios.get('/api/auth/check-superadmin');
        setSuperadminExists(data.exists);
      } catch (err) {
        // Only log error if it's not a 404
        if (err.response?.status !== 404) {
          console.error('Error checking superadmin:', err);
        }
      }
    };
    
    checkSuperadmin();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    console.log('Login with:', { email, password });
    
    try {
      const resultAction = await dispatch(login({ email, password }));
      
      if (login.fulfilled.match(resultAction)) {
        // Success! Check if token exists
        const userData = resultAction.payload;
        if (!userData.token) {
          toast.error('Login successful but no token received');
          return;
        }
        
        toast.success('Login successful!');
        
        // Redirect based on role
        if (userData.role === 'superadmin') {
          navigate('/superadmin');
        } else if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(redirect);
        }
      } else if (login.rejected.match(resultAction)) {
        // Handle the error
        const errorMsg = resultAction.payload || 'Login failed';
        toast.error(errorMsg);
      }
    } catch (err) {
      toast.error('An error occurred during login');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>
        
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>

        {!superadminExists && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">No superadmin account exists yet.</p>
            <Link 
              to="/setup-superadmin" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Setup Superadmin Account
            </Link>
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">Need an admin account?</p>
          <Link 
            to="/setup-admin" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Setup Admin Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
