import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { Loader2, Plus, Edit2, Trash2, X } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { addToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
    price: '',
    stock: '',
    ratings: '',
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load products list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setForm({
      title: '',
      description: '',
      image: '',
      category: '',
      price: '',
      stock: '',
      ratings: '4.5',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setForm({
      title: p.title,
      description: p.description,
      image: p.image,
      category: p.category,
      price: p.price.toString(),
      stock: p.stock.toString(),
      ratings: (p.ratings || 0).toString(),
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.image || !form.category || !form.price || !form.stock) {
      addToast('Please fill all required fields', 'warning');
      return;
    }

    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, form);
        addToast('Product updated successfully!', 'success');
      } else {
        await API.post('/products', form);
        addToast('Product created successfully!', 'success');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleDelete = async (productId, title) => {
    if (window.confirm(`Are you sure you want to delete ${title}?`)) {
      try {
        await API.delete(`/products/${productId}`);
        addToast('Product removed successfully', 'success');
        fetchProducts();
      } catch (err) {
        console.error(err);
        addToast('Failed to delete product', 'error');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Manage Products</h1>
          <p className="text-slate-500 text-sm mt-1">Add, update, or remove products from the catalog catalog.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-primary-100 font-bold"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <Loader2 className="animate-spin text-primary-600 mb-4" size={36} />
          <span className="font-semibold text-sm">Loading product catalog...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 font-medium">
          No products found. Click "Add Product" to create your first listing.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Product Info</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Ratings</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <span className="font-bold text-slate-800 line-clamp-1 max-w-[200px]" title={p.title}>
                        {p.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">{p.category}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">${(p.price || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {p.stock === 0 ? (
                        <span className="text-rose-500 font-bold">Out of stock</span>
                      ) : p.stock < 5 ? (
                        <span className="text-amber-500 font-bold">{p.stock} left</span>
                      ) : (
                        <span className="text-emerald-500">{p.stock} units</span>
                      )}
                    </td>
                    <td className="px-6 py-4">⭐ {(p.ratings || 0).toFixed(1)}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id, p.title)}
                        className="p-1.5 rounded-lg border border-rose-100 hover:bg-rose-50 text-rose-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="font-black text-slate-800 text-base font-bold">
                {editingProduct ? 'Edit Product details' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-grow text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-2 font-bold">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Wireless Noise Cancelling Headphones"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors text-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-2 font-bold">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    required
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Electronics"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors text-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-2 font-bold">
                    Image URL *
                  </label>
                  <input
                    type="text"
                    name="image"
                    required
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors text-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-2 font-bold">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    required
                    value={form.price}
                    onChange={handleChange}
                    placeholder="99.99"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors text-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-2 font-bold">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    required
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="50"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors text-slate-800 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-2 font-bold">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Provide comprehensive details about the product's features..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors text-slate-800 font-semibold"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition-colors font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors font-bold"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
