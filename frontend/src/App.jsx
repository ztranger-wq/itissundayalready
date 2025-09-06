import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import JakshPage from "./pages/JakshPage";
import QuotePage from "./pages/QuotePage"; // Import the new page
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import WishlistPage from './pages/WishlistPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ShippingAddressPage from './pages/ShippingAddressPage';
import PaymentPage from './pages/PaymentPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
// TODO: The AuthProvider, CartProvider, and OrderProvider may need to be refactored or removed
// depending on how state is managed with Amplify and React Query/SWR.
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ScrollProgressBar from './components/layout/ScrollProgressBar';
import "./index.css";

// TODO: STEP 1: Set up Amplify
// After running `amplify init` and `amplify add auth`, this file will be generated.
// import { Amplify } from 'aws-amplify';
// import awsExports from './aws-exports';
// Amplify.configure(awsExports);

// TODO: STEP 2: Import the Authenticator UI component
// import { Authenticator } from '@aws-amplify/ui-react';
// import '@aws-amplify/ui-react/styles.css';

function App() {
  return (
    // TODO: STEP 3: Wrap the app in the Authenticator
    // This will handle the entire sign-up/sign-in/forgot-password flow.
    // <Authenticator>
    //   {({ signOut, user }) => (
        <Router>
          {/* The existing providers might be refactored or replaced by a centralized state management solution like Redux or Zustand alongside Amplify */}
          <AuthProvider>
            <OrderProvider>
              <CartProvider>
                <div className="app-container">
                  <ScrollProgressBar />
                  {/* The Header component will need to be updated to use the `signOut` and `user` props from the Authenticator */}
                  <Header />
                  <main>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/jaksh" element={<JakshPage />} />
                      <Route path="/quote" element={<QuotePage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      <Route path="/checkout" element={<ShippingAddressPage />} />
                      <Route path="/checkout/payment" element={<PaymentPage />} />
                      <Route path="/checkout/success" element={<OrderConfirmationPage />} />

                      {/* ProtectedRoute will need to be refactored to check the Amplify auth state */}
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
    //   )}
    // </Authenticator>
  );
}

export default App;