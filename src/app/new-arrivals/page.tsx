import React from 'react';
import ProductCard from '@/components/common/ProductCard';
import { getProducts, getStoreSettings } from '@/lib/data/store-service';
import { Sparkles } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Arrivals | ARAVIND READYMADES Malikipuram',
  description:
    'Fresh styles newly added to our in-store collection for Ladies, Gents, and Kids. Visit Aravind Readymades, Malikipuram.',
};

export default async function NewArrivalsPage() {
  const [products, settings] = await Promise.all([
    getProducts({ newArrivalsOnly: true }),
    getStoreSettings(),
  ]);

  return (
    <div className="py-12 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#881326]/10 text-[#881326] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fresh Stock</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#121417] tracking-tight">
            NEW ARRIVALS
          </h1>
          <p className="text-sm text-gray-600 max-w-xl">
            Fresh styles, newly added to our collection across Men, Women, and Kids readymade clothing.
          </p>
        </div>

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
