-- Quick check to see if new columns exist
-- Run this in Supabase SQL Editor to verify your schema

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND column_name IN (
    'howToUseImage', 
    'faqImage', 
    'themeColor',
    'benefits',
    'whyItWorks',
    'scienceDescription',
    'scienceImage',
    'howToUse',
    'labNotes',
    'labNotesImage',
    'faq',
    'ingredients'
  )
ORDER BY column_name;

-- If this returns 0 rows, you need to run the migration
-- If this returns rows, your schema is updated

