import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MessageCircle, MapPin, Sparkles } from 'lucide-react';
import { DEFAULT_STORE_SETTINGS } from '@/lib/constants/store-defaults';
import { generateGeneralWhatsAppLink } from '@/lib/utils/whatsapp';

export default function HeroSection() {
  const whatsappUrl = generateGeneralWhatsAppLink(DEFAULT_STORE_SETTINGS.whatsapp_number);

  return (
    <section className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center bg-[#121417] text-[#FDFBF7] overflow-hidden">
      {/* Background Storefront Image with Editorial Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/store/storefront_hero.jpg"
          alt="Aravind Readymades Physical Storefront in Malikipuram"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.45] contrast-[1.05]"
        />
        {/* Subtle Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121417] via-transparent to-[#121417]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#121417]/90 via-[#121417]/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#881326]/80 border border-[#C5A059]/40 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#FDFBF7]">
              Physical Store • Malikipuram, Andhra Pradesh
            </span>
          </div>

          {/* Main Editorial Heading */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              ARAVIND <span className="text-[#C5A059]">READYMADES</span>
            </h1>
            <p className="text-base sm:text-lg font-medium text-[#E4E4E7] tracking-wider uppercase">
              Ladies • Gents • Kids Wear
            </p>
          </div>

          {/* Tagline */}
          <p className="text-lg sm:text-xl text-[#D4D4D8] font-light leading-relaxed">
            &quot;Style for Everyone. Quality You Can Trust.&quot; Discover quality readymade clothing for the whole family, tailored for everyday comfort and special celebrations.
          </p>

          {/* Call to Actions */}
          <div className="pt-2 flex flex-wrap gap-3.5 sm:gap-4 items-center">
            {/* Primary: Explore Collection */}
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#881326] hover:bg-[#6E0E1E] text-white font-semibold px-6 py-3.5 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
            </Link>

            {/* WhatsApp Store Enquiry */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold px-5 py-3.5 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>

            {/* Directions Link */}
            <a
              href={DEFAULT_STORE_SETTINGS.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-[#FDFBF7] font-medium px-5 py-3.5 rounded-lg border border-white/20 backdrop-blur-sm transition-all text-sm"
            >
              <MapPin className="w-4 h-4 text-[#C5A059]" />
              <span>Get Directions</span>
            </a>
          </div>

          {/* Location & Timings Metadata Strip */}
          <div className="pt-6 border-t border-white/15 flex flex-wrap gap-6 text-xs text-[#A1A1AA]">
            <div>
              <span className="text-white block font-medium">Store Address:</span>
              <span>Opposite L.S. Landmark, Main Road, Malikipuram</span>
            </div>
            <div>
              <span className="text-white block font-medium">Store Hours:</span>
              <span>Open Daily: 9:30 AM – 10:00 PM</span>
            </div>
            <div>
              <span className="text-white block font-medium">Customer Support:</span>
              <span>9959257373 / 9959257272</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
