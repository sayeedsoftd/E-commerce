import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';

const Cart = () => {
  const {
    cart,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
    getSubtotal,
    getTax,
    getDeliveryCharge,
    getTotal,
  } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleQtyChange = async (productId, currentQty, amount, stock) => {
    const nextQty = currentQty + amount;
    if (nextQty < 1) return;
    if (nextQty > stock) {
      addToast('Cannot exceed available stock limit', 'warning');
      return;
    }
    try {
      await updateQuantity(productId, nextQty);
    } catch (err) {
      addToast('Failed to update quantity', 'error');
    }
  };

  const handleRemove = async (productId, title) => {
    try {
      await removeFromCart(productId);
      addToast(`${title} removed from cart`, 'info');
    } catch (err) {
      addToast('Failed to remove item', 'error');
    }
  };

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
        addToast('Cart cleared', 'info');
      } catch (err) {
        addToast('Failed to clear cart', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-48 text-slate-400">
        <span className="font-semibold text-sm">Loading your cart items...</span>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-6">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-slate-500 text-sm mt-2">
          Looks like you haven't added anything to your cart yet. Let's find some great products!
        </p>
        <Link
          to="/"
          className="inline-block mt-6 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-white border border-slate-200 rounded-2xl p-4">
            <span className="text-sm font-bold text-slate-700">
              {cart.items.length} unique items in your cart
            </span>
            <button
              onClick={handleClear}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1"
            >
              <Trash2 size={14} /> Clear Cart
            </button>
          </div>

          <div className="space-y-4">
            {cart.items.map((item) => {
              const p = item.productId;
              if (!p) return null;
              return (
                <div
                  key={item._id || p._id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div>
                      <Link
                        to={`/product/${p._id}`}
                        className="font-bold text-slate-800 text-sm hover:text-primary-600 transition-colors line-clamp-2"
                      >
                        {p.title}
                      </Link>
                      <span className="block text-xs font-semibold text-primary-600 mt-1">
                        {p.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-12 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => handleQtyChange(p._id, item.quantity, -1, p.stock)}
                        className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 font-bold text-slate-800 text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQtyChange(p._id, item.quantity, 1, p.stock)}
                        className="px-2.5 py-1 text-slate-500 hover:bg-slate-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-extrabold text-slate-900 text-base">
                        ${((p.price || 0) * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemove(p._id, p.title)}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 h-fit">
          <h2 className="font-black text-slate-800 text-lg border-b border-slate-100 pb-4 font-bold">
            Order Summary
          </h2>

          <div className="mt-6 space-y-4 text-sm font-semibold text-slate-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-slate-800">${getSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (15% VAT)</span>
              <span className="text-slate-800">${getTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span className="text-slate-800">
                {getDeliveryCharge() === 0 ? 'FREE' : `$${getDeliveryCharge().toFixed(2)}`}
              </span>
            </div>
            {getDeliveryCharge() > 0 && (
              <p className="text-[10px] text-amber-600 mt-1 leading-normal">
                💡 Add ${(100 - getSubtotal()).toFixed(2)} more to unlock free delivery!
              </p>
            )}

            <div className="border-t border-slate-100 pt-4 mt-4 flex justify-between items-baseline">
              <span className="text-slate-800 font-bold">Total</span>
              <span className="text-2xl font-black text-slate-900">${getTotal().toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full mt-8 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-primary-100 flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
