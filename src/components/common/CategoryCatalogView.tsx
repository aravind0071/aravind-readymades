'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Sparkles, Info } from 'lucide-react';
import ProductCard from '@/components/common/ProductCard';
import { Product, Subcategory } from '@/lib/supabase/types';

interface SubcategoryItem {
  id?: string;
  name: string;
  slug: string;
}

interface CategoryCatalogViewProps {
  categoryTitle: string;
  categorySubtitle: string;
  categoryDescription: string;
  bannerImage: string;
  allLabel: string;
  subcategories: SubcategoryItem[];
  products: Product[];
  whatsappNumber: string;
  noticeText?: string;
}

export default function CategoryCatalogView({
  categoryTitle,
  categorySubtitle,
  categoryDescription,
  bannerImage,
  allLabel,
  subcategories,
  products,
  whatsappNumber,
  noticeText,
}: CategoryCatalogViewProps) {
  const [selectedSubcategorySlug, setSelectedSubcategorySlug] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    if (selectedSubcategorySlug === 'all') {
      return products;
    }
    return products.filter((p) => {
      if (p.subcategory?.slug === selectedSubcategorySlug) return true;
      if (p.subcategory_id === selectedSubcategorySlug) return true;
      // Fallback matching by name or slug
      const matchedSub = subcategories.find((s) => s.slug === selectedSubcategorySlug);
      if (matchedSub && matchedSub.id && p.subcategory_id === matchedSub.id) return true;
      return false;
    });
  }, [products, selectedSubcategorySlug, subcategories]);

  return (
    <div className="py-8 sm:py-12 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Category Header Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-[#121417] text-white p-8 sm:p-12 min-h-[240px] flex flex-col justify-end shadow-md">
          <Image
            src={bannerImage}
            alt={categoryTitle}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top filter brightness-[0.45]"
          />
          <div className="relative z-10 max-w-xl space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest uppercase text-[#C5A059]">
              <Sparkles className="w-3.5 h-3.5" />
              {categorySubtitle}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{categoryTitle}</h1>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">{categoryDescription}</p>
          </div>
        </div>

        {/* Optional Category Notice Strip */}
        {noticeText && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs text-amber-900 font-semibold shadow-sm">
            <Info className="w-4 h-4 shrink-0 text-amber-700" />
            <span>{noticeText}</span>
          </div>
        )}

        {/* Interactive Subcategory Filter Pills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-gray-700 uppercase tracking-wider">
              Filter by Collection:
            </span>
            <span className="text-gray-500 font-semibold">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedSubcategorySlug('all')}
              className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                selectedSubcategorySlug === 'all'
                  ? 'bg-[#881326] text-white border-[#881326] shadow-md scale-105'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {allLabel} ({products.length})
            </button>

            {subcategories.map((sub) => {
              const count = products.filter(
                (p) =>
                  p.subcategory?.slug === sub.slug ||
                  p.subcategory_id === sub.slug ||
                  (sub.id && p.subcategory_id === sub.id)
              ).length;
              const isSelected = selectedSubcategorySlug === sub.slug;

              return (
                <button
                  key={sub.slug}
                  type="button"
                  onClick={() => setSelectedSubcategorySlug(sub.slug)}
                  className={`px-4 py-2 text-xs font-bold rounded-full border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#881326] text-white border-[#881326] shadow-md scale-105'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span>{sub.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 space-y-3 shadow-sm">
            <h3 className="text-base font-bold text-gray-800">No items currently in this section</h3>
            <p className="text-xs text-gray-500">
              Try selecting &quot;{allLabel}&quot; or checking another category.
            </p>
            <button
              onClick={() => setSelectedSubcategorySlug('all')}
              className="px-4 py-2 bg-[#881326] text-white rounded-lg text-xs font-bold"
            >
              View All Items
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
