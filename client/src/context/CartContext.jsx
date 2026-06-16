import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        setLoading(true);
        try {
          const { data } = await API.get('/cart');
          setCart(data);
        } catch (error) {
          console.error('Error fetching cart', error);
        } finally {
          setLoading(false);
        }
      } else {
        setCart({ items: [] });
      }
    };
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      throw new Error('Please login to add items to cart');
    }
    try {
      const { data } = await API.post('/cart/add', { productId, quantity });
      setCart(data);
    } catch (error) {
      console.error('Error adding to cart', error);
      throw error;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) return;
    try {
      const { data } = await API.put('/cart/update', { productId, quantity });
      setCart(data);
    } catch (error) {
      console.error('Error updating cart quantity', error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      const { data } = await API.delete(`/cart/${productId}`);
      setCart(data);
    } catch (error) {
      console.error('Error removing from cart', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await API.delete('/cart');
      setCart({ items: [] });
    } catch (error) {
      console.error('Error clearing cart', error);
      throw error;
    }
  };

  const getSubtotal = () => {
    return cart.items.reduce((total, item) => {
      const price = item.productId?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getTax = () => {
    return Number((getSubtotal() * 0.15).toFixed(2));
  };

  const getDeliveryCharge = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal > 100 ? 0 : 15;
  };

  const getTotal = () => {
    return Number((getSubtotal() + getTax() + getDeliveryCharge()).toFixed(2));
  };

  const getCartCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getSubtotal,
        getTax,
        getDeliveryCharge,
        getTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
