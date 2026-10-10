import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tag, ArrowRight } from 'lucide-react';
import { Offer } from '@/lib/supabase/types';

interface OffersBannerProps {
  offers: Offer[];
}

export default function OffersBanner({ offers }: OffersBannerProps) {
  if (!offers || offers.length === 0) return null;
  const activeOffer = offers[0];

  return (
    <section className="py-14 bg-gradient-to-r from-[#881326] via-[#6E0E1E] to-[#881326] text-white relative overflow-hidden">
      {/* Decorative background overlay */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <Image
          src={activeOffer.banner_image_url || '/images/store/store_counter_display.jpg'}
          alt="Aravind Readymades Offers"
          fill
          className="object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-[#C5A059] text-xs font-bold tracking-wider uppercase border border-[#C5A059]/30">
              <Tag className="w-3.5 h-3.5" />
              <span>{activeOffer.badge_label || 'Special In-Store Offer'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              STYLE MORE. SAVE MORE.
            </h3>
            <p className="text-sm text-gray-200 max-w-xl">
              {activeOffer.subtitle || 'Explore our latest offers and selected collections available exclusively at our physical store.'}
            </p>
          </div>

          <Link
            href="/offers"
            className="shrink-0 inline-flex items-center gap-2 bg-[#FDFBF7] hover:bg-[#C5A059] text-[#121417] hover:text-[#121417] px-6 py-3.5 rounded-lg text-sm font-bold shadow-lg transition-all hover:scale-105"
          >
            <span>View Offers</span>
            <ArrowRight className="w-4 h-4 text-[#881326]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
