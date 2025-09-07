import { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api'; // Use our central api instance

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // This is the new core function to load the complete user profile.
  const loadUser = useCallback(async () => {
    // The token is now handled by the api interceptor, but we check for it
    // in localStorage to see if we should even attempt to load a user.
    const storedUser = localStorage.getItem('user');
    if (storedUser && JSON.parse(storedUser).token) {
      try {
        // This single API call gets the full user object AND the populated wishlist.
        const { data } = await api.get('/auth/profile');
        setUser(data);
        setWishlist(data.wishlist || []);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to load user profile, logging out.', error);
        logout(); // Token is likely invalid/expired.
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data) {
      // Only store the token. The full user data will be fetched by loadUser.
      localStorage.setItem('user', JSON.stringify({ token: response.data.token }));
      await loadUser(); // Fetch the complete user profile after login.
    }
    return response.data;
  };

  const loginWithGoogle = async (data) => {
    if (data) {
      localStorage.setItem('user', JSON.stringify({ token: data.token }));
      await loadUser();
    }
    return data;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify({ token: response.data.token }));
      await loadUser(); // Fetch the complete user profile after registration.
    }
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setWishlist([]);
    setIsAuthenticated(false);
  };

  const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  };

  const resetPassword = async (token, password) => {
    const response = await api.patch(`/auth/reset-password/${token}`, { password });
    return response.data;
  };

  const updateProfile = async (userData) => {
    const { data } = await api.put('/auth/profile', userData);
    // The backend returns the updated user, so we update our state.
    setUser(data);
    // Also update the wishlist state to prevent desynchronization
    setWishlist(data.wishlist || []);
    return data;
  };

  const deleteAccount = async () => {
    await api.delete('/auth/profile');
    logout(); // On successful deletion, log the user out
  };

  const toggleWishlist = async (productId) => {
    // Optimistic UI update for wishlist
    const isInWishlist = wishlist.some(p => p._id === productId);
    let updatedWishlist;
    if (isInWishlist) {
      updatedWishlist = wishlist.filter(p => p._id !== productId);
    } else {
      // Add productId placeholder, actual product details may be fetched later
      updatedWishlist = [...wishlist, { _id: productId }];
    }
    setWishlist(updatedWishlist);

    try {
      // The backend should return the fully updated and populated user object.
      const { data } = await api.put('/auth/profile/wishlist', { productId });
      // Update state directly from the response, no extra fetch needed.
      setUser(data);
      setWishlist(data.wishlist || []);
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      // Revert optimistic update on failure
      setWishlist(wishlist);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        wishlist,
        login,
        loginWithGoogle,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        deleteAccount,
        toggleWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
