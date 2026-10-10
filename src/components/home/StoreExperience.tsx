'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, Navigation, Eye, CheckCircle2 } from 'lucide-react';
import Lightbox from '../common/Lightbox';
import { DEFAULT_STORE_SETTINGS } from '@/lib/constants/store-defaults';

export default function StoreExperience() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const storePhotos = [
    {
      url: '/images/store/storefront_hero.jpg',
      title: 'Storefront Facade & Signboard',
      subtitle: 'Main Road, Opposite L.S. Landmark, Malikipuram',
      tag: 'Storefront',
    },
    {
      url: '/images/store/store_interior_aisle.jpg',
      title: 'Men Readymade Apparel Aisles',
      subtitle: 'Organized shelves with shirts, trousers & denim wear',
      tag: 'Interior',
    },
    {
      url: '/images/store/store_counter_display.jpg',
      title: 'Billing Counter & Boxed Collections',
      subtitle: 'Display shelves, innerwear boxes & customer desk',
      tag: 'Display',
    },
    {
      url: '/images/store/store_women_section.jpg',
      title: 'Women Readymade Boutique Corner',
      subtitle: 'Contemporary designer cotton kurtis, tunics & pants (No Sarees)',
      tag: 'Ladies Section',
    },
  ];

  const handleOpenPhoto = (index: number) => {
    setActivePhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="py-24 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#881326]/10 text-[#881326] text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Physical Store In Malikipuram</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#121417] tracking-tight">
            VISIT ARAVIND READYMADES
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            &quot;Explore our collections in-store and find the right fit, style and comfort for every occasion.&quot;
            Experience authentic fabric textures, try different sizes, and enjoy personalized family assistance.
          </p>
        </div>

        {/* 4 Actual Store Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {storePhotos.map((photo, idx) => (
            <div
              key={photo.title}
              onClick={() => handleOpenPhoto(idx)}
              className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-200 shadow-sm hover:shadow-xl cursor-pointer border border-[#E8E3D9] transition-all duration-300"
            >
              <Image
                src={photo.url}
                alt={photo.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Tag Pill */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-[#121417]/80 text-[#C5A059] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-[#C5A059]/30">
                  {photo.tag}
                </span>
              </div>

              {/* Zoom Hover Icon */}
              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-1.5 rounded-full text-white">
                <Eye className="w-4 h-4" />
              </div>

              {/* Caption */}
              <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                <h4 className="text-sm font-bold line-clamp-1">{photo.title}</h4>
                <p className="text-[11px] text-gray-300 line-clamp-1 mt-0.5">{photo.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* In-Store Benefits Strip & Action Buttons */}
        <div className="mt-14 p-6 sm:p-8 bg-[#FFFFFF] rounded-2xl border border-[#E8E3D9] shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#881326] shrink-0" />
              <div className="text-left">
                <h4 className="text-xs font-bold uppercase text-[#121417]">Trial &amp; Exact Fit</h4>
                <p className="text-[11px] text-gray-500">Fitting rooms available in-store</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#881326] shrink-0" />
              <div className="text-left">
                <h4 className="text-xs font-bold uppercase text-[#121417]">Instant Availability</h4>
                <p className="text-[11px] text-gray-500">Pick up your fresh outfits immediately</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#881326] shrink-0" />
              <div className="text-left">
                <h4 className="text-xs font-bold uppercase text-[#121417]">Family Readymades</h4>
                <p className="text-[11px] text-gray-500">Ladies, Gents &amp; Kids collections under one roof</p>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3 w-full lg:w-auto justify-end">
            <a
              href={DEFAULT_STORE_SETTINGS.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#881326] hover:bg-[#6E0E1E] text-white px-6 py-3 rounded-lg text-sm font-semibold shadow transition-all hover:-translate-y-0.5 w-full sm:w-auto"
            >
              <Navigation className="w-4 h-4 text-[#C5A059]" />
              <span>Get Directions to Shop</span>
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={storePhotos}
        currentIndex={activePhotoIndex}
        onNavigate={(idx) => setActivePhotoIndex(idx)}
      />
    </section>
  );
}
