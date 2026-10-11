'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/common/ProductCard';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/data/initial-data';
import { DEFAULT_STORE_SETTINGS } from '@/lib/constants/store-defaults';
import {
  Search,
  Sparkles,
  MapPin,
  CheckCircle2,
  X,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('cat') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSort, setSelectedSort] = useState<'curated' | 'newest' | 'price-asc' | 'price-desc'>('curated');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedPricePreset, setSelectedPricePreset] = useState<'all' | 'under500' | '500-1000' | 'above1000'>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [productsList, setProductsList] = useState(INITIAL_PRODUCTS);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aravind_store_products');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProductsList(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const allSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    productsList.forEach((p) => p.sizes.forEach((s) => sizeSet.add(s)));
    return Array.from(sizeSet);
  }, [productsList]);

  const filteredProducts = useMemo(() => {
    let result = [...productsList].filter((p) => p.published);

    // Category Filter
    if (selectedCategory !== 'all') {
      const cat = INITIAL_CATEGORIES.find((c) => c.slug === selectedCategory);
      if (cat) {
        result = result.filter((p) => p.category_id === cat.id);
      }
    }

    // Size Filter
    if (selectedSize !== 'all') {
      result = result.filter((p) => p.sizes.includes(selectedSize));
    }

    // In-Stock Filter
    if (inStockOnly) {
      result = result.filter((p) => p.stock_status !== 'out_of_stock');
    }

    // Price Preset Filter
    if (selectedPricePreset === 'under500') {
      result = result.filter((p) => (p.discount_price ?? p.price) <= 500);
    } else if (selectedPricePreset === '500-1000') {
      result = result.filter(
        (p) => (p.discount_price ?? p.price) > 500 && (p.discount_price ?? p.price) <= 1000
      );
    } else if (selectedPricePreset === 'above1000') {
      result = result.filter((p) => (p.discount_price ?? p.price) > 1000);
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.product_code.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.colours.some((c) => c.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (selectedSort === 'price-asc') {
      result.sort((a, b) => (a.discount_price ?? a.price) - (b.discount_price ?? b.price));
    } else if (selectedSort === 'price-desc') {
      result.sort((a, b) => (b.discount_price ?? b.price) - (a.discount_price ?? a.price));
    } else if (selectedSort === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      // Curated / Featured First
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [productsList, selectedCategory, selectedSize, inStockOnly, selectedPricePreset, searchQuery, selectedSort]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSize('all');
    setInStockOnly(false);
    setSelectedPricePreset('all');
    setSelectedSort('curated');
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedCategory !== 'all' ||
    selectedSize !== 'all' ||
    inStockOnly ||
    selectedPricePreset !== 'all';

  return (
    <div className="py-8 sm:py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. Luxury Editorial Header Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#181A1E] via-[#2A1519] to-[#181A1E] text-white p-8 sm:p-14 border border-[#3E272B] shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#881326]/60 border border-[#C5A059]/40 px-3.5 py-1 rounded-full text-xs font-semibold text-[#DFBA73] backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>ARAVIND READYMADES • MALIKIPURAM RETAIL HOUSE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#FDFBF7] leading-tight">
              CURATED READY-TO-WEAR
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#DFBA73] via-[#C5A059] to-[#FDFBF7]">
                COLLECTION
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
              Discover handpicked, pre-tested apparel for Ladies, Gents, and Kids. Pure combed cottons, tailored fits, celebration wear, and everyday essentials available directly in our physical store.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-stone-300">
              <span className="inline-flex items-center gap-1.5 text-[#DFBA73]">
                <MapPin className="w-3.5 h-3.5" />
                Main Road, Opposite L.S. Landmark, Malikipuram
              </span>
              <span className="text-stone-500">•</span>
              <span className="inline-flex items-center gap-1.5 text-stone-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Physical Store Trials &amp; WhatsApp Reservation
              </span>
            </div>
          </div>
        </div>

        {/* 2. Luxury Category Selection Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E3D9] pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                selectedCategory === 'all'
                  ? 'bg-[#881326] text-white shadow-md scale-105 border border-[#881326]'
                  : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400 hover:bg-stone-50'
              }`}
            >
              All Creations ({productsList.length})
            </button>

            {INITIAL_CATEGORIES.map((cat) => {
              const count = productsList.filter((p) => p.category_id === cat.id).length;
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                    isSelected
                      ? 'bg-[#881326] text-white shadow-md scale-105 border border-[#881326]'
                      : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400 hover:bg-stone-50'
                  }`}
                >
                  <span>{cat.name}&apos;s Wear</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white font-black' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-stone-500 font-semibold tracking-wide">
            Showing <strong className="text-stone-900">{filteredProducts.length}</strong> distinctive styles
          </div>
        </div>

        {/* 3. Refined Horizontal Filter Bar (Clean Boutique Experience) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E3D9] shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search collection, product code (e.g. AR-M104), or color..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#881326] focus:border-transparent text-stone-800 placeholder-stone-400 transition-all"
              />
            </div>

            {/* Filter Controls Cluster */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Price Preset Filter */}
              <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-stone-200 text-xs font-semibold">
                <span className="text-[11px] text-stone-400 pl-2 pr-1 font-bold">Price:</span>
                {[
                  { label: 'All', val: 'all' },
                  { label: '< ₹500', val: 'under500' },
                  { label: '₹500-₹1k', val: '500-1000' },
                  { label: '> ₹1k', val: 'above1000' },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setSelectedPricePreset(preset.val as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedPricePreset === preset.val
                        ? 'bg-[#881326] text-white shadow-sm'
                        : 'text-stone-600 hover:text-black hover:bg-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Size Dropdown Selector */}
              <div className="relative">
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="text-xs py-2 px-3 bg-[#FAF8F5] border border-stone-200 rounded-xl font-bold text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#881326] cursor-pointer"
                >
                  <option value="all">Size: All Available</option>
                  {allSizes.map((sz) => (
                    <option key={sz} value={sz}>
                      Size: {sz}
                    </option>
                  ))}
                </select>
              </div>

              {/* In-Stock Toggle Switch */}
              <label className="flex items-center gap-2 px-3 py-2 bg-[#FAF8F5] border border-stone-200 rounded-xl cursor-pointer select-none hover:bg-stone-50 transition-colors">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#881326] focus:ring-[#881326]"
                />
                <span className="text-xs font-bold text-stone-700">In-Stock Only</span>
              </label>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value as any)}
                  className="text-xs py-2 px-3 bg-[#FAF8F5] border border-stone-200 rounded-xl font-bold text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#881326] cursor-pointer"
                >
                  <option value="curated">Sort: Boutique Curated</option>
                  <option value="newest">Sort: What&apos;s New</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-stone-400 font-semibold text-[11px] uppercase tracking-wider">
                  Active Filters:
                </span>

                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#881326]/10 text-[#881326] border border-[#881326]/20 rounded-lg font-bold text-xs">
                    <span>Category: {selectedCategory}</span>
                    <button onClick={() => setSelectedCategory('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedPricePreset !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#881326]/10 text-[#881326] border border-[#881326]/20 rounded-lg font-bold text-xs">
                    <span>Price Preset</span>
                    <button onClick={() => setSelectedPricePreset('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedSize !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#881326]/10 text-[#881326] border border-[#881326]/20 rounded-lg font-bold text-xs">
                    <span>Size: {selectedSize}</span>
                    <button onClick={() => setSelectedSize('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {inStockOnly && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-bold text-xs">
                    <span>In-Stock Only</span>
                    <button onClick={() => setInStockOnly(false)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 text-stone-800 border border-stone-300 rounded-lg font-bold text-xs">
                    <span>&ldquo;{searchQuery}&rdquo;</span>
                    <button onClick={() => setSearchQuery('')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-[#881326] hover:text-[#6E0E1E] font-bold text-xs hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* 4. Full-Width Luxurious Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-7">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                whatsappNumber={DEFAULT_STORE_SETTINGS.whatsapp_number}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 px-6 bg-white rounded-3xl border border-stone-200 max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-stone-900 tracking-tight">
              No Matching Styles Found
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
              We couldn&apos;t find items matching your current filters. Try resetting the filters to explore our full physical store inventory.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 bg-[#881326] hover:bg-[#6E0E1E] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Explore All Styles</span>
            </button>
          </div>
        )}

        {/* 5. Physical Store Guarantee Footer Banner */}
        <div className="mt-12 bg-white rounded-2xl border border-[#E8E3D9] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-[#881326] text-[#C5A059] flex items-center justify-center font-bold text-xl border border-[#C5A059] shrink-0">
              A
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">
                Can&apos;t find what you are looking for online?
              </h4>
              <p className="text-xs text-stone-500">
                Our Malikipuram physical store receives fresh readymade shipments weekly. Contact our store team for personalized styling.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/91${DEFAULT_STORE_SETTINGS.whatsapp_number}?text=Hello%20Aravind%20Readymades%2C%20I%20am%20looking%20for%20a%20specific%20product%20in%20your%20store.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#881326] hover:bg-[#6E0E1E] text-white px-5 py-3 rounded-xl text-xs font-bold shadow transition-all hover:scale-105 shrink-0"
          >
            <span>Ask Store Stylist on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs font-bold text-stone-500">
          Loading curated collections...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
