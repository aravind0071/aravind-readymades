export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface StoreSettings {
  id: string;
  shop_name: string;
  tagline: string;
  subtagline: string;
  phone_primary: string;
  phone_secondary: string;
  whatsapp_number: string;
  address_line: string;
  city: string;
  postal_code: string;
  state: string;
  country: string;
  opening_hours: string;
  maps_url: string;
  about_text: string;
  hero_image_url: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  discount_text: string;
  badge_label: string;
  banner_image_url: string;
  is_active: boolean;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_primary: boolean;
  colour?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  subcategory_id?: string;
  price: number;
  discount_price?: number;
  product_code: string;
  sizes: string[];
  colours: string[];
  stock_status: StockStatus;
  featured: boolean;
  new_arrival: boolean;
  offer_id?: string;
  published: boolean;
  display_order: number;
  images: ProductImage[];
  category?: Category;
  subcategory?: Subcategory;
  created_at: string;
}
