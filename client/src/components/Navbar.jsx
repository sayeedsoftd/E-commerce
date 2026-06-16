import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingCart, Heart, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const cartCount = getCartCount();
  const wishlistCount = wishlist?.products?.length || 0;

  return (
    <nav className="sticky top-0 z-45 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-extrabold text-primary-600 tracking-tight flex items-center gap-2">
              <span className="text-3xl">🛍️</span> SayeedShop
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/" className="text-slate-600 hover:text-primary-600 font-semibold text-sm transition-colors">
              Catalog
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 text-slate-600 hover:text-primary-600 font-semibold text-sm transition-colors"
                  >
                    <LayoutDashboard size={16} />
                    Admin
                  </Link>
                )}

                <Link
                  to="/wishlist"
                  className="relative flex items-center text-slate-600 hover:text-primary-600 transition-colors"
                >
                  <Heart size={20} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white rounded-full text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  className="relative flex items-center text-slate-600 hover:text-primary-600 transition-colors"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-primary-600 text-white rounded-full text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 hidden sm:inline">{user.name}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="text-slate-500 hover:text-rose-600 transition-colors"
                    title="Log Out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-primary-600 font-semibold text-sm transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
