-- Seed Supabase with initial products
-- Run this in Supabase SQL Editor after creating the tables
-- This includes all product data with full descriptions and all template fields

INSERT INTO products (
  id, name, slug, description, "longDescription", price, image, gallery, category, highlights, 
  sku, stock, "reorderPoint", "allowBackorder", status, seo,
  "themeColor", rating, "reviewCount", benefits, "whyItWorks", "howToUse", 
  "scienceDescription", "scienceImage", "labNotes", "labNotesImage", faq,
  ingredients, "qualityClaims", reviews
)
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
  '{"title":"Absorbable Calm Magnesium Bisglycinate | Orbucell","description":"Shop Absorbable Calm, a pharmacist-formulated magnesium bisglycinate that supports relaxation, cardiovascular health, and metabolic balance without digestive upset.","keywords":["magnesium bisglycinate","magnesium glycinate supplement","relaxation support"],"ogImage":"/images/magnesium-og.png","canonicalUrl":"https://orbucell.com/products/magnesium-bisglycinate"}'::jsonb,
  '#3d5b81',
  4.8,
  1200,
  '[
    {"title": "Promotes relaxation and mood stability", "detail": "Magnesium helps modulate neurotransmitters and may reduce feelings of anxiety.", "image": null},
    {"title": "Supports heart health", "detail": "Adequate magnesium intake is associated with healthy heart rhythms and may lower the risk of cardiovascular disease.", "image": null},
    {"title": "Aids blood-sugar regulation", "detail": "Research suggests magnesium glycinate may help manage blood sugar in people with diabetes and could lower the risk of developing type 2 diabetes.", "image": null},
    {"title": "Strengthens bones", "detail": "Magnesium plays a role in bone mineralisation alongside calcium and vitamin D.", "image": null}
  ]'::jsonb,
  '[
    {"title": "High bioavailability", "detail": "Combining magnesium with the amino acid glycine shields the mineral during digestion, allowing efficient absorption."},
    {"title": "Gentle on digestion", "detail": "This form is less likely to cause loose stools or stomach upset."},
    {"title": "Glycine synergy", "detail": "Glycine itself is a calming amino acid; its presence may enhance relaxation benefits."}
  ]'::jsonb,
  '[
    "Dose: Follow the recommended serving on the label (usually 1-2 capsules or a scoop of powder providing around 100-200 mg elemental magnesium).",
    "Timing: Many people prefer to take magnesium in the evening to unwind, but it can be taken any time. Consistency matters more than timing.",
    "With or without food: Magnesium bisglycinate can be taken on an empty stomach or with meals. If you notice any digestive discomfort, take it with food."
  ]'::jsonb,
  'Our Absorbable Calm supplement delivers a gentle, chelated form of magnesium called magnesium bisglycinate (also known as magnesium glycinate). Unlike some forms of magnesium, this chelate is easily absorbed and typically free from the laxative effects associated with magnesium oxide or citrate. Magnesium is an essential mineral involved in over 300 enzymatic reactions, including nerve and muscle function, energy production, and hormonal balance. Unfortunately, many adults consume less magnesium than recommended; supplementation can help bridge this gap.

