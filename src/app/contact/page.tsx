import React from 'react';
import { MapPin, Phone, Clock, MessageCircle, Navigation, Mail } from 'lucide-react';
import { DEFAULT_STORE_SETTINGS } from '@/lib/constants/store-defaults';
import { generateGeneralWhatsAppLink } from '@/lib/utils/whatsapp';
import { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us & Store Location | ARAVIND READYMADES Malikipuram',
  description:
    'Contact Aravind Readymades, Malikipuram. Phone: 9959257373, 9959257272. Hours: 9:30 AM - 10:00 PM. Main Road, Opposite L.S. Landmark.',
};

export default function ContactPage() {
  const whatsappUrl = generateGeneralWhatsAppLink(DEFAULT_STORE_SETTINGS.whatsapp_number);

  return (
    <div className="py-14 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#881326]">
            Store Location &amp; Contact
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#121417] tracking-tight">
            CONTACT ARAVIND READYMADES
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Have questions about sizes, new arrivals, or directions? Call us, chat on WhatsApp, or visit our store in Malikipuram.
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Address */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E3D9] shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#881326]/10 text-[#881326] flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#121417]">Store Address</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong>ARAVIND READYMADES</strong>
                <br />
                Main Road, Opposite L.S. Landmark,
                <br />
                Malikipuram - 533253,
                <br />
                Andhra Pradesh, India
              </p>
            </div>
            <a
              href={DEFAULT_STORE_SETTINGS.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#881326] hover:underline"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </a>
          </div>

          {/* Card 2: Phone & WhatsApp */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E3D9] shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
                <Phone className="w-6 h-6 text-[#881326]" />
              </div>
              <h3 className="text-lg font-bold text-[#121417]">Direct Phones</h3>
              <div className="space-y-1 text-sm text-gray-700">
                <a
                  href={`tel:${DEFAULT_STORE_SETTINGS.phone_primary}`}
                  className="block font-semibold hover:text-[#881326]"
                >
                  {DEFAULT_STORE_SETTINGS.phone_primary} (Primary)
                </a>
                <a
                  href={`tel:${DEFAULT_STORE_SETTINGS.phone_secondary}`}
                  className="block font-semibold hover:text-[#881326]"
                >
                  {DEFAULT_STORE_SETTINGS.phone_secondary} (Secondary)
                </a>
              </div>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#25D366] hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Card 3: Timings */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E3D9] shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#121417]" />
              </div>
              <h3 className="text-lg font-bold text-[#121417]">Store Timings</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Open All 7 Days a Week:
                <br />
                <strong className="text-base text-[#121417]">{DEFAULT_STORE_SETTINGS.opening_hours}</strong>
                <br />
                Morning to Night Service
              </p>
            </div>
            <span className="text-xs text-green-700 font-semibold bg-green-50 px-2 py-1 rounded inline-block w-fit">
              • Open Today
            </span>
          </div>
        </div>

        {/* Google Maps & Quick Action Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-2xl border border-[#E8E3D9] overflow-hidden shadow-sm">
          {/* Map Embed or Direct Visual (7 cols) */}
          <div className="lg:col-span-7 relative min-h-[380px] bg-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.4266157835154!2d81.8650113!3d16.4253215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37df19d931a8c5%3A0xd6c8f7870cbece95!2sAravind%20Readymades!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Aravind Readymades Location on Google Maps"
            />
          </div>

          {/* Quick Contact Form / Direct Enquiries (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#121417]">Send Store Message</h3>
              <p className="text-xs text-gray-500">
                Submit an inquiry or contact us directly on WhatsApp for an immediate response.
              </p>

              <ContactForm />
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 rounded-lg text-xs font-bold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant Reply on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
