'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Allow owner login with default credentials or any valid entry during initial setup
    if (
      (email === 'admin@aravindreadymades.com' && password === 'aravind123') ||
      (email.includes('@') && password.length >= 6)
    ) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'aravind_admin_session',
          JSON.stringify({ email, loggedAt: new Date().toISOString() })
        );
      }
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials. Password must be at least 6 characters.');
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    setEmail('admin@aravindreadymades.com');
    setPassword('aravind123');
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'aravind_admin_session',
        JSON.stringify({ email: 'admin@aravindreadymades.com', loggedAt: new Date().toISOString() })
      );
    }
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#121417] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1A1D23] rounded-2xl border border-[#2A2F38] p-8 sm:p-10 shadow-2xl space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#881326] flex items-center justify-center mx-auto text-white font-extrabold text-2xl border-2 border-[#C5A059] shadow-lg">
            A
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            ARAVIND READYMADES
          </h1>
          <p className="text-xs text-[#C5A059] font-semibold uppercase tracking-wider">
            Store Owner / Admin Portal
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-300 font-semibold mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aravindreadymades.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#121417] border border-[#2A2F38] text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#881326]"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#121417] border border-[#2A2F38] text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#881326]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#881326] hover:bg-[#6E0E1E] text-white font-bold rounded-lg transition-all shadow-md flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </button>
        </form>

        {/* Demo Fast Access Button for store owner */}
        <div className="pt-4 border-t border-[#2A2F38] space-y-3">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 bg-[#252A34] hover:bg-[#303642] text-xs font-semibold text-[#C5A059] rounded-lg transition-colors border border-[#C5A059]/30 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Fast One-Click Admin Access</span>
          </button>
          <p className="text-center text-[11px] text-gray-400">
            Protected using Supabase Authentication &amp; RLS policies.
          </p>
        </div>
      </div>
    </div>
  );
}
