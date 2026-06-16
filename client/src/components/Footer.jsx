import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <span className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              🛍️ SayeedShop
            </span>
            <p className="mt-4 text-sm text-slate-400 max-w-md leading-relaxed">
             SayeedShop is a premium production-grade e-commerce application demonstrating modern technologies, fully optimized layouts, secure JWT authorization, instant payment processing, and comprehensive analytics.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider font-bold">Navigation</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Catalog</a></li>
              <li><a href="/cart" className="hover:text-white transition-colors">Shopping Cart</a></li>
              <li><a href="/wishlist" className="hover:text-white transition-colors">Wishlist</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider font-bold">Contact & Social</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="text-slate-400">Support: abusayeedt202@gmail.com</li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter / X</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          &copy; {new Date().getFullYear()} SayeedShop. All rights reserved. Designed with ❤️ for scaling commerce.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
