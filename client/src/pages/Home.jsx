import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const categories = ['All', 'Electronics', 'Clothing', 'Home', 'Books', 'Shoes', 'Sports'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/products?search=${debouncedSearch}`;
        if (category && category !== 'All') {
          url += `&category=${category}`;
        }
        if (minPrice) url += `&minPrice=${minPrice}`;
        if (maxPrice) url += `&maxPrice=${maxPrice}`;

        const { data } = await API.get(url);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [debouncedSearch, category, minPrice, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-primary-600 to-indigo-700 rounded-3xl p-8 sm:p-12 mb-8 text-white relative overflow-hidden shadow-lg shadow-primary-100">
        <div className="relative z-10 max-w-xl">
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Summer Collection 2026
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mt-4 leading-tight">
            Discover the Future of Premium Shopping
          </h1>
          <p className="text-primary-100 mt-4 text-sm sm:text-base leading-relaxed">
            Get up to 40% off on premium categories. High quality goods, instant checkout, and tracked shipping.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 text-9xl font-black pointer-events-none -mr-12 -mb-12">
          SALE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 h-fit lg:sticky lg:top-24">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <SlidersHorizontal size={18} className="text-slate-700" />
            <h2 className="font-extrabold text-slate-800 text-base">Filters</h2>
          </div>

          <div className="mt-6">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Search Products
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to search..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors"
              />
              <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="flex flex-col gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-left px-3 py-2 rounded-xl text-sm transition-all font-semibold ${
                    category === cat
                      ? 'bg-primary-50 text-primary-600 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Price Range ($)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm font-semibold text-slate-500">
              Showing {products.length} products
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Loader2 className="animate-spin text-primary-600 mb-4" size={40} />
              <span className="font-semibold text-sm">Loading products catalog...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 font-medium">
              No products found matching the criteria. Try adjusting filters or searches.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
