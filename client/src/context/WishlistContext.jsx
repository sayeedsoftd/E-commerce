import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        setLoading(true);
        try {
          const { data } = await API.get('/wishlist');
          setWishlist(data);
        } catch (error) {
          console.error('Error fetching wishlist', error);
        } finally {
          setLoading(false);
        }
      } else {
        setWishlist({ products: [] });
      }
    };
    fetchWishlist();
  }, [user]);

  const addToWishlist = async (productId) => {
    if (!user) {
      throw new Error('Please login to use the wishlist');
    }
    try {
      const { data } = await API.post('/wishlist/add', { productId });
      setWishlist(data);
    } catch (error) {
      console.error('Error adding to wishlist', error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    try {
      const { data } = await API.delete(`/wishlist/${productId}`);
      setWishlist(data);
    } catch (error) {
      console.error('Error removing from wishlist', error);
      throw error;
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.products.some(p => (p._id || p) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
