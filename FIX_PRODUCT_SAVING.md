# Fix: Products Not Saving to Database

## Quick Fix - Run These Steps:

### Step 1: Run Supabase Migration (REQUIRED)

**You MUST run this first before products will save!**

1. Go to **Supabase Dashboard** → Your Project → **SQL Editor**
2. Copy and paste this entire SQL:

```sql
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
```

3. Click **Run** (or press Cmd/Ctrl + Enter)
4. You should see: "Success. No rows returned" (this is normal ✅)

### Step 2: Verify Migration Worked

Run this in Supabase SQL Editor to verify:

```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND column_name IN ('howToUseImage', 'faqImage', 'ingredients')
ORDER BY column_name;
```

**Expected:** Should return 3 rows with those column names.

### Step 3: Test Saving a Product

1. Go to `/admin/products`
2. Click "Add Product"
3. Fill in at least:
   - Name: "Test Product"
   - Slug: "test-product"  
   - Description: "Test"
   - Price: 10
   - Status: "active"
4. Click **"Save changes"** (at the top, not "Save & Close")
5. Check browser console (F12) for any errors

### Step 4: Check for Errors

**In Browser Console (F12):**
- Look for red error messages
- If you see: `column "howToUseImage" does not exist` → Migration not run
- If you see: `Failed to save products` → Check Supabase connection

**In Vercel Logs:**
1. Go to Vercel Dashboard → Your Project → **Functions** tab
2. Click on latest `/api/products` call
3. Check logs for Supabase errors

### Step 5: Verify Supabase Connection

Check Vercel environment variables:
1. Vercel Dashboard → Settings → Environment Variables
2. Must have:
   - `SUPABASE_URL` = `https://your-project.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_ANON_KEY` = `your-key-here`

### Step 6: Test API Directly

Open browser console and run:

```javascript
fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    products: [{
      id: 'test-' + Date.now(),
      name: 'Test Product',
      slug: 'test-product',
      description: 'Test',
      longDescription: 'Test',
      price: 10,
      image: '',
      gallery: [],
      category: 'Mineral',
      highlights: [],
      sku: '',
      stock: 0,
      reorderPoint: 0,
      allowBackorder: false,
      status: 'active',
      seo: { title: '', description: '', keywords: [] }
    }]
  })
}).then(r => r.json()).then(console.log).catch(console.error)
```

This will show you the exact error.

## After Migration is Run:

1. Products will save to Supabase ✅
2. Navbar will update automatically (within 30 seconds)
3. Website will show new products immediately
4. All sections will work (Ingredients, FAQ, etc.)

## Common Issues:

- **"Column does not exist"** → Run migration SQL
- **"Failed to save"** → Check Supabase env variables in Vercel
- **No error but nothing saves** → Check Vercel function logs
- **Products show but sections missing** → Check that you filled in the section data

