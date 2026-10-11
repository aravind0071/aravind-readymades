'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  ArrowLeft,
  Share2,
  Check,
  Heart,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/data/initial-data';
import { DEFAULT_STORE_SETTINGS } from '@/lib/constants/store-defaults';
import { generateProductWhatsAppLink } from '@/lib/utils/whatsapp';
import { isInWishlist, toggleWishlist } from '@/lib/utils/wishlist';
import ProductCard from '@/components/common/ProductCard';

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
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    setWishlisted(isInWishlist(product.id));
  }, [product.id]);

  const handleToggleWishlist = () => {
    const nextState = toggleWishlist(product.id);
    setWishlisted(nextState);
  };

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [{ id: '1', product_id: product.id, image_url: '/images/products/shirt_casual_olive.jpg', alt_text: product.name, display_order: 1, is_primary: true }];

  const currentImage = images[selectedImageIndex] || images[0];

  const handleColorChange = (col: string) => {
    setSelectedColour(col);
    // Switch preview photo to match the clicked color
    const matchedIndex = images.findIndex(
      (img) =>
        (img.colour && img.colour.toLowerCase() === col.toLowerCase()) ||
        (img.alt_text && img.alt_text.toLowerCase().includes(col.toLowerCase()))
    );
    if (matchedIndex !== -1) {
      setSelectedImageIndex(matchedIndex);
    }
  };

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

  const discountPercent = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  return (
    <div className="py-8 sm:py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Editorial Top Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E2D7] pb-4 text-xs">
          <div className="flex items-center gap-2 text-[#6B7280]">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 font-bold text-[#881326] hover:text-[#5E0D1B] transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </Link>
            <span>/</span>
            <span className="capitalize">{typeof product.category === 'object' && product.category !== null ? product.category.name : (product.category || 'Collection')}</span>
            <span>/</span>
            <span className="font-semibold text-[#121417] truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </div>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#121417] hover:text-[#881326] py-2 px-4 rounded-full bg-white border border-[#E8E2D7] shadow-sm hover:shadow transition-all"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-[#C5A059]" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Piece'}</span>
          </button>
        </div>

        {/* Boutique Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 bg-white p-6 sm:p-12 rounded-3xl border border-[#E8E2D7] shadow-sm">
          {/* Left Column: Image Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Primary Large Image */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#F6F4EF] border border-[#E8E2D7] shadow-inner group">
              <Image
                src={currentImage.image_url}
                alt={currentImage.alt_text || product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Luxury Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.new_arrival && (
                  <span className="bg-[#881326] text-white text-[9px] uppercase font-black px-3 py-1 rounded-full shadow tracking-widest border border-amber-300/30">
                    NEW ARRIVAL
                  </span>
                )}
                {product.discount_price && (
                  <span className="bg-[#121417] text-[#C5A059] text-[9px] uppercase font-black px-3 py-1 rounded-full shadow tracking-wider border border-[#C5A059]/40">
                    SPECIAL OFFER
                  </span>
                )}
              </div>

              {/* Wishlist Heart Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center border border-[#E8E2D7] shadow-md hover:scale-110 transition-transform"
                title={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
              >
                <Heart className={`w-5 h-5 transition-colors ${wishlisted ? 'fill-[#881326] text-[#881326]' : 'text-gray-600 hover:text-[#881326]'}`} />
              </button>

              {/* Authentic Quality Seal */}
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-[#121417]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs text-white shadow-lg border border-[#C5A059]/30">
                <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                <span className="text-[11px] font-bold text-[#E8E2D7] tracking-wide">
                  Malikipuram Flagship Selection
                </span>
              </div>
            </div>

            {/* Thumbnail Selector Gallery */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      if (img.colour) setSelectedColour(img.colour);
                    }}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-[#881326] ring-2 ring-[#C5A059]/50 shadow-md scale-95'
                        : 'border-[#E8E2D7] opacity-75 hover:opacity-100 hover:border-gray-400'
                    }`}
                  >
                    <Image src={img.image_url} alt={img.alt_text} fill className="object-cover object-center" />
                    {img.colour && (
                      <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[#FAF8F5] text-[9px] font-bold text-center py-0.5 truncate px-1">
                        {img.colour}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Actions (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Boutique Brand Heading & Code */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#881326]">
                      ARAVIND READYMADES
                    </span>
                  </div>
                  <span className="font-mono bg-[#FAF8F5] px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#881326] border border-[#E8E2D7]">
                    {product.product_code}
                  </span>
                </div>

                {/* Product Title */}
                <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#121417] leading-tight tracking-tight pt-1">
                  {product.name}
                </h1>
              </div>

              {/* Price & Value Presentation */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D7] space-y-1.5">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-serif font-black text-[#121417]">
                    ₹{(product.discount_price ?? product.price).toLocaleString('en-IN')}
                  </span>
                  {product.discount_price && (
                    <>
                      <span className="text-base text-gray-400 line-through">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#881326] text-white tracking-wider">
                        SAVE {discountPercent}%
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                  <span className="text-emerald-700 font-bold">Inclusive of all local taxes</span>
                  <span className="text-[#C5A059] font-bold">Boutique Direct Price</span>
                </div>
              </div>

              {/* Stock Status Badge */}
              <div className="flex items-center gap-2.5 py-1">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    product.stock_status === 'in_stock'
                      ? 'bg-emerald-500 animate-pulse'
                      : product.stock_status === 'low_stock'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
                <span className="text-xs font-bold text-[#121417]">
                  {product.stock_status === 'in_stock'
                    ? 'In Stock at Malikipuram Store (Ready for pickup / trial)'
                    : product.stock_status === 'low_stock'
                    ? 'Limited Pieces in Boutique'
                    : 'Currently Out of Stock'}
                </span>
              </div>

              {/* AVAILABLE COLOURWAYS with Clickable Photo Swatches */}
              {product.colours && product.colours.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-[#E8E2D7]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black uppercase tracking-wider text-[#121417]">
                      COLOURWAY
                    </span>
                    <span className="text-xs text-[#6B7280]">
                      Active: <strong className="text-[#881326] font-bold">{selectedColour}</strong>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5 items-center">
                    {product.colours.map((col) => {
                      const matchingImg =
                        images.find(
                          (img) =>
                            (img.colour && img.colour.toLowerCase() === col.toLowerCase()) ||
                            (img.alt_text && img.alt_text.toLowerCase().includes(col.toLowerCase()))
                        ) || images[0];
                      const isSelected = selectedColour.toLowerCase() === col.toLowerCase();

                      return (
                        <button
                          key={col}
                          type="button"
                          onClick={() => handleColorChange(col)}
                          className={`flex items-center gap-2 p-1.5 rounded-xl border-2 transition-all ${
                            isSelected
                              ? 'border-[#881326] bg-[#881326]/5 shadow-sm ring-1 ring-[#C5A059]'
                              : 'border-[#E8E2D7] hover:border-gray-400 bg-white'
                          }`}
                        >
                          <div className="relative w-8 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            <Image src={matchingImg.image_url} alt={col} fill className="object-cover" />
                          </div>
                          <span
                            className={`text-xs pr-2 font-bold ${
                              isSelected ? 'text-[#881326]' : 'text-[#374151]'
                            }`}
                          >
                            {col}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-[#E8E2D7]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-black uppercase tracking-wider text-[#121417]">
                      SELECT SIZE
                    </span>
                    <span className="text-xs text-[#6B7280]">Selected: <strong className="text-[#881326]">{selectedSize}</strong></span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`h-11 px-4 text-xs font-black rounded-xl border transition-all flex items-center justify-center ${
                          selectedSize === sz
                            ? 'bg-[#881326] text-white border-[#881326] shadow-sm ring-2 ring-[#C5A059]/40'
                            : 'bg-white text-[#121417] border-[#E8E2D7] hover:border-gray-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Description */}
              <div className="pt-4 text-xs text-[#4B5563] leading-relaxed border-t border-[#E8E2D7] space-y-2">
                <span className="font-black uppercase tracking-wider text-[#121417] block">
                  FABRIC & GARMENT DETAILS
                </span>
                <p className="leading-relaxed">{product.description}</p>
              </div>
            </div>

            {/* Action Buttons: WhatsApp Enquiry & Wishlist */}
            <div className="pt-6 border-t border-[#E8E2D7] space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Primary CTA: WhatsApp Direct Enquiry */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:col-span-8 flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-4 px-6 rounded-2xl text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all active:scale-95 uppercase tracking-wider"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-white" />
                  <span>Enquire on WhatsApp</span>
                </a>

                {/* Secondary CTA: Wishlist Button */}
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`sm:col-span-4 flex items-center justify-center gap-2 py-4 px-4 rounded-2xl text-xs font-black border-2 transition-all active:scale-95 uppercase tracking-wider ${
                    wishlisted
                      ? 'bg-[#881326]/10 border-[#881326] text-[#881326]'
                      : 'bg-white border-[#E8E2D7] text-[#121417] hover:border-[#881326]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#881326] text-[#881326]' : 'text-gray-700'}`} />
                  <span>{wishlisted ? 'Saved' : 'Save'}</span>
                </button>
              </div>

              {/* Direct Store Call Button */}
              <a
                href={`tel:${DEFAULT_STORE_SETTINGS.phone_primary}`}
                className="w-full flex items-center justify-center gap-2 bg-[#121417] hover:bg-black text-[#FAF8F5] py-3.5 rounded-2xl text-xs font-bold transition-all shadow-sm"
              >
                <Phone className="w-4 h-4 text-[#C5A059]" />
                <span>Call Boutique Directly: {DEFAULT_STORE_SETTINGS.phone_primary}</span>
              </a>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 text-[10px] text-[#6B7280] pt-4 border-t border-[#E8E2D7] text-center font-bold">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#881326]" />
                  <span>100% Authentic Quality</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-[#C5A059]" />
                  <span>Physical Store Trials</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-emerald-600" />
                  <span>Instant Availability</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Curated Recommendations Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-[#E8E2D7] pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C5A059]">Curated For You</span>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-[#121417]">
                  Similar Garments You May Admire
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-xs font-black uppercase tracking-wider text-[#881326] hover:text-[#5E0D1B] transition-colors"
              >
                View Full Catalog →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} whatsappNumber={DEFAULT_STORE_SETTINGS.whatsapp_number} />
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
    <Suspense fallback={<div className="py-20 text-center text-xs text-gray-500">Loading product details...</div>}>
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
