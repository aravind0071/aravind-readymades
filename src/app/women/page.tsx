import React from 'react';
import Image from 'next/image';
import ProductCard from '@/components/common/ProductCard';
import { getProducts, getStoreSettings } from '@/lib/data/store-service';
import { Sparkles, Info } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Women's Collection | ARAVIND READYMADES Malikipuram",
  description:
    "Contemporary styles for every occasion. Pure cotton designer kurtis, casual tops, western dresses, and straight pants. (We specialize in readymades - no sarees).",
};

export default async function WomenPage() {
  const [products, settings] = await Promise.all([
    getProducts({ categorySlug: 'women' }),
    getStoreSettings(),
  ]);

  return (
    <div className="py-12 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Header Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-8 bg-[#121417] text-white p-8 sm:p-12 min-h-[260px] flex flex-col justify-end">
          <Image
            src="/images/categories/women_category.jpg"
            alt="Women Readymade Collection Banner"
            fill
            priority
            className="object-cover object-top filter brightness-50"
          />
          <div className="relative z-10 max-w-xl space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-[#C5A059]">
              <Sparkles className="w-3.5 h-3.5" />
              Women&apos;s Collection
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              LADIES READYMADES
            </h1>
            <p className="text-sm text-gray-200 leading-relaxed">
              Contemporary styles for every occasion. Premium embroidered cotton kurtis, everyday casual tops, straight ankle-fit pants, and western dresses.
            </p>
          </div>
        </div>

        {/* Clear Notice Strip regarding Sarees */}
        <div className="mb-8 p-3.5 rounded-lg bg-[#881326]/10 border border-[#881326]/20 flex items-center gap-3 text-xs text-[#881326] font-medium">
          <Info className="w-4 h-4 shrink-0" />
          <span>
            Specialized Readymade Store: We focus strictly on ready-to-wear kurtis, tops, dresses, and trousers. (We do not sell sarees).
          </span>
        </div>

        {/* Subcategory Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All Women', 'Cotton Kurtis', 'Casual Tops', 'Dresses', 'Straight Pants', 'Party Wear'].map(
            (sub, i) => (
              <span
                key={sub}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border ${
                  i === 0
                    ? 'bg-[#881326] text-white border-[#881326]'
                    : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                {sub}
              </span>
            )
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              whatsappNumber={settings.whatsapp_number}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
