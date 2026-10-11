import React from 'react';
import CategoryCatalogView from '@/components/common/CategoryCatalogView';
import { getProducts, getStoreSettings } from '@/lib/data/store-service';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Kids' Collection | ARAVIND READYMADES Malikipuram",
  description:
    "Comfortable and stylish looks for little ones. Boys plaid shirts, girls frocks, kids denim jeans, and playful tees at Aravind Readymades, Malikipuram.",
};

const KIDS_SUBCATEGORIES = [
  { id: 'sub-k-boys', name: 'Boys Wear', slug: 'boys-wear' },
  { id: 'sub-k-girls', name: 'Girls Frocks & Dresses', slug: 'girls-wear' },
  { id: 'sub-k-jeans', name: 'Kids Denim', slug: 'kids-jeans' },
  { id: 'sub-k-casual', name: 'Casual Sets', slug: 'casual-sets' },
];

export default async function KidsPage() {
  const [products, settings] = await Promise.all([
    getProducts({ categorySlug: 'kids' }),
    getStoreSettings(),
  ]);

  return (
    <CategoryCatalogView
      categoryTitle="KIDS READYMADES"
      categorySubtitle="Kids' Collection"
      categoryDescription="Comfortable, cheerful & durable looks for boys and girls. Soft cotton fabrics, flexible denims, graphic t-shirts, and celebration party frocks."
      bannerImage="/images/categories/kids_category.jpg"
      allLabel="All Kids"
      subcategories={KIDS_SUBCATEGORIES}
      products={products}
      whatsappNumber={settings.whatsapp_number}
    />
  );
}
