'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, MapPin, Navigation } from 'lucide-react';
import Lightbox from '@/components/common/Lightbox';
import { DEFAULT_STORE_SETTINGS } from '@/lib/constants/store-defaults';

interface GalleryItem {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  category: 'exterior' | 'interior' | 'collections' | 'display';
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    url: '/images/store/storefront_hero.jpg',
    title: 'Storefront Facade & LED Signboard',
    subtitle: 'Main Road entrance opposite L.S. Landmark in Malikipuram',
    category: 'exterior',
  },
  {
    id: 'g-2',
    url: '/images/store/store_interior_aisle.jpg',
    title: 'Men Apparel Aisles & Shelving',
    subtitle: 'Neatly organized display racks with casual shirts and trousers',
    category: 'interior',
  },
  {
    id: 'g-3',
    url: '/images/store/store_counter_display.jpg',
    title: 'Billing Counter & Boxed Garments',
    subtitle: 'Checkout station with branded boxed shirts and innerwear',
    category: 'display',
  },
  {
    id: 'g-4',
    url: '/images/store/store_women_section.jpg',
    title: 'Ladies Readymades Boutique Racks',
    subtitle: 'Designer cotton kurtis, western tops & pants (No Sarees)',
    category: 'collections',
  },
  {
    id: 'g-5',
    url: '/images/store/store_kids_section.jpg',
    title: 'Kids Fashion Corner',
    subtitle: 'Colorful frocks, boys button-down shirts & jeans displays',
    category: 'collections',
  },
  {
    id: 'g-6',
    url: '/images/categories/men_category.jpg',
    title: 'Men Casual Fashion Styling',
    subtitle: 'Everyday comfortable and festive attire',
    category: 'collections',
  },
  {
    id: 'g-7',
    url: '/images/categories/women_category.jpg',
    title: 'Contemporary Ladies Kurti Suit',
    subtitle: 'Pure cotton embroidered ethnic styles',
    category: 'collections',
  },
  {
    id: 'g-8',
    url: '/images/categories/kids_category.jpg',
    title: 'Kids Festive Outfits Display',
    subtitle: 'Playful and elegant looks for young children',
    category: 'collections',
  },
];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'exterior' | 'interior' | 'collections' | 'display'>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredItems =
    activeTab === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter((item) => item.category === activeTab);

  const handleOpenPhoto = (idx: number) => {
    setCurrentIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <div className="py-14 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#881326]">
            Visual Tour
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#121417] tracking-tight">
            STORE GALLERY
          </h1>
          <p className="text-sm text-gray-600">
            A photographic walk-through of Aravind Readymades: our physical storefront, retail interiors, curated displays, and family apparel collections.
          </p>
        </div>

        {/* Filter Tabs: Exterior, Interior, Collections, Display */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { id: 'all', label: 'All Photos' },
            { id: 'exterior', label: 'Store Exterior' },
            { id: 'interior', label: 'Store Interior' },
            { id: 'collections', label: 'Collections' },
            { id: 'display', label: 'Displays & Counter' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#881326] text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => handleOpenPhoto(idx)}
              className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-200 shadow-sm hover:shadow-xl cursor-pointer border border-[#E8E3D9] transition-all duration-300"
            >
              <Image
                src={item.url}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Zoom Hover Icon */}
              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-2 rounded-full text-white">
                <Eye className="w-4 h-4" />
              </div>

              {/* Caption */}
              <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-0.5">
                  {item.category}
                </span>
                <h3 className="text-sm font-bold line-clamp-1">{item.title}</h3>
                <p className="text-xs text-gray-300 line-clamp-1 mt-0.5">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Store Visit Prompt Banner */}
        <div className="bg-[#FFFFFF] p-8 rounded-2xl border border-[#E8E3D9] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-[#121417]">Experience our store in person</h4>
            <p className="text-xs text-gray-500">
              Main Road, Opposite L.S. Landmark, Malikipuram - 533253. Open daily 9:30 AM to 10:00 PM.
            </p>
          </div>
          <a
            href={DEFAULT_STORE_SETTINGS.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#881326] text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-[#6E0E1E] transition-colors"
          >
            <Navigation className="w-4 h-4 text-[#C5A059]" />
            <span>Get Directions</span>
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={filteredItems}
        currentIndex={currentIndex}
        onNavigate={(idx) => setCurrentIndex(idx)}
      />
    </div>
  );
}
