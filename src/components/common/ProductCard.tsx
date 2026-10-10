'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { Product } from '@/lib/supabase/types';
import { generateProductWhatsAppLink } from '@/lib/utils/whatsapp';

interface ProductCardProps {
  product: Product;
  whatsappNumber?: string;
}

export default function ProductCard({ product, whatsappNumber = '9959257373' }: ProductCardProps) {
  const primaryImage =
    product.images && product.images.length > 0
      ? product.images.find((img) => img.is_primary)?.image_url || product.images[0].image_url
      : '/images/products/shirt_casual_olive.jpg';

  const whatsappUrl = generateProductWhatsAppLink({
    productName: product.name,
    productCode: product.product_code,
    price: product.discount_price ?? product.price,
    selectedSize: product.sizes[0],
    selectedColour: product.colours[0],
    whatsappNumber,
  });

  return (
    <div className="group relative bg-[#FFFFFF] rounded-lg border border-[#E8E3D9] overflow-hidden flex flex-col hover:shadow-lg hover:border-[#881326]/40 transition-all duration-300">
      {/* Image Container with Badges */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 block">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Top Left & Right */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.new_arrival && (
            <span className="bg-[#881326] text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow-sm">
              NEW
            </span>
          )}
          {product.discount_price && (
            <span className="bg-[#C5A059] text-[#121417] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow-sm">
              OFFER
            </span>
          )}
        </div>

        {/* Stock Status Badge */}
        {product.stock_status === 'out_of_stock' && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="bg-[#121417] text-white text-xs font-semibold px-3 py-1 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category & Product Code */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium mb-1">
            <span>{product.category?.name ?? 'Collection'}</span>
            <span className="text-gray-400 font-mono">{product.product_code}</span>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-sm font-semibold text-[#121417] line-clamp-1 group-hover:text-[#881326] transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Price Block */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-bold text-[#121417]">
              ₹{(product.discount_price ?? product.price).toLocaleString('en-IN')}
            </span>
            {product.discount_price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Sizes preview */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1 items-center">
              <span className="text-[10px] text-gray-400 mr-0.5">Sizes:</span>
              {product.sizes.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-200"
                >
                  {s}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-[10px] text-gray-400 font-medium">+{product.sizes.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {/* Card Action Buttons */}
        <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 mt-auto">
          <Link
            href={`/product/${product.slug}`}
            className="flex items-center justify-center gap-1 py-2 px-2 text-xs font-medium text-[#121417] bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Enquire ${product.name} on WhatsApp`}
            className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] rounded shadow-sm transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Enquire</span>
          </a>
        </div>
      </div>
    </div>
  );
}
