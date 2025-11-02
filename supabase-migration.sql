-- Migration: Add new product template fields to existing products table
-- 
-- IMPORTANT: Run this in Supabase SQL Editor if you already have a products table.
-- This adds all the fields needed for the universal product template:
-- - Theme customization (themeColor)
-- - Product sections (benefits, ingredients, FAQ, howToUse, etc.)
-- - Images for each section (scienceImage, labNotesImage, faqImage, howToUseImage)
--
-- If you're creating a fresh database, use supabase-schema.sql instead.

ALTER TABLE products ADD COLUMN IF NOT EXISTS "themeColor" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "reviewCount" INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS benefits JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "whyItWorks" JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "howToUse" JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "scienceDescription" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "scienceImage" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "labNotes" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "labNotesImage" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "faqImage" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS ingredients JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "howToUseImage" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "qualityClaims" JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS reviews JSONB DEFAULT '[]'::jsonb;

-- Fix: Ensure columns allow NULL values and have proper defaults
-- Run these if you get "null value" errors after adding columns
ALTER TABLE products ALTER COLUMN ingredients DROP NOT NULL;
ALTER TABLE products ALTER COLUMN ingredients SET DEFAULT '[]'::jsonb;
ALTER TABLE products ALTER COLUMN benefits DROP NOT NULL;
ALTER TABLE products ALTER COLUMN benefits SET DEFAULT '[]'::jsonb;
ALTER TABLE products ALTER COLUMN "whyItWorks" DROP NOT NULL;
ALTER TABLE products ALTER COLUMN "whyItWorks" SET DEFAULT '[]'::jsonb;
ALTER TABLE products ALTER COLUMN "howToUse" DROP NOT NULL;
ALTER TABLE products ALTER COLUMN "howToUse" SET DEFAULT '[]'::jsonb;
ALTER TABLE products ALTER COLUMN faq DROP NOT NULL;
ALTER TABLE products ALTER COLUMN faq SET DEFAULT '[]'::jsonb;
ALTER TABLE products ALTER COLUMN "qualityClaims" DROP NOT NULL;
ALTER TABLE products ALTER COLUMN "qualityClaims" SET DEFAULT '[]'::jsonb;
ALTER TABLE products ALTER COLUMN reviews DROP NOT NULL;
ALTER TABLE products ALTER COLUMN reviews SET DEFAULT '[]'::jsonb;

