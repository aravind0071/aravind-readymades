import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import CategoryCards from '@/components/home/CategoryCards';
import NewArrivals from '@/components/home/NewArrivals';
import FeaturedEditorial from '@/components/home/FeaturedEditorial';
import OffersBanner from '@/components/home/OffersBanner';
import StoreExperience from '@/components/home/StoreExperience';
import WhyShopWithUs from '@/components/home/WhyShopWithUs';
import FinalCTA from '@/components/home/FinalCTA';
import { getCategories, getProducts, getOffers, getStoreSettings } from '@/lib/data/store-service';

export default async function HomePage() {
  const [categories, products, offers, settings] = await Promise.all([
    getCategories(),
    getProducts({ newArrivalsOnly: true }),
    getOffers(),
    getStoreSettings(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section with Storefront Photo & CTAs */}
      <HeroSection />

      {/* 2. Shop by Category (Men, Women, Kids - No Sarees) */}
      <CategoryCards categories={categories} />

      {/* 3. New Arrivals Product Grid */}
      <NewArrivals products={products} whatsappNumber={settings.whatsapp_number} />

      {/* 4. Editorial Fashion Showcase */}
      <FeaturedEditorial />

      {/* 5. In-Store Promotional Offers Banner */}
      <OffersBanner offers={offers} />

      {/* 6. Physical Store Experience (Real Store Photos & Lightbox) */}
      <StoreExperience />

      {/* 7. Why Shop With Us (Value Pillars) */}
      <WhyShopWithUs />

      {/* 8. Final Conversion CTA (WhatsApp, Call, Directions) */}
      <FinalCTA />
    </div>
  );
}
