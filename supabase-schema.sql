-- Orbucell Supabase Database Schema
-- Run this in Supabase SQL Editor to create all required tables

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  "longDescription" TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  image TEXT NOT NULL DEFAULT '',
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  category TEXT NOT NULL CHECK (category IN ('Mineral', 'Fiber')),
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  sku TEXT NOT NULL DEFAULT '',
  stock INTEGER NOT NULL DEFAULT 0,
  "reorderPoint" INTEGER NOT NULL DEFAULT 0,
  "allowBackorder" BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  seo JSONB NOT NULL DEFAULT '{}'::jsonb,
  "themeColor" TEXT,
  rating NUMERIC,
  "reviewCount" INTEGER,
  benefits JSONB DEFAULT '[]'::jsonb,
  "whyItWorks" JSONB DEFAULT '[]'::jsonb,
  "howToUse" JSONB DEFAULT '[]'::jsonb,
  "scienceDescription" TEXT,
  "scienceImage" TEXT,
  "labNotes" TEXT,
  "labNotesImage" TEXT,
  faq JSONB DEFAULT '[]'::jsonb,
  "faqImage" TEXT,
  ingredients JSONB DEFAULT '[]'::jsonb,
  "howToUseImage" TEXT,
  "qualityClaims" JSONB DEFAULT '[]'::jsonb,
  reviews JSONB DEFAULT '[]'::jsonb
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  image TEXT,
  date TEXT NOT NULL,
  author TEXT NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  category TEXT,
  featured BOOLEAN DEFAULT false,
  "readingTime" TEXT,
  seo JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Lead',
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  "postalCode" TEXT,
  country TEXT,
  "dateJoined" TEXT,
  "lastOrderDate" TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  "preferredProducts" JSONB DEFAULT '[]'::jsonb,
  orders INTEGER NOT NULL DEFAULT 0,
  "lifetimeValue" NUMERIC NOT NULL DEFAULT 0,
  "averageOrderValue" NUMERIC
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL,
  sku TEXT NOT NULL DEFAULT '',
  "stockOnHand" INTEGER NOT NULL DEFAULT 0,
  "stockAllocated" INTEGER NOT NULL DEFAULT 0,
  incoming INTEGER NOT NULL DEFAULT 0,
  "reorderPoint" INTEGER NOT NULL DEFAULT 0,
  supplier TEXT,
  "restockEta" TEXT,
  "warehouseLocation" TEXT,
  status TEXT NOT NULL DEFAULT 'in-stock' CHECK (status IN ('in-stock', 'low-stock', 'out-of-stock', 'backorder', 'discontinued')),
  notes TEXT
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  "orderNumber" TEXT NOT NULL UNIQUE,
  "customerId" TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  "orderedAt" TEXT NOT NULL,
  "fulfilledAt" TEXT,
  "trackingNumber" TEXT,
  "shippingMethod" TEXT,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  shipping NUMERIC NOT NULL DEFAULT 0,
  tax NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC,
  total NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory("productId");
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders("customerId");
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders("orderNumber");

