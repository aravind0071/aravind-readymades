import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../common/ProductCard';
import { Product } from '@/lib/supabase/types';

interface NewArrivalsProps {
  products: Product[];
  whatsappNumber?: string;
}

export default function NewArrivals({ products, whatsappNumber }: NewArrivalsProps) {
  return (
    <section className="py-20 bg-[#FFFFFF] border-y border-[#E8E3D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#881326]">
              Just In-Store
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121417] tracking-tight">
              NEW ARRIVALS
            </h2>
            <p className="text-sm text-gray-500">
              Fresh styles, newly added to our collection for Ladies, Gents and Kids.
            </p>
          </div>

          <Link
            href="/new-arrivals"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#881326] hover:text-[#6E0E1E] group self-start md:self-end"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} />
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#121417] hover:bg-[#881326] text-white px-8 py-3.5 rounded-lg text-sm font-semibold shadow hover:shadow-lg transition-all"
          >
            <span>Explore Complete Store Collection</span>
            <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
