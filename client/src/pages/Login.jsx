import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Loader2, KeyRound, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill all fields', 'warning');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      addToast('Logged in successfully!', 'success');
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      addToast(error.response?.data?.message || 'Login failed, please check credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <span className="text-4xl">🛍️</span>
          <h2 className="text-2xl font-black text-slate-800 mt-4">Welcome Back</h2>
          <p className="text-slate-500 text-sm mt-1">Please sign in to continue shopping</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors"
              />
              <Mail className="absolute left-3.5 top-3 text-slate-400" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors"
              />
              <KeyRound className="absolute left-3.5 top-3 text-slate-400" size={16} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-primary-100 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-slate-100 text-sm">
          <span className="text-slate-500">Don't have an account? </span>
          <Link to="/register" className="font-bold text-primary-600 hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
