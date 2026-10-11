'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/common/ProductCard';
import { INITIAL_PRODUCTS } from '@/lib/data/initial-data';
import { DEFAULT_STORE_SETTINGS } from '@/lib/constants/store-defaults';
import { getWishlist } from '@/lib/utils/wishlist';

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadWishlist = () => {
    setWishlistIds(getWishlist());
    setIsLoaded(true);
  };

  useEffect(() => {
    loadWishlist();
    const handleUpdate = () => loadWishlist();
    window.addEventListener('wishlist-updated', handleUpdate);
    return () => window.removeEventListener('wishlist-updated', handleUpdate);
  }, []);

  const wishlistedProducts = INITIAL_PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="py-10 sm:py-16 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[#E8E2D7] pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C5A059]">Curated Wardrobe</span>
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#121417] tracking-tight flex items-center gap-2.5">
                <Heart className="w-6 h-6 fill-[#881326] text-[#881326]" />
                My Wishlist
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#881326]/10 text-[#881326]">
                {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#881326] hover:text-[#5E0D1B] transition-colors bg-white px-4 py-2 rounded-full border border-[#E8E2D7] shadow-sm hover:shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Wishlist Grid or Empty State */}
        {isLoaded && wishlistedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {wishlistedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                whatsappNumber={DEFAULT_STORE_SETTINGS.whatsapp_number}
              />
            ))}
          </div>
        ) : isLoaded ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#E8E2D7] max-w-lg mx-auto p-10 shadow-sm space-y-5">
            <div className="w-20 h-20 rounded-full bg-[#881326]/10 flex items-center justify-center mx-auto text-[#881326]">
              <Heart className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-serif font-black text-[#121417] tracking-tight">YOUR WISHLIST IS EMPTY</h2>
              <p className="text-xs text-[#6B7280] leading-relaxed max-w-sm mx-auto">
                Explore our curated readymade collections for Men, Women, and Kids and save your favorite garments here for easy ordering and WhatsApp consultation.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#881326] hover:bg-[#6E0F1E] text-white px-8 py-3.5 rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all active:scale-95 uppercase tracking-wider"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Collections</span>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
