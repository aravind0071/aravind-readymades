import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import MobileContactBar from '@/components/common/MobileContactBar';
import { DEFAULT_STORE_SETTINGS } from '@/lib/constants/store-defaults';

export const metadata: Metadata = {
  metadataBase: new URL('https://aravindreadymades.com'),
  title: 'ARAVIND READYMADES | Ladies, Gents & Kids Wear Store in Malikipuram',
  description:
    'Aravind Readymades is a trusted local readymade clothing store in Malikipuram, Andhra Pradesh. Offering quality Men, Women, and Kids wear. Opposite L.S. Landmark.',
  keywords: [
    'Aravind Readymades',
    'Clothing store in Malikipuram',
    'Readymade clothing Malikipuram',
    'Ladies wear in Malikipuram',
    'Gents wear in Malikipuram',
    'Kids wear in Malikipuram',
    'Readymade shirts Malikipuram',
    'Clothing shop East Godavari',
  ],
  openGraph: {
    title: 'ARAVIND READYMADES | Quality Readymades for the Whole Family',
    description:
      'Style for Everyone. Quality You Can Trust. Ladies • Gents • Kids Wear on Main Road, Malikipuram.',
    url: 'https://aravindreadymades.com',
    siteName: 'ARAVIND READYMADES',
    images: [
      {
        url: '/images/store/storefront_hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Aravind Readymades Storefront in Malikipuram',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // LocalBusiness Structured Data JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'ARAVIND READYMADES',
    description:
      'Physical readymade clothing store offering quality apparel for Men, Women, and Kids. (We do not sell sarees).',
    image: 'https://aravindreadymades.com/images/store/storefront_hero.jpg',
    telephone: '+919959257373',
    priceRange: '₹300 - ₹3000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Main Road, Opposite L.S. Landmark',
      addressLocality: 'Malikipuram',
      postalCode: '533253',
      addressRegion: 'Andhra Pradesh',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '16.4253',
      longitude: '81.8672',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '09:30',
        closes: '22:00',
      },
    ],
    url: 'https://aravindreadymades.com',
    hasMap: DEFAULT_STORE_SETTINGS.maps_url,
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#121417]">
        <React.Suspense fallback={<div className="h-24 bg-[#121417]" />}>
          <Header />
        </React.Suspense>
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
        <Footer />
        <React.Suspense fallback={null}>
          <MobileContactBar />
        </React.Suspense>
      </body>
    </html>
  );
}
