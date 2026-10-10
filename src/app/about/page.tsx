import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Clock, MessageCircle, Navigation, ShieldCheck } from 'lucide-react';
import { DEFAULT_STORE_SETTINGS } from '@/lib/constants/store-defaults';
import { generateGeneralWhatsAppLink } from '@/lib/utils/whatsapp';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | ARAVIND READYMADES Malikipuram',
  description:
    'Aravind Readymades is a trusted local readymade clothing store serving families with ladies, gents, and kids wear in Malikipuram, Andhra Pradesh.',
};

export default function AboutPage() {
  const whatsappUrl = generateGeneralWhatsAppLink(DEFAULT_STORE_SETTINGS.whatsapp_number);

  return (
    <div className="py-14 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#881326]">
            Our Story &amp; Values
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#121417] tracking-tight">
            ABOUT ARAVIND READYMADES
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-light">
            Aravind Readymades is a trusted local readymade clothing store serving families with quality ladies, gents and kids wear in Malikipuram, Andhra Pradesh.
          </p>
        </div>

        {/* Story Section with Store Interior Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white p-8 sm:p-12 rounded-2xl border border-[#E8E3D9] shadow-sm">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#121417]">
              Quality Clothing for the Entire Family
            </h2>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>
                Located prominently on Main Road opposite L.S. Landmark in Malikipuram, <strong>ARAVIND READYMADES</strong> was founded to offer dependable, fashionable, and comfortable clothing options for every member of the family.
              </p>
              <p>
                We believe that shopping for clothes should be pleasant, straightforward, and honest. Rather than complicated online sizing uncertainties, our physical store allows customers to feel the fabric, verify the fit, and walk away with clothing they genuinely enjoy wearing.
              </p>
              <p className="p-3.5 bg-[#FDFBF7] rounded-lg border-l-4 border-[#881326] text-xs font-medium text-gray-700">
                <strong>Our Specialty:</strong> We specialize exclusively in ready-to-wear clothing for Ladies, Gents, and Kids. (We do not sell sarees).
              </p>
            </div>

            {/* In-Store Commitments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#881326] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#121417]">Fair Pricing</h4>
                  <p className="text-[11px] text-gray-500">Transparent in-store tags without inflated margins</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#881326] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#121417]">Personal Attention</h4>
                  <p className="text-[11px] text-gray-500">Friendly local staff dedicated to finding your ideal size</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden shadow-md">
            <Image
              src="/images/store/store_interior_aisle.jpg"
              alt="Inside Aravind Readymades store in Malikipuram"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* 3 Physical Store Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-[#E8E3D9]">
            <Image
              src="/images/store/storefront_hero.jpg"
              alt="Aravind Readymades Storefront"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-bold">Physical Storefront Entrance</span>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-[#E8E3D9]">
            <Image
              src="/images/store/store_counter_display.jpg"
              alt="Display and Billing Counter"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-bold">Billing &amp; Boxed Apparel Counter</span>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-[#E8E3D9]">
            <Image
              src="/images/store/store_women_section.jpg"
              alt="Women Section"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-bold">Ladies Kurti &amp; Western Section</span>
            </div>
          </div>
        </div>

        {/* Contact and Visit Strip */}
        <div className="bg-[#121417] text-white p-8 sm:p-10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold">Visit Our Store in Malikipuram</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Main Road, Opposite L.S. Landmark, Malikipuram - 533253. Open daily 9:30 AM to 10:00 PM.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-lg text-xs font-bold shadow hover:bg-[#20ba59]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
            <a
              href={DEFAULT_STORE_SETTINGS.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#881326] text-white px-5 py-3 rounded-lg text-xs font-bold shadow hover:bg-[#6E0E1E]"
            >
              <Navigation className="w-4 h-4 text-[#C5A059]" />
              <span>Get Directions</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
