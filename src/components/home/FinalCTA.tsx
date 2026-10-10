import React from 'react';
import { Phone, MessageCircle, Navigation, Clock } from 'lucide-react';
import { DEFAULT_STORE_SETTINGS } from '@/lib/constants/store-defaults';
import { generateGeneralWhatsAppLink } from '@/lib/utils/whatsapp';

export default function FinalCTA() {
  const whatsappUrl = generateGeneralWhatsAppLink(DEFAULT_STORE_SETTINGS.whatsapp_number);

  return (
    <section className="py-20 bg-[#121417] text-[#FDFBF7] relative overflow-hidden border-t border-[#2A2F38]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
            We&apos;re Here To Assist You
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Looking for something specific?
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
            Talk to us directly on WhatsApp for real-time size &amp; color inquiries, or drop by our Malikipuram store to explore our complete collection.
          </p>
        </div>

        {/* Buttons: WhatsApp, Call, Directions */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-7 py-3.5 rounded-lg text-sm font-bold shadow-lg transition-all hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp Us</span>
          </a>

          <a
            href={`tel:${DEFAULT_STORE_SETTINGS.phone_primary}`}
            className="inline-flex items-center gap-2.5 bg-[#881326] hover:bg-[#6E0E1E] text-white px-7 py-3.5 rounded-lg text-sm font-bold shadow-lg transition-all hover:scale-105"
          >
            <Phone className="w-4 h-4 text-[#C5A059]" />
            <span>Call {DEFAULT_STORE_SETTINGS.phone_primary}</span>
          </a>

          <a
            href={DEFAULT_STORE_SETTINGS.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-lg text-sm font-medium transition-all"
          >
            <Navigation className="w-4 h-4 text-[#C5A059]" />
            <span>Get Directions</span>
          </a>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-wrap justify-center items-center gap-6 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#C5A059]" />
            Open Daily: {DEFAULT_STORE_SETTINGS.opening_hours}
          </span>
          <span>•</span>
          <span>Main Road, Opposite L.S. Landmark, Malikipuram</span>
        </div>
      </div>
    </section>
  );
}
