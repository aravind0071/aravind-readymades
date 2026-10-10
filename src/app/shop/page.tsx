'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/common/ProductCard';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/data/initial-data';
import { DEFAULT_STORE_SETTINGS } from '@/lib/constants/store-defaults';
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('cat') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSort, setSelectedSort] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('all');

  useEffect(() => {
    if (initialQuery) setSearchQuery(initialQuery);
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialQuery, initialCategory]);

  const allSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    INITIAL_PRODUCTS.forEach((p) => p.sizes.forEach((s) => sizeSet.add(s)));
    return Array.from(sizeSet);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...INITIAL_PRODUCTS].filter((p) => p.published);

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
    } else if (selectedSort === 'popular') {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [selectedCategory, selectedSize, inStockOnly, searchQuery, selectedSort]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSize('all');
    setInStockOnly(false);
    setSelectedSort('newest');
  };

  return (
    <div className="py-12 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb */}
        <div className="mb-8 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[#881326]">
            Complete Catalogue
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-[#121417] tracking-tight">
            ALL COLLECTIONS
          </h1>
          <p className="text-sm text-gray-600">
            Browse our full range of readymade apparel for Men, Women, and Kids.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#FFFFFF] p-4 sm:p-6 rounded-xl border border-[#E8E3D9] shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products, codes, colors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#881326]"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#881326] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {INITIAL_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    selectedCategory === c.slug
                      ? 'bg-[#881326] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <SlidersHorizontal className="w-4 h-4 text-gray-500 hidden sm:inline" />
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as any)}
                className="text-xs py-2 px-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#881326] text-gray-700 font-medium"
              >
                <option value="newest">Sort: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Popular / Featured</option>
              </select>
            </div>
          </div>

          {/* Secondary Filters (Sizes & In-Stock) */}
          <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-500 font-medium">Filter Size:</span>
              <button
                onClick={() => setSelectedSize('all')}
                className={`px-2 py-1 rounded border text-[11px] ${
                  selectedSize === 'all'
                    ? 'border-[#881326] bg-[#881326] text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              {allSizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-2 py-1 rounded border text-[11px] font-medium ${
                    selectedSize === sz
                      ? 'border-[#881326] bg-[#881326] text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#881326] focus:ring-[#881326]"
                />
                <span className="text-gray-700 font-medium">In-Stock Only</span>
              </label>

              {(searchQuery || selectedCategory !== 'all' || selectedSize !== 'all' || inStockOnly) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[#881326] hover:underline font-semibold"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center text-xs text-gray-500 font-medium">
          <span>Showing {filteredProducts.length} items</span>
          <span>Malikipuram In-Store Availability</span>
        </div>

        {/* Product Grid or Empty State */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                whatsappNumber={DEFAULT_STORE_SETTINGS.whatsapp_number}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-xl border border-[#E8E3D9] max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#121417]">No products found</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              &quot;No products found. Try another search or explore our collections.&quot;
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 bg-[#881326] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow hover:bg-[#6E0E1E] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
