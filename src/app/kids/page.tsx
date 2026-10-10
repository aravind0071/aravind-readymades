import React from 'react';
import Image from 'next/image';
import ProductCard from '@/components/common/ProductCard';
import { getProducts, getStoreSettings } from '@/lib/data/store-service';
import { Sparkles } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Kids' Collection | ARAVIND READYMADES Malikipuram",
  description:
    "Comfortable and stylish looks for little ones. Boys plaid shirts, girls frocks, kids denim jeans, and playful tees at Aravind Readymades, Malikipuram.",
};

export default async function KidsPage() {
  const [products, settings] = await Promise.all([
    getProducts({ categorySlug: 'kids' }),
    getStoreSettings(),
  ]);

  return (
    <div className="py-12 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Header Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-12 bg-[#121417] text-white p-8 sm:p-12 min-h-[260px] flex flex-col justify-end">
          <Image
            src="/images/categories/kids_category.jpg"
            alt="Kids Readymade Collection Banner"
            fill
            priority
            className="object-cover object-top filter brightness-50"
          />
          <div className="relative z-10 max-w-xl space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-[#C5A059]">
              <Sparkles className="w-3.5 h-3.5" />
              Kids&apos; Collection
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              KIDS READYMADES
            </h1>
            <p className="text-sm text-gray-200 leading-relaxed">
              Comfortable, cheerful &amp; durable looks for boys and girls. Soft cotton fabrics, flexible denims, and celebration party wear.
            </p>
          </div>
        </div>

        {/* Subcategory Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All Kids', 'Boys Wear', 'Girls Frocks & Dresses', 'Kids Denim', 'Casual Sets', 'Party Outfits'].map(
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
