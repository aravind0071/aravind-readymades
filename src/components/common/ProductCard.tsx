'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, ArrowRight, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { Product } from '@/lib/supabase/types';
import { generateProductWhatsAppLink } from '@/lib/utils/whatsapp';
import { isInWishlist, toggleWishlist } from '@/lib/utils/wishlist';

interface ProductCardProps {
  product: Product;
  whatsappNumber?: string;
}

// Color name to CSS background color helper
const COLOR_HEX_MAP: Record<string, string> = {
  'Olive Green': '#556B2F',
  'Classic Navy': '#1B2A4A',
  'Charcoal Grey': '#36454F',
  'Indigo Dark': '#1C2841',
  'Medium Blue': '#3B6B9B',
  'Navy Blue': '#1B2A4A',
  'Slate Grey': '#708090',
  'Jet Black': '#1A1A1A',
  'White': '#F8F9FA',
  'Emerald Green': '#046307',
  'Deep Teal': '#005F60',
  'Royal Blue': '#204080',
  'Deep Maroon': '#660000',
  'Peach Floral': '#F4A261',
  'Ivory White': '#FDFBF7',
  'Beige': '#D7C4A5',
  'Black': '#1A1A1A',
  'Off-White': '#FAF0E6',
  'Rust Terracotta': '#B84A39',
  'Olive Flora': '#6B7A45',
  'Pastel Pink': '#F4ACB7',
  'Sunshine Yellow': '#F9C74F',
  'Ruby Red': '#9B111E',
  'Maroon Velvet': '#5B0E14',
  'Navy & Orange Check': '#1E2D42',
  'Sky Blue Check': '#87CEEB',
  'Classic Indigo': '#1E2D42',
  'Light Wash Blue': '#7EA4C8',
  'Bright Yellow': '#E9B824',
  'Sky Blue': '#5D9CEC',
  'Crimson Red': '#B22222',
  'Jungle Green & Navy': '#2D5A27',
  'Sky Blue & Grey': '#5D9CEC',
};

