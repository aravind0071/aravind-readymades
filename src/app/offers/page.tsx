import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOffers, getProducts, getStoreSettings } from '@/lib/data/store-service';
import ProductCard from '@/components/common/ProductCard';
import { Tag, ArrowRight, MessageCircle } from 'lucide-react';
import { generateGeneralWhatsAppLink } from '@/lib/utils/whatsapp';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Current Offers & In-Store Specials | ARAVIND READYMADES',
  description:
    'Explore current in-store offers and selected readymade collections at Aravind Readymades, Malikipuram.',
};

export default async function OffersPage() {
  const [offers, products, settings] = await Promise.all([
    getOffers(),
    getProducts(),
    getStoreSettings(),
  ]);

  const discountedProducts = products.filter((p) => p.discount_price !== undefined);
  const whatsappUrl = generateGeneralWhatsAppLink(
    settings.whatsapp_number,
    'Hello Aravind Readymades, I would like to enquire about your active promotional offers.'
  );

  return (
    <div className="py-12 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#881326]/10 text-[#881326] text-xs font-bold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            <span>Store Promotions</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#121417] tracking-tight">
            STYLE MORE. SAVE MORE.
          </h1>
          <p className="text-sm text-gray-600">
            Explore our latest offers and selected collections available directly at our physical store in Malikipuram.
          </p>
        </div>

        {/* Active Offers Banners */}
        {offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="relative rounded-2xl overflow-hidden bg-[#121417] text-white p-8 sm:p-10 min-h-[280px] flex flex-col justify-end border border-[#2A2F38] shadow-md group"
              >
                <Image
                  src={offer.banner_image_url || '/images/store/store_counter_display.jpg'}
                  alt={offer.title}
                  fill
                  className="object-cover filter brightness-[0.4] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="relative z-10 space-y-3">
                  <span className="bg-[#C5A059] text-[#121417] text-xs font-extrabold uppercase px-2.5 py-1 rounded inline-block">
                    {offer.badge_label || 'Special In-Store Offer'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold">{offer.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{offer.subtitle}</p>
                  <p className="text-sm font-bold text-[#C5A059]">{offer.discount_text}</p>
                  <div className="pt-2 flex items-center gap-3">
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-1.5 bg-[#881326] text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-[#6E0E1E] transition-colors"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#25D366] text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-[#20ba59] transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Enquire on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-[#E8E3D9] p-8 max-w-md mx-auto">
            <Tag className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <h3 className="font-bold text-[#121417]">No active offers right now</h3>
            <p className="text-xs text-gray-500 mt-1">
              Visit our store or WhatsApp us to check ongoing seasonal specials.
            </p>
          </div>
        )}

        {/* Selected Offer Products */}
        {discountedProducts.length > 0 && (
          <div className="pt-8 border-t border-[#E8E3D9]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#121417]">Special Pricing Collection</h2>
              <p className="text-xs text-gray-500">Selected garments with discounted store tags</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {discountedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  whatsappNumber={settings.whatsapp_number}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