When magnesium is chelated to glycine (an amino acid), it becomes more bioavailable and gentler on the digestive system. This form is particularly suitable for those who experience digestive issues with other magnesium supplements. Glycine itself has calming properties and may enhance the relaxation benefits of magnesium.',
  null,
  'Tested for heavy metals, pesticides, and allergens. Made in a cGMP facility in Canada. Vegan, gluten-free, non-GMO.',
  null,
  '[
    {"question": "Do I need magnesium if I eat a balanced diet?", "answer": "Whole foods like leafy greens, nuts, and legumes provide magnesium, yet surveys indicate many adults do not meet the recommended daily intake. Supplements can help fill the gap."},
    {"question": "Will it make me sleepy?", "answer": "Magnesium is not a sedative but supports relaxation. Some people feel calmer and sleep better; others experience no noticeable change. Adjust dosing time based on your personal experience."},
    {"question": "Is magnesium bisglycinate safe during pregnancy?", "answer": "Magnesium is important during pregnancy, but you should consult a healthcare provider to determine the right dose for your situation."},
    {"question": "Can I take it with medications?", "answer": "Magnesium can interact with certain drugs, including some antibiotics or bisphosphonates. Take medications at least two hours apart and ask your pharmacist for guidance."}
  ]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb
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
  '{"title":"Gentle Gut Harmony Psyllium Fiber | Orbucell","description":"Meet Gentle Gut Harmony, our organic psyllium fiber that balances digestion, cholesterol, and blood sugar while feeding a resilient microbiome.","keywords":["psyllium fiber supplement","soluble fiber","gut health support"],"ogImage":"/images/fiber-og.png","canonicalUrl":"https://orbucell.com/products/organic-psyllium-fiber"}'::jsonb,
  '#ee6b4d',
  4.6,
  980,
  '[
    {"title": "Relieves constipation", "detail": "Psyllium acts as a bulk-forming laxative, binding to partially digested food and increasing stool moisture.", "image": null},
    {"title": "Eases mild diarrhea", "detail": "The gel-forming fiber helps firm loose stools and slows their passage through the colon.", "image": null},
    {"title": "Promotes heart health", "detail": "Soluble fiber binds to cholesterol in the gut, aiding its excretion and lowering total and LDL cholesterol to reduce cardiovascular risk.", "image": null},
    {"title": "Helps manage blood sugar", "detail": "Psyllium slows carbohydrate absorption, leading to more stable blood-sugar levels and better glycemic control.", "image": null}
  ]'::jsonb,
  '[
    {"title": "Pure & natural", "detail": "Sourced from non-GMO Plantago ovata seeds with no artificial sweeteners or fillers."},
    {"title": "Versatile formats", "detail": "Choose a fine powder to stir into liquids or convenient capsules for travel."},
    {"title": "Certified quality", "detail": "Every batch is third-party tested for purity, heavy metals and microbiological safety."}
  ]'::jsonb,
  '[
    "Start slowly: Begin with 1 teaspoon (roughly 5 g) of psyllium powder or the equivalent in capsules once daily. Increase gradually to 10-15 g per day as tolerated.",
    "Mix and drink immediately: Stir powder into 8-12 ounces of water or juice and drink promptly. The mixture thickens as it sits.",
    "Hydrate: Follow with an additional glass of water. Adequate hydration is essential to prevent choking and promote proper fiber movement."
  ]'::jsonb,
  'Our Gentle Gut Harmony supplement harnesses the power of psyllium husk, a natural soluble fiber derived from Plantago ovata seeds. When mixed with water, psyllium absorbs liquid and forms a soft gel that moves through the digestive tract. This gel adds bulk to stools to relieve constipation and firms loose stools to ease mild diarrhea. Beyond digestive comfort, psyllium fiber has been shown to help regulate blood sugar and lower cholesterol levels.',
  null,
  'Always pair psyllium with adequate hydration and increase the serving gradually to minimize gas or bloating.',
  null,
  '[
    {"question": "Can psyllium replace dietary fiber?", "answer": "No. Psyllium supplements daily intake but does not replace the fiber you get from fruits, vegetables, whole grains, and legumes."},
    {"question": "Is psyllium safe for long-term use?", "answer": "Yes - when taken with sufficient water, psyllium is safe for most adults. If you experience persistent bloating, reduce the dose or speak with a healthcare professional."},
    {"question": "Does it interact with medications?", "answer": "Psyllium can slow the absorption of certain medications. Take medications at least two hours before or after your fiber supplement."},
    {"question": "Is psyllium gluten-free?", "answer": "Yes. Psyllium husk is naturally gluten-free and suitable for vegan, kosher, and halal diets."}
  ]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb
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
  seo = EXCLUDED.seo,
  "themeColor" = EXCLUDED."themeColor",
  rating = EXCLUDED.rating,
  "reviewCount" = EXCLUDED."reviewCount",
  benefits = EXCLUDED.benefits,
  "whyItWorks" = EXCLUDED."whyItWorks",
  "howToUse" = EXCLUDED."howToUse",
  "scienceDescription" = EXCLUDED."scienceDescription",
  "scienceImage" = EXCLUDED."scienceImage",
  "labNotes" = EXCLUDED."labNotes",
  "labNotesImage" = EXCLUDED."labNotesImage",
  faq = EXCLUDED.faq,
  ingredients = EXCLUDED.ingredients,
  "qualityClaims" = EXCLUDED."qualityClaims",
  reviews = EXCLUDED.reviews;

