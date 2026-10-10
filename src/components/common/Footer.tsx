import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Clock, MessageCircle, ExternalLink } from 'lucide-react';
import { DEFAULT_STORE_SETTINGS } from '@/lib/constants/store-defaults';
import { generateGeneralWhatsAppLink } from '@/lib/utils/whatsapp';

export default function Footer() {
  const whatsappUrl = generateGeneralWhatsAppLink(DEFAULT_STORE_SETTINGS.whatsapp_number);

  return (
    <footer className="bg-[#121417] text-[#FDFBF7] pt-16 pb-24 lg:pb-16 border-t border-[#2A2F38]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-[#2A2F38]">
          {/* Col 1: Store Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#881326] flex items-center justify-center text-white font-bold text-lg border border-[#C5A059]">
                A
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-tight text-white">ARAVIND READYMADES</h3>
                <p className="text-xs text-[#C5A059] font-medium tracking-wide">LADIES • GENTS • KIDS WEAR</p>
              </div>
            </div>
            <p className="text-sm text-[#A1A1AA] leading-relaxed">
              &quot;Style for Everyone. Quality You Can Trust.&quot; Discover quality readymade clothing for the whole family at our physical store in Malikipuram.
            </p>
            <div className="inline-block px-3 py-1 rounded bg-[#2A2F38] text-[11px] text-[#D4AF37] font-medium">
              Notice: We specialize in readymades (We do not sell sarees)
            </div>
          </div>

          {/* Col 2: Store Collections */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-4 border-l-2 border-[#881326] pl-2.5">
              Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A1A1AA]">
              <li>
                <Link href="/men" className="hover:text-[#C5A059] transition-colors">
                  Men&apos;s Wear (Shirts, Jeans, Trousers)
                </Link>
              </li>
              <li>
                <Link href="/women" className="hover:text-[#C5A059] transition-colors">
                  Women&apos;s Wear (Kurtis, Tops, Pants)
                </Link>
              </li>
              <li>
                <Link href="/kids" className="hover:text-[#C5A059] transition-colors">
                  Kids Wear (Boys &amp; Girls)
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="hover:text-[#C5A059] transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-[#C5A059] transition-colors">
                  Current Offers &amp; Specials
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#C5A059] transition-colors">
                  Store Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Physical Store Location */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-4 border-l-2 border-[#881326] pl-2.5">
              Store Location
            </h4>
            <div className="space-y-3 text-sm text-[#A1A1AA]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white block font-medium">ARAVIND READYMADES</strong>
                  Main Road, Opposite L.S. Landmark,
                  <br />
                  Malikipuram - 533253,
                  <br />
                  Andhra Pradesh, India
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
                <p>{DEFAULT_STORE_SETTINGS.opening_hours} (Daily)</p>
              </div>

              <a
                href={DEFAULT_STORE_SETTINGS.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#C5A059] hover:underline font-medium pt-1"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 4: Contact & Enquiries */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-4 border-l-2 border-[#881326] pl-2.5">
              Contact &amp; Enquiry
            </h4>
            <div className="space-y-3 text-sm text-[#A1A1AA]">
              <div>
                <span className="text-xs text-[#71717A] block">Call Our Store:</span>
                <a
                  href={`tel:${DEFAULT_STORE_SETTINGS.phone_primary}`}
                  className="text-white hover:text-[#C5A059] font-medium text-base block"
                >
                  {DEFAULT_STORE_SETTINGS.phone_primary}
                </a>
                <a
                  href={`tel:${DEFAULT_STORE_SETTINGS.phone_secondary}`}
                  className="text-white hover:text-[#C5A059] font-medium text-base block"
                >
                  {DEFAULT_STORE_SETTINGS.phone_secondary}
                </a>
              </div>

              <div className="pt-2">
                <span className="text-xs text-[#71717A] block">WhatsApp Orders &amp; Queries:</span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-1.5 bg-[#25D366] text-white px-3.5 py-2 rounded-md text-xs font-semibold hover:bg-[#20ba59] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <p>© 2025–2026 ARAVIND READYMADES. All rights reserved. Physical Retail Store, Malikipuram.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-white transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact &amp; Timings
            </Link>
            <Link href="/admin/login" className="hover:text-[#C5A059] transition-colors">
              Staff / Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
