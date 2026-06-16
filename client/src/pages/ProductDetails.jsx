import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { Star, Heart, ShoppingCart, ArrowLeft, Loader2, ShieldCheck, Truck } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product details', error);
        addToast('Product not found', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate, addToast]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-48 text-slate-400">
        <Loader2 className="animate-spin text-primary-600 mb-4" size={40} />
        <span className="font-semibold text-sm">Loading product details...</span>
      </div>
    );
  }

  if (!product) return null;

  const wishlisted = isWishlisted(product._id);

  const handleQuantityChange = (val) => {
    const newQty = quantity + val;
    if (newQty >= 1 && newQty <= product.stock) {
      setQuantity(newQty);
    }
  };

  const handleCartClick = async () => {
    if (product.stock === 0) {
      addToast('Product is out of stock', 'warning');
      return;
    }
    try {
      await addToCart(product._id, quantity);
      addToast(`${quantity} ${product.title} added to cart!`, 'success');
    } catch (err) {
      addToast(err.response?.data?.message || err.message || 'Please log in first', 'error');
    }
  };

  const handleWishlistClick = async () => {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 font-semibold text-sm mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="bg-slate-100 rounded-2xl overflow-hidden aspect-square flex items-center justify-center border border-slate-200">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full w-fit">
            {product.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-4 leading-tight">
            {product.title}
          </h1>

          <div className="flex items-center gap-2 mt-4 pb-6 border-b border-slate-100">
            <div className="flex items-center text-amber-500">
              <Star size={16} className="fill-amber-500" />
            </div>
            <span className="text-sm font-bold text-slate-700">
              {product.ratings ? product.ratings.toFixed(1) : '0.0'} / 5.0
            </span>
            <span className="text-xs text-slate-400">
              (based on dummy ratings)
            </span>
          </div>

          <div className="mt-6">
            <span className="text-3xl font-black text-slate-900">${product.price ? product.price.toFixed(2) : '0.00'}</span>
            <div className="mt-2">
              {product.stock === 0 ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                  Out of Stock
                </span>
              ) : product.stock < 5 ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  Low Stock (Only {product.stock} items left!)
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  In Stock
                </span>
              )}
            </div>
          </div>

          <p className="mt-6 text-slate-600 text-sm sm:text-base leading-relaxed">
            {product.description}
          </p>

          {product.stock > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-600 disabled:opacity-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 font-bold text-slate-800 text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-600 disabled:opacity-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleCartClick}
              disabled={product.stock === 0}
              className={`flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 font-bold px-8 py-3.5 rounded-xl transition-all shadow-md ${
                product.stock === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-100'
              }`}
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>

            <button
              onClick={handleWishlistClick}
              className={`p-3.5 rounded-xl border transition-all ${
                wishlisted
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Add to Wishlist"
            >
              <Heart size={20} className={wishlisted ? 'fill-rose-500' : ''} />
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-primary-600" />
              <span>Free delivery on orders over $100</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary-600" />
              <span>100% Genuine product warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
