'use client';

import React from 'react';
import { Phone, MessageCircle, Navigation } from 'lucide-react';
import { DEFAULT_STORE_SETTINGS } from '@/lib/constants/store-defaults';
import { generateGeneralWhatsAppLink } from '@/lib/utils/whatsapp';

export default function MobileContactBar() {
  const whatsappUrl = generateGeneralWhatsAppLink(DEFAULT_STORE_SETTINGS.whatsapp_number);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#121417]/95 backdrop-blur-md border-t border-[#2A2F38] px-3 py-2 shadow-2xl">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* Call Button */}
        <a
          href={`tel:${DEFAULT_STORE_SETTINGS.phone_primary}`}
          aria-label="Call Store"
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-[#1F232B] hover:bg-[#282D37] text-[#FDFBF7] active:scale-95 transition-all text-center"
        >
          <Phone className="w-4 h-4 text-[#C5A059] mb-0.5" />
          <span className="text-[11px] font-semibold tracking-tight">Call Now</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Enquiry"
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white active:scale-95 transition-all text-center shadow-sm"
        >
          <MessageCircle className="w-4 h-4 text-white mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">WhatsApp</span>
        </a>

        {/* Directions Button */}
        <a
          href={DEFAULT_STORE_SETTINGS.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get Directions to Store"
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-[#881326] hover:bg-[#6E0E1E] text-white active:scale-95 transition-all text-center"
        >
          <Navigation className="w-4 h-4 text-[#C5A059] mb-0.5" />
          <span className="text-[11px] font-semibold tracking-tight">Directions</span>
        </a>
      </div>
    </div>
  );
}
