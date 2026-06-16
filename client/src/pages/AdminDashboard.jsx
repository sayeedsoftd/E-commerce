import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { Loader2, DollarSign, Package, ShoppingBag, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        setStats(data);
      } catch (err) {
        console.error('Error fetching admin stats', err);
        addToast('Failed to fetch admin stats', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [addToast]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-48 text-slate-400">
        <Loader2 className="animate-spin text-primary-600 mb-4" size={40} />
        <span className="font-semibold text-sm">Loading administration statistics...</span>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats?.totalRevenue ? stats.totalRevenue.toFixed(2) : '0.00'}`,
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'bg-primary-50 text-primary-600 border-primary-100',
      link: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      link: '/admin/orders',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      link: '/admin/users',
    },
  ];

  const COLORS = ['#3b66ff', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Review operational aggregates, product inventory, and sales performance.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/products" className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors">
            Manage Products
          </Link>
          <Link to="/admin/orders" className="bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 text-xs px-4 py-2.5 rounded-xl transition-colors">
            Manage Orders
          </Link>
          <Link to="/admin/users" className="bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 text-xs px-4 py-2.5 rounded-xl transition-colors">
            Manage Users
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          const CardContent = (
            <div className={`bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-md transition-all flex items-center justify-between h-full ${card.link ? 'cursor-pointer' : ''}`}>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-bold">{card.title}</span>
                <p className="text-2xl font-black text-slate-900 mt-2 font-bold">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${card.color}`}>
                <Icon size={22} />
              </div>
            </div>
          );

          return card.link ? (
            <Link key={idx} to={card.link}>
              {CardContent}
            </Link>
          ) : (
            <div key={idx}>{CardContent}</div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 lg:col-span-2">
          <h3 className="font-extrabold text-slate-800 text-base mb-6 font-bold">Revenue Analytics (Last 6 Months)</h3>
          <div className="h-[300px]">
            {stats?.chartData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b66ff" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b66ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b66ff" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
                No revenue logs yet to generate trends.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col">
          <h3 className="font-extrabold text-slate-800 text-base mb-6 font-bold">Sales Share by Category</h3>
          <div className="h-[220px] relative flex-grow">
            {stats?.categorySales?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categorySales}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stats.categorySales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
                No item sales logs yet.
              </div>
            )}
          </div>
          {stats?.categorySales?.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-[10px] font-bold text-slate-500">
              {stats.categorySales.map((item, index) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span className="truncate max-w-[90px]">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