export default function ProductCard({ product, whatsappNumber = '9959257373' }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [previewColor, setPreviewColor] = useState<string>(product.colours[0] || '');

  useEffect(() => {
    setWishlisted(isInWishlist(product.id));
    const handleUpdate = () => setWishlisted(isInWishlist(product.id));
    window.addEventListener('wishlist-updated', handleUpdate);
    return () => window.removeEventListener('wishlist-updated', handleUpdate);
  }, [product.id]);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = toggleWishlist(product.id);
    setWishlisted(nextState);
  };

  // Switch card image if a specific color is hovered/clicked
  const activeImage = React.useMemo(() => {
    if (product.images && product.images.length > 0) {
      if (previewColor) {
        const matching = product.images.find(
          (img) =>
            (img.colour && img.colour.toLowerCase() === previewColor.toLowerCase()) ||
            (img.alt_text && img.alt_text.toLowerCase().includes(previewColor.toLowerCase()))
        );
        if (matching) return matching.image_url;
      }
      return product.images.find((img) => img.is_primary)?.image_url || product.images[0].image_url;
    }
    return '/images/products/shirt_casual_olive.jpg';
  }, [product.images, previewColor]);

  const whatsappUrl = generateProductWhatsAppLink({
    productName: product.name,
    productCode: product.product_code,
    price: product.discount_price ?? product.price,
    selectedSize: product.sizes[0],
    selectedColour: previewColor || product.colours[0],
    whatsappNumber,
  });

  const savingsAmount = product.discount_price ? product.price - product.discount_price : 0;
  const discountPercent = product.discount_price
    ? Math.round((savingsAmount / product.price) * 100)
    : 0;

  return (
    <div className="group relative bg-[#FFFFFF] rounded-2xl border border-[#E8E3D9] hover:border-[#881326]/40 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-400 ease-out">
      {/* 1. Image Container with Portrait Aspect */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F5F0]">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Luxury Gold & Crimson Badges Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.new_arrival && (
            <span className="inline-flex items-center gap-1 bg-[#881326] text-[#FDFBF7] text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md shadow-md border border-[#C5A059]/40 backdrop-blur-sm">
              <Sparkles className="w-2.5 h-2.5 text-[#C5A059]" />
              <span>NEW COLLECTION</span>
            </span>
          )}
          {product.discount_price && (
            <span className="inline-flex items-center bg-[#121417]/90 text-[#C5A059] text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md shadow-sm border border-[#C5A059]/30 backdrop-blur-sm">
              SPECIAL VALUE
            </span>
          )}
        </div>

        {/* Minimal Frosted Wishlist Toggle */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center border border-white/60 shadow-sm hover:scale-110 active:scale-95 transition-all group/heart"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wishlisted
                ? 'fill-[#881326] text-[#881326]'
                : 'text-gray-600 group-hover/heart:text-[#881326]'
            }`}
          />
        </button>

        {/* In-Store Availability Stamp Bottom Left */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md text-[10px] font-semibold text-gray-800 px-2 py-0.5 rounded-md border border-gray-100 shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Malikipuram In-Store</span>
          </span>
        </div>

        {/* Out of Stock Overlay */}
        {product.stock_status === 'out_of_stock' && (
          <div className="absolute inset-0 bg-[#121417]/70 backdrop-blur-[2px] flex items-center justify-center z-20 pointer-events-none">
            <span className="bg-white text-[#881326] text-xs font-black px-4 py-1.5 rounded-full shadow-lg border border-gray-200 uppercase tracking-wider">
              Currently Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* 2. Product Information Block */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 bg-white">
        <div>
          {/* Category & Product Code */}
          <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase mb-1">
            <span className="text-[#881326]">
              {product.category?.name ?? 'Collection'}
            </span>
            <span className="text-gray-400 font-mono tracking-normal text-[10px] bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
              {product.product_code}
            </span>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="block group-hover:text-[#881326] transition-colors">
            <h3 className="text-sm font-bold text-[#181A1E] leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Bespoke Boutique Pricing */}
          <div className="mt-2.5 flex items-baseline gap-2 flex-wrap">
            <span className="text-base font-black text-[#121417]">
              ₹{(product.discount_price ?? product.price).toLocaleString('en-IN')}
            </span>
            {product.discount_price && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-bold text-[#881326] bg-[#881326]/10 px-1.5 py-0.5 rounded border border-[#881326]/20">
                  Save ₹{savingsAmount} ({discountPercent}% off)
                </span>
              </>
            )}
          </div>

          {/* Interactive Color Bubbles Preview */}
          {product.colours && product.colours.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mr-1">
                Colors:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {product.colours.map((col) => {
                  const isSelected = previewColor === col;
                  const hex = COLOR_HEX_MAP[col] || '#A1A1AA';
                  return (
                    <button
                      key={col}
                      type="button"
                      title={col}
                      onClick={() => setPreviewColor(col)}
                      onMouseEnter={() => setPreviewColor(col)}
                      className={`w-3.5 h-3.5 rounded-full border transition-all ${
                        isSelected
                          ? 'ring-2 ring-[#881326] ring-offset-1 scale-125'
                          : 'border-gray-300 hover:scale-110'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Available Sizes Strip */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-2.5 flex flex-wrap items-center gap-1 text-[10px] text-gray-500">
              <span className="text-gray-400 font-medium mr-0.5">Sizes:</span>
              {product.sizes.map((s) => (
                <span
                  key={s}
                  className="font-medium text-gray-700 bg-stone-50 border border-stone-200/80 px-1.5 py-0.5 rounded"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 3. Action Buttons Row */}
        <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 mt-auto">
          <Link
            href={`/product/${product.slug}`}
            className="flex items-center justify-center gap-1 py-2 px-2 text-xs font-bold text-gray-800 bg-[#FDFBF7] hover:bg-stone-100 rounded-lg border border-gray-300 transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3 text-gray-500" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Enquire about ${product.name} on WhatsApp`}
            className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold text-white bg-[#881326] hover:bg-[#6E0E1E] rounded-lg shadow-sm hover:shadow transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Enquire</span>
          </a>
        </div>
      </div>
    </div>
  );
}
