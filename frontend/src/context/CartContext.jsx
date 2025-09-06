import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

const API_URL = '/api/cart';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const mergeGuestCart = useCallback(async () => {
    const guestCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (guestCart.length > 0) {
      try {
        await axios.post(`${API_URL}/merge`, 
          { guestCart },
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`
            }
          }
        );
        clearLocalCart();
      } catch (error) {
        console.error("Failed to merge cart", error);
      }
    }
  }, []);

  // Fetch cart from API if user is logged in, otherwise from localStorage
  useEffect(() => {
    const initializeCart = async () => {
      setLoading(true);
      if (user) {
        // User is logged in, merge local cart with server cart, then fetch
        await mergeGuestCart();
        try {
          const response = await axios.get(API_URL, {
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`
            }
          });
          setCart(response.data || []);
        } catch (error) {
          console.error("Failed to fetch user cart", error);
          setCart([]);
        }
      } else {
        // No user, load from localStorage
        try {
          const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
          setCart(localCart);
        } catch (error) {
          console.error("Failed to parse local cart", error);
          setCart([]);
        }
      }
      setLoading(false);
    };

    initializeCart();
  }, [user, mergeGuestCart]);

  const addItemToCart = async (product, quantity = 1, customizationOptions = {}) => {
    try {
      if (user) {
        const response = await axios.post(API_URL,
          { productId: product._id, quantity, customizationOptions },
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`
            }
          }
        );
        setCart(response.data || []);
      } else {
        const newCart = [...cart];
        const itemIndex = newCart.findIndex(item => item.product._id === product._id);
        if (itemIndex > -1) {
          newCart[itemIndex].quantity += quantity;
        } else {
          newCart.push({ product, quantity, customizationOptions });
        }
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  };

  const updateItemQuantity = async (productId, quantity) => {
    try {
      if (user) {
        const response = await axios.post(API_URL, 
          { productId, quantity },
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`
            }
          }
        );
        setCart(response.data || []);
      } else {
        const newCart = cart.map(item => {
          const pid = item.product ? item.product._id : (item._id || (item.product && item.product._id));
          if (pid === productId) {
            return { ...item, quantity };
          }
          return item;
        });
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
      }
    } catch (error) {
      console.error('Error updating item quantity:', error);
      throw error;
    }
  };

  const removeItemFromCart = async (productId) => {
    try {
      if (user) {
        const response = await axios.delete(`${API_URL}/${productId}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`
          }
        });
        setCart(response.data || []);
      } else {
        const newCart = cart.filter(item => item.product._id !== productId);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        // Remove items one by one
        for (const item of cart) {
          await removeItemFromCart(item.product._id);
        }
      } else {
        setCart([]);
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const clearLocalCart = () => {
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addItemToCart,
      updateItemQuantity,
      removeItemFromCart,
      clearCart,
      clearLocalCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
