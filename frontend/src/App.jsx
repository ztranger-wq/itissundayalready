import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import JakshPage from "./pages/JakshPage";
import QuotePage from "./pages/QuotePage"; // Import the new page
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import WishlistPage from './pages/WishlistPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ShippingAddressPage from './pages/ShippingAddressPage';
import PaymentPage from './pages/PaymentPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./index.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  // Add error handling for missing Google Client ID
  if (!GOOGLE_CLIENT_ID) {
    console.error('Google Client ID is not configured. Please add VITE_GOOGLE_CLIENT_ID to your .env file');
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || 'placeholder-client-id'}>
      <Router>
        <AuthProvider>
          <OrderProvider>
            <CartProvider>
              <div className="app-container">
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/jaksh" element={<JakshPage />} />
                    <Route path="/quote" element={<QuotePage />} /> {/* Add the new route */}
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/checkout" element={<ShippingAddressPage />} />
                    <Route path="/checkout/payment" element={<PaymentPage />} />
                    <Route path="/checkout/success" element={<OrderConfirmationPage />} />

                    <Route element={<ProtectedRoute />}>
                      <Route path="/wishlist" element={<WishlistPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                    </Route>
                  </Routes>
                </main>
                <Footer />
              </div>
            </CartProvider>
          </OrderProvider>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;