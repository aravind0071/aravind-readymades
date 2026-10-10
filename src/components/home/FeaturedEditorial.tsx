import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FeaturedEditorial() {
  return (
    <section className="py-24 bg-[#121417] text-[#FDFBF7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C5A059]">
              <Sparkles className="w-4 h-4" />
              <span>Curated Editorial</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              FIND YOUR STYLE
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-xl">
              From everyday breathable cottons to festive party ensembles, discover curated fits crafted for comfort and longevity.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#C5A059] hover:text-white transition-colors"
          >
            <span>Browse Full Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Large Editorial Feature (7 cols) */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden min-h-[460px] bg-[#1A1D23] border border-[#2A2F38] flex flex-col justify-end p-8 group">
            <Image
              src="/images/store/store_interior_aisle.jpg"
              alt="Aravind Readymades Men Collection Aisle"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center filter brightness-75 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121417] via-[#121417]/50 to-transparent" />
            <div className="relative z-10 space-y-3 max-w-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] bg-[#121417]/80 px-2.5 py-1 rounded border border-[#C5A059]/30 inline-block">
                Men Essentials &amp; Occasion Wear
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Sharp Silhouettes, Uncompromised Comfort
              </h3>
              <p className="text-xs sm:text-sm text-gray-300">
                Explore our premium cotton shirts, tailored formal trousers, durable slim-fit jeans, and everyday knitwear.
              </p>
              <div className="pt-2">
                <Link
                  href="/men"
                  className="inline-flex items-center gap-2 bg-[#881326] hover:bg-[#6E0E1E] text-white px-5 py-2.5 rounded-md text-xs font-semibold shadow transition-all"
                >
                  <span>Explore Men Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Two Stacked Editorial Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Women's Card */}
            <div className="relative rounded-2xl overflow-hidden min-h-[220px] flex-1 bg-[#1A1D23] border border-[#2A2F38] flex flex-col justify-end p-6 group">
              <Image
                src="/images/store/store_women_section.jpg"
                alt="Women Kurtis and Western Tops Collection"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center filter brightness-75 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121417] via-[#121417]/40 to-transparent" />
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">
                  Women Wear (Strictly No Sarees)
                </span>
                <h4 className="text-lg sm:text-xl font-bold text-white">
                  Contemporary Kurtis, Tops &amp; Pants
                </h4>
                <Link
                  href="/women"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5A059] hover:underline"
                >
                  <span>View Women Styles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Kids Card */}
            <div className="relative rounded-2xl overflow-hidden min-h-[220px] flex-1 bg-[#1A1D23] border border-[#2A2F38] flex flex-col justify-end p-6 group">
              <Image
                src="/images/store/store_kids_section.jpg"
                alt="Kids Wear Collection at Aravind Readymades"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center filter brightness-75 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121417] via-[#121417]/40 to-transparent" />
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">
                  Kids Fashion
                </span>
                <h4 className="text-lg sm:text-xl font-bold text-white">
                  Joyful, Skin-Friendly Styles for Little Ones
                </h4>
                <Link
                  href="/kids"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5A059] hover:underline"
                >
                  <span>View Kids Styles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
