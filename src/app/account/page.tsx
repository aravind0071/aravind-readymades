'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Heart,
  ShoppingBag,
  LogOut,
  ShieldAlert,
  Sparkles,
  Phone,
  MessageCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { DEFAULT_STORE_SETTINGS } from '@/lib/constants/store-defaults';

interface AuthSessionUser {
  id: string;
  email: string;
  role: 'host' | 'member';
}

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unauthorizedNotice = searchParams.get('error') === 'unauthorized_host_required';

  const [user, setUser] = useState<AuthSessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          router.replace('/login?redirect=/account');
        }
      } catch (e) {
        router.replace('/login?redirect=/account');
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-state-changed'));
      }
      router.push('/login');
    } catch (e) {
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 text-xs text-gray-500">
        Loading customer profile...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="py-10 sm:py-16 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Unauthorized Host Notice */}
        {unauthorizedNotice && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 shadow-sm">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Host Privileges Required</p>
              <p className="text-amber-700 mt-0.5">
                Your account ({user.email}) is authenticated as a <strong>Member</strong>. The Store Admin Dashboard is reserved exclusively for the authorized store host.
              </p>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-[#E8E2D7] p-6 sm:p-10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#881326] text-white flex items-center justify-center font-bold text-2xl border-2 border-[#C5A059] shadow-md">
              {user.email[0].toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider text-[10px]">
                  {user.role === 'host' ? 'Host / Owner' : 'Verified Member'}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">ID: {user.id.slice(0, 8)}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-black text-[#121417]">
                {user.email}
              </h1>
              <p className="text-xs text-gray-500">
                Aravind Readymades Malikipuram Customer Member
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 text-xs font-bold text-gray-700 transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Member Action Hub */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Wishlist Card */}
          <Link
            href="/wishlist"
            className="group bg-white rounded-3xl border border-[#E8E2D7] p-6 hover:border-[#881326] transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#881326] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Heart className="w-6 h-6 fill-[#881326]" />
              </div>
              <h3 className="text-base font-bold text-[#121417]">My Saved Wishlist</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Review your saved outfits, view live store availability, and request WhatsApp fittings.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-[#881326]">
              <span>Open Wishlist</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Shop Collections Card */}
          <Link
            href="/shop"
            className="group bg-white rounded-3xl border border-[#E8E2D7] p-6 hover:border-[#881326] transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#881326]/10 text-[#881326] flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#121417]">Explore Boutique Garments</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Discover trending Men, Women, and Kids ready-to-wear pieces with instant pickup in Malikipuram.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-[#881326]">
              <span>Browse Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>

        {/* Store Contact & Support Box */}
        <div className="bg-[#121417] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-[#2A2F38]">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest">
              Malikipuram Flagship
            </span>
            <h4 className="text-lg font-serif font-black text-white">Need Personal Tailoring or Order Support?</h4>
            <p className="text-xs text-gray-400">
              Direct store consultation available from 9:30 AM to 9:30 PM.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://wa.me/${DEFAULT_STORE_SETTINGS.whatsapp_number}?text=Hello%20Aravind%20Readymades%2C%20I%20am%20logged%20in%20as%20a%20member%20and%20need%20assistance.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow"
            >
              <MessageCircle className="w-4 h-4 fill-white text-white" />
              <span>WhatsApp Store</span>
            </a>

            <a
              href={`tel:${DEFAULT_STORE_SETTINGS.phone_primary}`}
              className="inline-flex items-center gap-2 bg-[#2A2F38] hover:bg-[#3E4552] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              <Phone className="w-4 h-4 text-[#C5A059]" />
              <span>Call Us</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-gray-500">Loading account...</div>}>
      <AccountContent />
    </Suspense>
  );
}
