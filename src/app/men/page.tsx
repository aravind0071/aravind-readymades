import React from 'react';
import CategoryCatalogView from '@/components/common/CategoryCatalogView';
import { getProducts, getStoreSettings } from '@/lib/data/store-service';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Men's Collection | ARAVIND READYMADES Malikipuram",
  description:
    "Explore our Men's readymade collection: casual shirts, formal trousers, denim jeans, t-shirts, and innerwear at Aravind Readymades, Malikipuram.",
};

const MEN_SUBCATEGORIES = [
  { id: 'sub-m-shirts', name: 'Casual Shirts', slug: 'casual-shirts' },
  { id: 'sub-m-jeans', name: 'Denim Jeans', slug: 'denim-jeans' },
  { id: 'sub-m-trousers', name: 'Formal Trousers', slug: 'formal-trousers' },
  { id: 'sub-m-tshirts', name: 'T-Shirts', slug: 't-shirts' },
  { id: 'sub-m-innerwear', name: 'Innerwear', slug: 'innerwear' },
];

export default async function MenPage() {
  const [products, settings] = await Promise.all([
    getProducts({ categorySlug: 'men' }),
    getStoreSettings(),
  ]);

  return (
    <CategoryCatalogView
      categoryTitle="GENTS READYMADES"
      categorySubtitle="Men's Collection"
      categoryDescription="Wardrobe essentials, smart casuals & occasion wear. Cotton shirts, jeans, formal trousers, polo tees, and comfort innerwear."
      bannerImage="/images/categories/men_category.jpg"
      allLabel="All Men"
      subcategories={MEN_SUBCATEGORIES}
      products={products}
      whatsappNumber={settings.whatsapp_number}
    />
  );
}
