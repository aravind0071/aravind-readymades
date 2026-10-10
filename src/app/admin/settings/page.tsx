'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import { getStoreSettings, updateStoreSettings } from '@/lib/data/store-service';
import { StoreSettings } from '@/lib/supabase/types';
import { Save, Check, MapPin, Phone, MessageSquare, Clock, Building, ShieldAlert } from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const isAuthed = localStorage.getItem('aravind_admin_session');
    if (!isAuthed) {
      router.push('/admin/login');
      return;
    }

    async function loadData() {
      setIsLoading(true);
      const data = await getStoreSettings();
      setSettings(data);
      setIsLoading(false);
    }
    loadData();
  }, [router]);

  function showToast(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    await updateStoreSettings(settings);
    setIsSaving(false);
    showToast('Store settings updated successfully!');
  }

  if (isLoading || !settings) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col lg:flex-row">
        <AdminNav />
        <div className="flex-1 p-10 text-center text-stone-500">
          Loading store settings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col lg:flex-row text-[#121417]">
      <AdminNav />

      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-[#121417] text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 border border-[#C5A059]/40 animate-fade-in text-sm font-medium">
          <Check className="w-4 h-4 text-[#C5A059]" />
          <span>{notification}</span>
        </div>
      )}

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-[#881326] font-bold">
            Configuration & Identity
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#121417] mt-1">
            Store Settings
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Manage your physical store business details, contact numbers, hours, and location links shown across the website.
          </p>
        </div>

        {/* Business Rule Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-bold">Strict Store Identity Rule:</span> ARAVIND READYMADES specializes exclusively in Readymade Ladies Wear (Kurtis, Tops, Dresses), Gents Wear (Shirts, Trousers, Jeans), and Kids Wear. <strong>We do not sell sarees.</strong> Ensure all customer communication preserves this accuracy.
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Identity & Branding */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
              <Building className="w-4 h-4 text-[#881326]" />
              <h2 className="font-serif font-bold text-base text-stone-900">
                Store Identity &amp; Slogans
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Store Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={settings.shop_name}
                  onChange={(e) => setSettings({ ...settings, shop_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#881326]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Sub-tagline (Department Specialization)
                </label>
                <input
                  type="text"
                  required
                  value={settings.subtagline}
                  onChange={(e) => setSettings({ ...settings, subtagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#881326]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#881326]"
                />
              </div>
            </div>
          </div>

          {/* Contact & WhatsApp */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
              <Phone className="w-4 h-4 text-[#881326]" />
              <h2 className="font-serif font-bold text-base text-stone-900">
                Contact Numbers &amp; WhatsApp
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Primary Phone *
                </label>
                <input
                  type="text"
                  required
                  value={settings.phone_primary}
                  onChange={(e) => setSettings({ ...settings, phone_primary: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#881326]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Secondary Phone
                </label>
                <input
                  type="text"
                  value={settings.phone_secondary}
                  onChange={(e) => setSettings({ ...settings, phone_secondary: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#881326]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  WhatsApp Number *
                </label>
                <input
                  type="text"
                  required
                  value={settings.whatsapp_number}
                  onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#881326]"
                />
                <span className="text-[10px] text-stone-500 mt-1 block">
                  Used for product enquiries and direct messaging.
                </span>
              </div>
            </div>
          </div>

          {/* Physical Location & Hours */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
              <MapPin className="w-4 h-4 text-[#881326]" />
              <h2 className="font-serif font-bold text-base text-stone-900">
                Location &amp; Showroom Timings
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Address Line (Landmark) *
                </label>
                <input
                  type="text"
                  required
                  value={settings.address_line}
                  onChange={(e) => setSettings({ ...settings, address_line: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#881326]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Town / City *
                </label>
                <input
                  type="text"
                  required
                  value={settings.city}
                  onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#881326]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Postal Code (PIN) *
                </label>
                <input
                  type="text"
                  required
                  value={settings.postal_code}
                  onChange={(e) => setSettings({ ...settings, postal_code: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#881326]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={settings.state}
                  onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#881326]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Opening Hours *
                </label>
                <input
                  type="text"
                  required
                  value={settings.opening_hours}
                  onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#881326]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Google Maps URL
                </label>
                <input
                  type="url"
                  required
                  value={settings.maps_url}
                  onChange={(e) => setSettings({ ...settings, maps_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#881326]"
                />
                <span className="text-[10px] text-stone-500 mt-1 block">
                  Link tapped when customers click &ldquo;Get Directions&rdquo;.
                </span>
              </div>
            </div>
          </div>

          {/* About Us Story */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
              <MessageSquare className="w-4 h-4 text-[#881326]" />
              <h2 className="font-serif font-bold text-base text-stone-900">
                Store Narrative &amp; About Text
              </h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Full About Description
              </label>
              <textarea
                rows={5}
                required
                value={settings.about_text}
                onChange={(e) => setSettings({ ...settings, about_text: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#881326] leading-relaxed"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-stone-200">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 bg-[#881326] hover:bg-[#6e0f1e] text-white px-7 py-3 rounded-xl font-medium text-sm transition-colors shadow-md disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Store Settings'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
