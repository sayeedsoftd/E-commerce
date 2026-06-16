import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { Loader2, ShieldCheck, ShieldAlert, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch user profiles list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (userId, currentRole) => {
    if (userId === currentUser._id) {
      addToast('You cannot change your own admin status!', 'warning');
      return;
    }

    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const msg = `Are you sure you want to change this user's role to ${newRole}?`;

    if (window.confirm(msg)) {
      try {
        await API.put(`/admin/users/${userId}/role`, { role: newRole });
        addToast('User role updated successfully!', 'success');
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      } catch (err) {
        console.error(err);
        addToast(err.response?.data?.message || 'Failed to update user role', 'error');
      }
    }
  };

  const handleDelete = async (userId, name) => {
    if (userId === currentUser._id) {
      addToast('You cannot delete your own account!', 'warning');
      return;
    }

    if (window.confirm(`Are you sure you want to delete the user account of ${name}?`)) {
      try {
        await API.delete(`/admin/users/${userId}`);
        addToast('User deleted successfully', 'success');
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } catch (err) {
        console.error(err);
        addToast('Failed to delete user account', 'error');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Manage Users</h1>
        <p className="text-slate-500 text-sm mt-1">Manage system user roles, promote administrators, and delete accounts.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <Loader2 className="animate-spin text-primary-600 mb-4" size={36} />
          <span className="font-semibold text-sm">Loading users directory...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 font-medium">
          No user profiles registered in the system yet.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Registration Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold uppercase">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block">
                            {u.name} {u._id === currentUser?._id && <span className="text-[9px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full ml-1.5 font-extrabold uppercase">You</span>}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleToggleRole(u._id, u.role)}
                        disabled={u._id === currentUser?._id}
                        className={`p-1.5 rounded-lg border border-slate-200 transition-colors ${
                          u._id === currentUser?._id
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:bg-slate-50 text-slate-600'
                        }`}
                        title={u.role === 'admin' ? 'Change to user' : 'Make Admin'}
                      >
                        {u.role === 'admin' ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                      </button>
                      <button
                        onClick={() => handleDelete(u._id, u.name)}
                        disabled={u._id === currentUser?._id}
                        className={`p-1.5 rounded-lg border border-rose-100 transition-colors ${
                          u._id === currentUser?._id
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:bg-rose-50 text-rose-500'
                        }`}
                        title="Delete User"
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
    </div>
  );
};

export default AdminUsers;
