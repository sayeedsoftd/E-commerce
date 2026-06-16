import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Loader2, KeyRound, Mail, User as UserIcon, ShieldAlert } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      addToast('Please fill all fields', 'warning');
      return;
    }
    if (password.length < 6) {
      addToast('Password must be at least 6 characters', 'warning');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, role);
      addToast('Account created successfully!', 'success');
      navigate('/');
    } catch (error) {
      console.error(error);
      addToast(error.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <span className="text-4xl">🛍️</span>
          <h2 className="text-2xl font-black text-slate-800 mt-4">Create Account</h2>
          <p className="text-slate-500 text-sm mt-1">Get started with your premium account today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors"
              />
              <UserIcon className="absolute left-3.5 top-3 text-slate-400" size={16} />
            </div>
          </div>

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
                placeholder="Min 6 characters"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors"
              />
              <KeyRound className="absolute left-3.5 top-3 text-slate-400" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Role (For Testing convenience)
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors bg-white appearance-none"
              >
                <option value="user">User (Customer)</option>
                <option value="admin">Admin (Manager)</option>
              </select>
              <ShieldAlert className="absolute left-3.5 top-3 text-slate-400" size={16} />
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
              'Create Account'
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-slate-100 text-sm">
          <span className="text-slate-500">Already have an account? </span>
          <Link to="/login" className="font-bold text-primary-600 hover:underline">
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
