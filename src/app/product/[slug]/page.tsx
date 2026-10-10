'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MessageCircle,
  Phone,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowLeft,
  Share2,
  Check,
  Sparkles,
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/data/initial-data';
import { DEFAULT_STORE_SETTINGS } from '@/lib/constants/store-defaults';
import { generateProductWhatsAppLink } from '@/lib/utils/whatsapp';
import ProductCard from '@/components/common/ProductCard';
import { Product } from '@/lib/supabase/types';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

function ProductDetailContent({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const product = INITIAL_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '');
  const [selectedColour, setSelectedColour] = useState<string>(product.colours[0] || '');
  const [copiedLink, setCopiedLink] = useState(false);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [{ id: '1', product_id: product.id, image_url: '/images/products/shirt_casual_olive.jpg', alt_text: product.name, display_order: 1, is_primary: true }];

  const currentImage = images[selectedImageIndex] || images[0];

  const whatsappUrl = generateProductWhatsAppLink({
    productName: product.name,
    productCode: product.product_code,
    price: product.discount_price ?? product.price,
    selectedSize,
    selectedColour,
    whatsappNumber: DEFAULT_STORE_SETTINGS.whatsapp_number,
  });

  const relatedProducts = INITIAL_PRODUCTS.filter(
    (p) => p.category_id === product.category_id && p.id !== product.id
  ).slice(0, 4);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="py-10 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back navigation & Share */}
        <div className="flex items-center justify-between">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#881326] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catalogue</span>
          </Link>
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-black py-1 px-2.5 rounded bg-white border border-gray-200"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Product'}</span>
          </button>
        </div>

        {/* Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white p-6 sm:p-10 rounded-2xl border border-[#E8E3D9] shadow-sm">
          {/* Left Column: Image Gallery (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Large Image */}
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner">
              <Image
                src={currentImage.image_url}
                alt={currentImage.alt_text || product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              {product.new_arrival && (
                <span className="absolute top-4 left-4 bg-[#881326] text-white text-xs uppercase font-extrabold px-2.5 py-1 rounded shadow">
                  NEW ARRIVAL
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-[#881326] shadow-md scale-95'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img.image_url}
                      alt={img.alt_text}
                      fill
                      className="object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Information & In-Store Actions (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Product Code & Category */}
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                <span className="uppercase tracking-wider text-[#881326]">
                  {product.category?.name || 'Aravind Readymades'}
                </span>
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                  CODE: {product.product_code}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#121417] leading-tight">
                {product.name}
              </h1>

              {/* Price Tag */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl font-black text-[#121417]">
                  ₹{(product.discount_price ?? product.price).toLocaleString('en-IN')}
                </span>
                {product.discount_price && (
                  <>
                    <span className="text-base text-gray-400 line-through">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                      SAVE ₹{(product.price - product.discount_price).toLocaleString('en-IN')}
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 pt-1">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    product.stock_status === 'in_stock'
                      ? 'bg-green-500'
                      : product.stock_status === 'low_stock'
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                />
                <span className="text-xs font-semibold text-gray-700 capitalize">
                  {product.stock_status === 'in_stock'
                    ? 'In Stock at Malikipuram Store'
                    : product.stock_status === 'low_stock'
                    ? 'Only Few Units Remaining In-Store'
                    : 'Currently Out of Stock'}
                </span>
              </div>

              {/* Description */}
              <div className="pt-2 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                <p>{product.description}</p>
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-900">Select Available Size:</span>
                    <span className="text-gray-500">Selected: {selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
                          selectedSize === sz
                            ? 'bg-[#121417] text-white border-[#121417] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colour Selector */}
              {product.colours && product.colours.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-900">Available Colours:</span>
                    <span className="text-gray-500">Selected: {selectedColour}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colours.map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedColour(col)}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          selectedColour === col
                            ? 'bg-[#881326] text-white border-[#881326]'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Inquiry & Store Visit Conversion Box */}
            <div className="pt-6 border-t border-gray-200 space-y-4">
              <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#E8E3D9] space-y-1">
                <h4 className="text-xs font-bold text-[#121417] uppercase tracking-wider">
                  Interested in this product?
                </h4>
                <p className="text-xs text-gray-600">
                  Contact us on WhatsApp to check current availability, reserve your size, or visit our Malikipuram shop for a trial.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 px-4 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Enquire on WhatsApp</span>
                </a>

                <a
                  href={`tel:${DEFAULT_STORE_SETTINGS.phone_primary}`}
                  className="flex items-center justify-center gap-2 bg-[#121417] hover:bg-[#881326] text-white py-3.5 px-4 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4 text-[#C5A059]" />
                  <span>Call {DEFAULT_STORE_SETTINGS.phone_primary}</span>
                </a>
              </div>

              {/* Store Address & Hours Micro-strip */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#881326]" />
                  <span className="truncate">Opp. L.S. Landmark, Malikipuram</span>
                </div>
                <div className="flex items-center gap-1.5 justify-end">
                  <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Daily 9:30 AM – 10 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#881326] uppercase tracking-wider">
                More From This Category
              </span>
              <h3 className="text-2xl font-bold text-[#121417]">You May Also Like</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  whatsappNumber={DEFAULT_STORE_SETTINGS.whatsapp_number}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FDFBF7] py-20 text-center text-stone-500">Loading product details...</div>}>
      <ProductDetailContent params={params} />
    </React.Suspense>
  );
}
