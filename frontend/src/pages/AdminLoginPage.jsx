import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminLogin } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const res = await adminLogin(form);
      login(res.data.token, res.data.admin);
      toast.success(`Welcome, ${res.data.admin.name}!`);
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 hero-grid-bg" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center font-display font-black text-navy-900 text-2xl mx-auto mb-4 shadow-lg shadow-gold-500/30">NPR</div>
          <h1 className="font-display font-black text-3xl text-white">Admin Panel</h1>
          <p className="text-white/50 text-sm mt-1">INCOCOM 2K26 Conference Management</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
                placeholder="admin@nprcet.edu.in" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-1.5">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 pr-12"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">{show ? '🙈' : '👁️'}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3.5 text-base disabled:opacity-60">
              {loading ? 'Signing in...' : '🔐 Sign In to Admin Panel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
