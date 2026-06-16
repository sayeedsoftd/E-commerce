import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleRemove = async (productId, title) => {
    try {
      await removeFromWishlist(productId);
      addToast(`${title} removed from wishlist`, 'info');
    } catch (err) {
      addToast('Failed to remove item', 'error');
    }
  };

  const handleAddToCart = async (product) => {
    if (product.stock === 0) {
      addToast('Product is out of stock', 'warning');
      return;
    }
    try {
      await addToCart(product._id, 1);
      addToast(`${product.title} added to cart!`, 'success');
    } catch (err) {
      addToast(err.response?.data?.message || err.message || 'Failed to add item', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-48 text-slate-400">
        <span className="font-semibold text-sm">Loading your wishlist items...</span>
      </div>
    );
  }

  if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-6">
          <Heart size={36} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Your Wishlist is Empty</h2>
        <p className="text-slate-500 text-sm mt-2">
          Keep track of items you like. Add items to your wishlist and buy them later!
        </p>
        <Link
          to="/"
          className="inline-block mt-6 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8">My Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.products.map((p) => (
          <div
            key={p._id}
            className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col"
          >
            <button
              onClick={() => handleRemove(p._id, p.title)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white hover:bg-rose-50 shadow-md text-slate-400 hover:text-rose-500 transition-colors"
              title="Remove from Wishlist"
            >
              <Trash2 size={16} />
            </button>

            <Link to={`/product/${p._id}`} className="block overflow-hidden bg-slate-100 aspect-square">
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </Link>

            <div className="p-5 flex flex-col flex-grow">
              <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">
                {p.category}
              </span>
              <Link to={`/product/${p._id}`} className="mt-1 hover:text-primary-600 transition-colors">
                <h3 className="font-bold text-slate-800 text-sm line-clamp-2 min-h-[40px]">
                  {p.title}
                </h3>
              </Link>

              <div className="mt-auto pt-4 flex items-center justify-between gap-4">
                <div>
                  <span className="text-lg font-black text-slate-900">${(p.price || 0).toFixed(2)}</span>
                  <span className={`block text-[10px] font-bold mt-0.5 ${p.stock === 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {p.stock === 0 ? 'Out of Stock' : 'In Stock'}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(p)}
                  disabled={p.stock === 0}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  <ShoppingCart size={14} /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
