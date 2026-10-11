import React from 'react';
import CategoryCatalogView from '@/components/common/CategoryCatalogView';
import { getProducts, getStoreSettings } from '@/lib/data/store-service';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Women's Collection | ARAVIND READYMADES Malikipuram",
  description:
    "Contemporary styles for every occasion. Pure cotton kurtis, casual tops, western dresses, and straight-fit trousers at Aravind Readymades, Malikipuram (No sarees).",
};

const WOMEN_SUBCATEGORIES = [
  { id: 'sub-w-kurtis', name: 'Cotton Kurtis', slug: 'cotton-kurtis' },
  { id: 'sub-w-tops', name: 'Casual Tops', slug: 'casual-tops' },
  { id: 'sub-w-dresses', name: 'Dresses & Co-Ords', slug: 'dresses' },
  { id: 'sub-w-pants', name: 'Straight Pants', slug: 'straight-pants' },
];

export default async function WomenPage() {
  const [products, settings] = await Promise.all([
    getProducts({ categorySlug: 'women' }),
    getStoreSettings(),
  ]);

  return (
    <CategoryCatalogView
      categoryTitle="WOMEN'S READYMADES"
      categorySubtitle="Women's Collection"
      categoryDescription="Contemporary styles for every occasion. Premium embroidered cotton kurtis, everyday casual tops, straight ankle-fit pants, and trending co-ord sets."
      bannerImage="/images/categories/women_category.jpg"
      allLabel="All Women"
      subcategories={WOMEN_SUBCATEGORIES}
      products={products}
      whatsappNumber={settings.whatsapp_number}
      noticeText="Specialized Readymade Store: We focus strictly on ready-to-wear kurtis, tops, dresses, and trousers. (We do not sell sarees)."
    />
  );
}
