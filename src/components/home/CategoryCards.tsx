import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/lib/supabase/types';

interface CategoryCardsProps {
  categories: Category[];
}

export default function CategoryCards({ categories }: CategoryCardsProps) {
  return (
    <section className="py-20 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[#881326]">
            Carefully Curated Collections
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121417] tracking-tight">
            SHOP BY CATEGORY
          </h2>
          <p className="text-sm text-gray-600">
            Discover quality readymades tailored for the whole family. Guaranteed comfort, modern silhouettes, and fair pricing.
          </p>
        </div>

        {/* 3 Large Visual Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group relative bg-[#121417] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-end aspect-[3/4]"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={cat.image_url}
                  alt={`${cat.name} Collection at Aravind Readymades`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121417] via-[#121417]/40 to-transparent opacity-90 group-hover:opacity-85 transition-opacity" />
              </div>

              {/* Card Content Overlay */}
              <div className="relative z-10 p-6 sm:p-8 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#C5A059] block">
                  Category
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                  {cat.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="pt-2">
                  <Link
                    href={`/${cat.slug}`}
                    className="inline-flex items-center gap-2 bg-[#FDFBF7] text-[#121417] group-hover:bg-[#881326] group-hover:text-white px-4 py-2.5 rounded-md text-xs font-semibold shadow transition-all"
                  >
                    <span>Explore {cat.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] group-hover:text-white" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
