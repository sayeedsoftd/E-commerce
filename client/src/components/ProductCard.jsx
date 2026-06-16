import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const { addToast } = useToast();

  const wishlisted = isWishlisted(product._id);

  const handleCartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) {
      addToast('Product is out of stock', 'warning');
      return;
    }
    try {
      await addToCart(product._id, 1);
      addToast(`${product.title} added to cart!`, 'success');
    } catch (err) {
      addToast(err.response?.data?.message || err.message || 'Please log in first', 'error');
    }
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (wishlisted) {
        await removeFromWishlist(product._id);
        addToast('Removed from wishlist', 'info');
      } else {
        await addToWishlist(product._id);
        addToast('Added to wishlist!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || err.message || 'Please log in first', 'error');
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <button
        onClick={handleWishlistClick}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/85 hover:bg-white shadow-md text-slate-500 hover:text-rose-500 transition-colors backdrop-blur-sm"
      >
        <Heart size={18} className={wishlisted ? 'fill-rose-500 text-rose-500' : ''} />
      </button>

      <Link to={`/product/${product._id}`} className="block overflow-hidden bg-slate-100 aspect-square">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80';
          }}
        />
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">
          {product.category}
        </span>
        <Link to={`/product/${product._id}`} className="mt-1 group-hover:text-primary-600 transition-colors">
          <h3 className="font-bold text-slate-800 text-sm line-clamp-2 min-h-[40px]">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-2">
          <div className="flex items-center text-amber-500">
            <Star size={14} className="fill-amber-500" />
          </div>
          <span className="text-xs font-bold text-slate-600">{product.ratings ? product.ratings.toFixed(1) : '0.0'}</span>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div>
            <span className="text-lg font-black text-slate-900">${product.price ? product.price.toFixed(2) : '0.00'}</span>
            {product.stock === 0 ? (
              <span className="block text-[10px] font-bold text-rose-500 mt-0.5">Out of Stock</span>
            ) : product.stock < 5 ? (
              <span className="block text-[10px] font-bold text-amber-500 mt-0.5">Only {product.stock} left</span>
            ) : (
              <span className="block text-[10px] font-semibold text-emerald-500 mt-0.5">In Stock</span>
            )}
          </div>

          <button
            onClick={handleCartClick}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-xl transition-all ${
              product.stock === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-200'
            }`}
            title="Add to Cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
