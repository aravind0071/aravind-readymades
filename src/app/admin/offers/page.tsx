'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import { getAllOffers, createOffer, updateOffer, deleteOffer } from '@/lib/data/store-service';
import { Offer } from '@/lib/supabase/types';
import { Tag, Plus, Check, Trash2, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function AdminOffersPage() {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New offer form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [discountText, setDiscountText] = useState('');
  const [badgeLabel, setBadgeLabel] = useState('SPECIAL OFFER');
  const [bannerImageUrl, setBannerImageUrl] = useState('/images/store/storefront_hero.jpg');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const isAuthed = localStorage.getItem('aravind_admin_session');
    if (!isAuthed) {
      router.push('/admin/login');
      return;
    }
    loadOffers();
  }, [router]);

  async function loadOffers() {
    setIsLoading(true);
    const data = await getAllOffers();
    setOffers([...data]);
    setIsLoading(false);
  }

  function showToast(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  }

  async function handleToggleStatus(offer: Offer) {
    const updated = await updateOffer(offer.id, { is_active: !offer.is_active });
    if (updated) {
      setOffers((prev) =>
        prev.map((o) => (o.id === offer.id ? { ...o, is_active: !o.is_active } : o))
      );
      showToast(`Offer "${offer.title}" is now ${!offer.is_active ? 'Active' : 'Inactive'}`);
    }
  }

  async function handleDelete(id: string, offerTitle: string) {
    if (!confirm(`Are you sure you want to remove the offer banner "${offerTitle}"?`)) return;
    const ok = await deleteOffer(id);
    if (ok) {
      setOffers((prev) => prev.filter((o) => o.id !== id));
      showToast(`Offer banner "${offerTitle}" removed`);
    }
  }

  async function handleCreateOffer(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    await createOffer({
      title: title.trim(),
      subtitle: subtitle.trim(),
      discount_text: discountText.trim(),
      badge_label: badgeLabel.trim() || 'PROMOTION',
      banner_image_url: bannerImageUrl || '/images/store/storefront_hero.jpg',
      is_active: isActive,
    });

    setTitle('');
    setSubtitle('');
    setDiscountText('');
    setBadgeLabel('SPECIAL OFFER');
    setShowAddModal(false);
    showToast('Promotional offer created successfully!');
    await loadOffers();
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#881326] font-bold">
              Marketing & Promotions
            </span>
            <h1 className="text-3xl font-serif font-bold text-[#121417] mt-1">
              Store Offers & Banners
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Active promotional banners display prominently across the homepage header ribbon and offers page.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-[#881326] hover:bg-[#6e0f1e] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Promotional Offer
          </button>
        </div>

        {/* Informational Policy Banner */}
        <div className="bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl p-4 mb-8 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
          <div className="text-xs text-stone-700 leading-relaxed">
            <span className="font-semibold text-stone-900">Store Promotional Policy:</span> Offers apply to Ready-Made Men&apos;s Wear, Women&apos;s Kurti &amp; Western Wear, and Kids&apos; Collections in Malikipuram. Ensure clear festival terms (e.g. Sankranti, Diwali, Weddings) without misleading claims.
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-stone-500">Loading offers...</div>
        ) : offers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-[#E8E2D8] p-8">
            <Tag className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-stone-800">No active promotions</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-5">
              Create an offer ribbon or seasonal discount banner to announce festive collections.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-[#881326] text-white px-4 py-2 rounded-lg text-xs font-medium"
            >
              <Plus className="w-4 h-4" /> Create Offer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className={`bg-white rounded-xl border overflow-hidden transition-all shadow-sm flex flex-col justify-between ${
                  offer.is_active ? 'border-[#C5A059]/40 ring-1 ring-[#C5A059]/20' : 'border-stone-200 opacity-70'
                }`}
              >
                <div>
                  <div className="relative h-44 w-full bg-stone-900">
                    <Image
                      src={offer.banner_image_url || '/images/store/storefront_hero.jpg'}
                      alt={offer.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#881326] text-white text-[11px] font-bold px-2.5 py-1 rounded tracking-wider uppercase shadow-md">
                        {offer.badge_label}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded shadow-md ${
                          offer.is_active ? 'bg-emerald-600 text-white' : 'bg-stone-700 text-stone-300'
                        }`}
                      >
                        {offer.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wider block">
                        {offer.discount_text}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-white line-clamp-1">
                        {offer.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      {offer.subtitle || 'General in-store festive discount across select ready-made collections.'}
                    </p>

                    <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded border border-stone-100 flex items-center justify-between">
                      <span>Store Location Applicable:</span>
                      <strong className="text-stone-800">Malikipuram Showroom</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleStatus(offer)}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded transition-colors ${
                      offer.is_active
                        ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    {offer.is_active ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" /> Deactivate
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" /> Activate
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(offer.id, offer.title)}
                    className="inline-flex items-center gap-1 text-xs text-rose-700 hover:text-rose-900 font-medium px-2.5 py-1.5 hover:bg-rose-50 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Add Offer */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-fade-in max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
                <h3 className="font-serif text-xl font-bold text-[#121417]">
                  New Store Offer Banner
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-stone-400 hover:text-stone-700 text-sm font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateOffer} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Offer Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Festive Ready-Made Collection Special"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#881326]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Discount Headline / Tagline
                  </label>
                  <input
                    type="text"
                    value={discountText}
                    onChange={(e) => setDiscountText(e.target.value)}
                    placeholder="e.g. Special Festive Savings on Selected Styles"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#881326]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={badgeLabel}
                    onChange={(e) => setBadgeLabel(e.target.value)}
                    placeholder="e.g. FESTIVE EDIT or SPECIAL VALUE"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#881326]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Description / Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Detailed terms or collection highlights for visitors in Malikipuram"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#881326]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Banner Background
                  </label>
                  <select
                    value={bannerImageUrl}
                    onChange={(e) => setBannerImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#881326]"
                  >
                    <option value="/images/store/storefront_hero.jpg">Storefront Exterior</option>
                    <option value="/images/store/store_interior_aisle.jpg">Store Interior Aisle</option>
                    <option value="/images/categories/men_category.jpg">Men&apos;s Collection Banner</option>
                    <option value="/images/categories/women_category.jpg">Women&apos;s Kurti Banner</option>
                    <option value="/images/categories/kids_category.jpg">Kids&apos; Wear Banner</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-[#881326] rounded border-stone-300 focus:ring-[#881326]"
                  />
                  <label htmlFor="isActive" className="text-sm text-stone-700 select-none">
                    Publish immediately (Show on Homepage ribbon &amp; Offers page)
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#881326] hover:bg-[#6e0f1e] text-white rounded-lg text-xs font-medium shadow-sm"
                  >
                    Save &amp; Publish Offer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
