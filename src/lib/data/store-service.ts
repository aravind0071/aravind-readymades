import { INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_OFFERS, INITIAL_PRODUCTS } from './initial-data';
import { DEFAULT_STORE_SETTINGS } from '../constants/store-defaults';
import { Product, Category, Subcategory, Offer, StoreSettings } from '../supabase/types';

// In-memory runtime state for instant responsiveness and offline/fallback capability
let inMemoryProducts: Product[] = [...INITIAL_PRODUCTS];
let inMemoryCategories: Category[] = [...INITIAL_CATEGORIES];
let inMemoryOffers: Offer[] = [...INITIAL_OFFERS];
let inMemorySettings: StoreSettings = { ...DEFAULT_STORE_SETTINGS };

export async function getStoreSettings(): Promise<StoreSettings> {
  return inMemorySettings;
}

export async function updateStoreSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
  inMemorySettings = { ...inMemorySettings, ...updates };
  return inMemorySettings;
}

export async function getCategories(): Promise<Category[]> {
  return inMemoryCategories.sort((a, b) => a.display_order - b.display_order);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return inMemoryCategories.find((c) => c.slug === slug);
}

export async function getSubcategories(categoryId?: string): Promise<Subcategory[]> {
  if (categoryId) {
    return INITIAL_SUBCATEGORIES.filter((s) => s.category_id === categoryId);
  }
  return INITIAL_SUBCATEGORIES;
}

export async function getOffers(): Promise<Offer[]> {
  return inMemoryOffers.filter((o) => o.is_active);
}

export async function getAllOffers(): Promise<Offer[]> {
  return inMemoryOffers;
}

export async function createOffer(offerData: Omit<Offer, 'id'>): Promise<Offer> {
  const newOffer: Offer = {
    ...offerData,
    id: `offer-${Date.now()}`,
  };
  inMemoryOffers.push(newOffer);
  return newOffer;
}

export async function updateOffer(id: string, updates: Partial<Offer>): Promise<Offer | null> {
  const index = inMemoryOffers.findIndex((o) => o.id === id);
  if (index === -1) return null;
  inMemoryOffers[index] = { ...inMemoryOffers[index], ...updates };
  return inMemoryOffers[index];
}

export async function deleteOffer(id: string): Promise<boolean> {
  const initialLength = inMemoryOffers.length;
  inMemoryOffers = inMemoryOffers.filter((o) => o.id !== id);
  return inMemoryOffers.length < initialLength;
}

export async function getProducts(options?: {
  categoryId?: string;
  categorySlug?: string;
  subcategorySlug?: string;
  featuredOnly?: boolean;
  newArrivalsOnly?: boolean;
  searchQuery?: string;
  inStockOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}): Promise<Product[]> {
  let list = inMemoryProducts.filter((p) => p.published);

  if (options?.categorySlug) {
    const cat = inMemoryCategories.find((c) => c.slug === options.categorySlug);
    if (cat) {
      list = list.filter((p) => p.category_id === cat.id);
    }
  } else if (options?.categoryId) {
    list = list.filter((p) => p.category_id === options.categoryId);
  }

  if (options?.subcategorySlug) {
    const sub = INITIAL_SUBCATEGORIES.find((s) => s.slug === options.subcategorySlug);
    if (sub) {
      list = list.filter((p) => p.subcategory_id === sub.id);
    }
  }

  if (options?.featuredOnly) {
    list = list.filter((p) => p.featured);
  }

  if (options?.newArrivalsOnly) {
    list = list.filter((p) => p.new_arrival);
  }

  if (options?.inStockOnly) {
    list = list.filter((p) => p.stock_status !== 'out_of_stock');
  }

  if (options?.minPrice !== undefined) {
    list = list.filter((p) => (p.discount_price ?? p.price) >= options.minPrice!);
  }

  if (options?.maxPrice !== undefined) {
    list = list.filter((p) => (p.discount_price ?? p.price) <= options.maxPrice!);
  }

  if (options?.searchQuery) {
    const q = options.searchQuery.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.product_code.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.colours.some((c) => c.toLowerCase().includes(q))
    );
  }

  // Populate category references
  list = list.map((p) => ({
    ...p,
    category: inMemoryCategories.find((c) => c.id === p.category_id),
    subcategory: INITIAL_SUBCATEGORIES.find((s) => s.id === p.subcategory_id),
  }));

  if (options?.sortBy === 'price-asc') {
    list.sort((a, b) => (a.discount_price ?? a.price) - (b.discount_price ?? b.price));
  } else if (options?.sortBy === 'price-desc') {
    list.sort((a, b) => (b.discount_price ?? b.price) - (a.discount_price ?? a.price));
  } else if (options?.sortBy === 'popular') {
    list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  } else {
    // Default newest
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return list;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const prod = inMemoryProducts.find((p) => p.slug === slug);
  if (!prod) return undefined;

  return {
    ...prod,
    category: inMemoryCategories.find((c) => c.id === prod.category_id),
    subcategory: INITIAL_SUBCATEGORIES.find((s) => s.id === prod.subcategory_id),
  };
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const prod = inMemoryProducts.find((p) => p.id === id);
  if (!prod) return undefined;
  return {
    ...prod,
    category: inMemoryCategories.find((c) => c.id === prod.category_id),
    subcategory: INITIAL_SUBCATEGORIES.find((s) => s.id === prod.subcategory_id),
  };
}

export async function createProduct(productData: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
  const newProduct: Product = {
    ...productData,
    id: `prod-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  inMemoryProducts.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const index = inMemoryProducts.findIndex((p) => p.id === id);
  if (index === -1) return null;
  inMemoryProducts[index] = { ...inMemoryProducts[index], ...updates };
  return inMemoryProducts[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const initialLength = inMemoryProducts.length;
  inMemoryProducts = inMemoryProducts.filter((p) => p.id !== id);
  return inMemoryProducts.length < initialLength;
}

export async function getAdminDashboardStats() {
  const total = inMemoryProducts.length;
  const available = inMemoryProducts.filter((p) => p.stock_status === 'in_stock').length;
  const outOfStock = inMemoryProducts.filter((p) => p.stock_status === 'out_of_stock').length;
  const newArrivals = inMemoryProducts.filter((p) => p.new_arrival).length;
  const activeOffers = inMemoryOffers.filter((o) => o.is_active).length;

  return {
    totalProducts: total,
    availableProducts: available,
    outOfStock,
    categoriesCount: inMemoryCategories.length,
    newArrivals,
    activeOffers,
  };
}
