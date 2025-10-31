-- Seed Supabase with initial products
-- Run this in Supabase SQL Editor after creating the tables

INSERT INTO products (id, name, slug, description, "longDescription", price, image, gallery, category, highlights, sku, stock, "reorderPoint", "allowBackorder", status, seo)
VALUES 
(
  'magnesium-bisglycinate',
  'Magnesium Bisglycinate',
  'magnesium-bisglycinate',
  'Highly absorbable magnesium bisglycinate crafted to support relaxation, cardiovascular rhythm, blood-sugar balance, and bone strength.',
  'Absorbable Calm delivers chelated magnesium bisglycinate (also called magnesium glycinate) for a gentle, highly bioavailable source of daily magnesium. Each serving helps regulate hundreds of enzymatic reactions connected to sleep quality, stress resilience, cardiovascular rhythm, and blood-sugar balance. We pair the mineral with the amino acid glycine, which not only aids absorption but also promotes a calm, steady mood.',
  29,
  '/images/magnesium.svg',
  '["/images/magnesium.svg"]'::jsonb,
  'Mineral',
  '["Chelated for superior absorption","Gentle on digestion","Supports calm mood and steady energy","Pharmacist-formulated quality"]'::jsonb,
  'ORB-MAG-90',
  320,
  75,
  true,
  'active',
  '{"title":"Absorbable Calm Magnesium Bisglycinate | Orbucell","description":"Shop Absorbable Calm, a pharmacist-formulated magnesium bisglycinate that supports relaxation, cardiovascular health, and metabolic balance without digestive upset.","keywords":["magnesium bisglycinate","magnesium glycinate supplement","relaxation support"],"ogImage":"/images/magnesium-og.png","canonicalUrl":"https://orbucell.com/products/magnesium-bisglycinate"}'::jsonb
),
(
  'psyllium-fiber',
  'Organic Psyllium Fiber',
  'organic-psyllium-fiber',
  'Plant-based soluble fiber that promotes regularity, supports heart health, and steadies healthy blood sugar levels.',
  'Gentle Gut Harmony harnesses 100% organic psyllium husk to deliver a soluble fiber gel that adapts to your digestive needs. It relieves constipation, firms loose stools, and nourishes the microbiome while supporting cholesterol balance and post-meal blood-sugar control. Available in powder and capsules so you can mix, sip, or swallow on the go.',
  24,
  '/images/fiber.svg',
  '["/images/fiber.svg"]'::jsonb,
  'Fiber',
  '["Promotes regularity and digestive comfort","Helps manage cholesterol and blood sugar","Supports satiety between meals","Prebiotic nourishment for the microbiome"]'::jsonb,
  'ORB-PSY-180',
  280,
  90,
  false,
  'active',
  '{"title":"Gentle Gut Harmony Psyllium Fiber | Orbucell","description":"Meet Gentle Gut Harmony, our organic psyllium fiber that balances digestion, cholesterol, and blood sugar while feeding a resilient microbiome.","keywords":["psyllium fiber supplement","soluble fiber","gut health support"],"ogImage":"/images/fiber-og.png","canonicalUrl":"https://orbucell.com/products/organic-psyllium-fiber"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  "longDescription" = EXCLUDED."longDescription",
  price = EXCLUDED.price,
  image = EXCLUDED.image,
  gallery = EXCLUDED.gallery,
  category = EXCLUDED.category,
  highlights = EXCLUDED.highlights,
  sku = EXCLUDED.sku,
  stock = EXCLUDED.stock,
  "reorderPoint" = EXCLUDED."reorderPoint",
  "allowBackorder" = EXCLUDED."allowBackorder",
  status = EXCLUDED.status,
  seo = EXCLUDED.seo;

