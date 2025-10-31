# Database Setup Instructions

## 1. Update Supabase Schema

You have two options:

### Option A: If you're creating the database fresh
Run the entire `supabase-schema.sql` file in Supabase SQL Editor.

### Option B: If you already have a products table (Migration)
Run `supabase-migration.sql` in Supabase SQL Editor to add the new columns:

```sql
-- This adds all the new product fields to your existing table
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
ALTER TABLE products ADD COLUMN IF NOT EXISTS ingredients JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "qualityClaims" JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS reviews JSONB DEFAULT '[]'::jsonb;
```

## 2. What's Fixed

✅ **Delete Products**: Products removed in admin panel are now deleted from Supabase database  
✅ **Color Picker**: Fixed validation and saving - hex colors are properly validated  
✅ **Image Upload**: Drag & drop component created (converts to base64 data URL for now)  
✅ **Template Display**: All sections now properly show when data exists  
✅ **Database Fields**: All new fields are saved to Supabase  

## 3. Image Upload Notes

The image upload component currently:
- Converts files to base64 data URLs (works but not ideal for production)
- Falls back to URL input if upload fails
- Supports drag & drop and file picker

**For Production**: You should implement Supabase Storage upload. The component is ready - you just need to update the upload logic in `ImageUpload.tsx` to use Supabase Storage client.

## 4. Testing

After running the migration:
1. Go to `/admin/products`
2. Edit a product and:
   - Pick a theme color (e.g., `#3d5b81` for blue, `#ee6b4d` for orange)
   - Add benefits with images (drag & drop works)
   - Fill in all template sections
   - Save and check it persists in Supabase
3. Delete a product and verify it's removed from database
4. Check the product page - all sections should display

