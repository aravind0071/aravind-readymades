-- ====================================================================
-- ARAVIND READYMADES — PRODUCTION DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- Physical Readymade Clothing Store: Malikipuram, Andhra Pradesh
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Store Settings Table
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_name TEXT NOT NULL DEFAULT 'ARAVIND READYMADES',
    tagline TEXT NOT NULL DEFAULT 'Style for Everyone. Quality You Can Trust.',
    subtagline TEXT NOT NULL DEFAULT 'Ladies • Gents • Kids Wear',
    phone_primary TEXT NOT NULL DEFAULT '9959257373',
    phone_secondary TEXT NOT NULL DEFAULT '9959257272',
    whatsapp_number TEXT NOT NULL DEFAULT '9959257373',
    address_line TEXT NOT NULL DEFAULT 'Main Road, Opposite L.S. Landmark',
    city TEXT NOT NULL DEFAULT 'Malikipuram',
    postal_code TEXT NOT NULL DEFAULT '533253',
    state TEXT NOT NULL DEFAULT 'Andhra Pradesh',
    country TEXT NOT NULL DEFAULT 'India',
    opening_hours TEXT NOT NULL DEFAULT '9:30 AM - 10:00 PM',
    maps_url TEXT NOT NULL DEFAULT 'https://maps.app.goo.gl/qdkMenou5AbtXfGw8?g_st=ac',
    about_text TEXT NOT NULL DEFAULT 'Aravind Readymades is a trusted local readymade clothing store serving families with ladies, gents and kids wear in Malikipuram, East Godavari district.',
    hero_image_url TEXT DEFAULT '/images/store/storefront_hero.jpg',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Subcategories Table
CREATE TABLE IF NOT EXISTS public.subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(category_id, slug)
);

-- 4. Offers Table
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    discount_text TEXT,
    badge_label TEXT,
    banner_image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
    subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
    price NUMERIC(10, 2) NOT NULL,
    discount_price NUMERIC(10, 2),
    product_code TEXT NOT NULL UNIQUE,
    sizes TEXT[] NOT NULL DEFAULT '{}',
    colours TEXT[] NOT NULL DEFAULT '{}',
    stock_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock')),
    featured BOOLEAN DEFAULT FALSE,
    new_arrival BOOLEAN DEFAULT FALSE,
    offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
    published BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Product Images Table
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE
);

-- 7. Contact Enquiries Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products(published);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_new_arrival ON public.products(new_arrival);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);

-- Row Level Security (RLS) Setup
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public can view store settings" ON public.store_settings FOR SELECT USING (TRUE);
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (TRUE);
CREATE POLICY "Public can view subcategories" ON public.subcategories FOR SELECT USING (TRUE);
CREATE POLICY "Public can view active offers" ON public.offers FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view published products" ON public.products FOR SELECT USING (published = TRUE);
CREATE POLICY "Public can view product images" ON public.product_images FOR SELECT USING (TRUE);
CREATE POLICY "Public can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (TRUE);

-- Authenticated Admin Policies (Full Access)
CREATE POLICY "Admin full access store_settings" ON public.store_settings FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admin full access categories" ON public.categories FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admin full access subcategories" ON public.subcategories FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admin full access offers" ON public.offers FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admin full access products" ON public.products FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admin full access product_images" ON public.product_images FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admin full access contact_messages" ON public.contact_messages FOR ALL TO authenticated USING (TRUE);
