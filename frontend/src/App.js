import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import SuperAdminSetup from './pages/SuperAdminSetup';
import SuperAdminPage from './pages/SuperAdminPage';
import SuperAdminRoute from './components/SuperAdminRoute';
// import UsersManagement from './pages/UsersManagement';
import AdminSetup from './pages/AdminSetup';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import AddressesPage from './pages/AddressesPage';
import PaymentMethodsPage from './pages/PaymentMethodsPage';
import GuestCheckoutPage from './pages/GuestCheckoutPage';
import { GuestProvider } from './context/GuestContext';
import OrderTrackingPage from './pages/OrderTrackingPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import store from './redux/store';

// Admin page imports
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminOrderDetailsPage from './pages/admin/AdminOrderDetailsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Superadmin page imports
import SuperAdminSettingsPage from './pages/superadmin/SuperAdminSettingsPage';
import SystemLogsPage from './pages/superadmin/SystemLogsPage';

// Router future flags
import { UNSAFE_EnableScrollRestoration, UNSAFE_useScrollRestoration } from 'react-router-dom';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Configure future flags
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <BrowserRouter basename="/" future={routerConfig.future}>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <GuestProvider>
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <main className="flex-grow">
                        <Routes>
                          {/* Public Routes */}
                          <Route path="/" element={<HomePage />} />
                          <Route path="/products" element={<ProductsPage />} />
                          <Route path="/product/:id" element={<ProductDetailsPage />} />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/guest-checkout" element={<GuestCheckoutPage />} />
                          <Route path="/order-tracking" element={<OrderTrackingPage />} />

                          {/* Client Routes */}
                          <Route element={<ProtectedRoute />}>
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/orders" element={<OrdersPage />} />
                            <Route path="/order/:id" element={<OrderDetailsPage />} />
                            <Route path="/addresses" element={<AddressesPage />} />
                            <Route path="/payment-methods" element={<PaymentMethodsPage />} />
                            <Route path="/wishlist" element={<WishlistPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                          </Route>

                          {/* Admin Routes */}
                          <Route element={<AdminRoute />}>
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/products" element={<AdminProductsPage />} />
                            <Route path="/admin/products/new" element={<AdminProductForm />} />
                            <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />
                            <Route path="/admin/orders" element={<AdminOrdersPage />} />
                            <Route path="/admin/customers" element={<AdminCustomersPage />} />
                            <Route path="/admin/reports" element={<AdminReportsPage />} />
                            <Route path="/admin/order/:id" element={<AdminOrderDetailsPage />} />
                            <Route path="/admin/settings" element={<AdminSettingsPage />} />
                          </Route>

                          {/* SuperAdmin Routes */}
                          <Route element={<SuperAdminRoute />}>
                            <Route path="/superadmin" element={<SuperAdminDashboard />} />
                            <Route path="/superadmin/settings" element={<SuperAdminSettingsPage />} />
                            <Route path="/superadmin/logs" element={<SystemLogsPage />} />
                          </Route>

                          {/* 404 Route */}
                          <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                      </main>
                      <Footer />
                      <ToastContainer position="bottom-right" />
                    </div>
                  </GuestProvider>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
