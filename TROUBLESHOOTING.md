# Troubleshooting: Products Not Saving

## Issue: Created a product but nothing changed in database or website

### Step 1: Check if Supabase Migration is Run

Run this SQL in Supabase SQL Editor:

```sql
-- Check if new columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND column_name IN ('howToUseImage', 'faqImage', 'themeColor', 'ingredients')
ORDER BY column_name;
```

**If this returns 0 rows or missing columns**, you need to run the migration.

### Step 2: Run the Migration

1. Open Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `supabase-migration.sql`
3. Click **Run**
4. You should see "Success. No rows returned" (this is normal)

### Step 3: Verify Supabase Connection

Check if your environment variables are set:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify you have:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_ANON_KEY` - Your Supabase key

### Step 4: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try saving a product in admin panel
4. Look for error messages

Common errors:
- `column "howToUseImage" does not exist` → Need to run migration
- `Failed to save products` → Check Supabase connection
- Network errors → Check Vercel deployment

### Step 5: Test the API Directly

Open browser console and run:

```javascript
fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    products: [{
      id: 'test-product',
      name: 'Test Product',
      slug: 'test-product',
      description: 'Test',
      longDescription: 'Test description',
      price: 10,
      image: '/test.jpg',
      gallery: [],
      category: 'Mineral',
      highlights: [],
      sku: 'TEST-001',
      stock: 0,
      reorderPoint: 0,
      allowBackorder: false,
      status: 'active',
      seo: { title: '', description: '', keywords: [] }
    }]
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

This will show you the exact error message.

### Step 6: Check Supabase Logs

1. Go to Supabase Dashboard → Logs
2. Check for errors related to products table
3. Look for column errors or permission issues

## Quick Fix Checklist

- [ ] Run `supabase-migration.sql` in Supabase SQL Editor
- [ ] Verify environment variables in Vercel
- [ ] Check browser console for errors
- [ ] Verify Supabase connection (test with `/api/health`)
- [ ] Make sure you clicked "Save changes" button in admin panel
- [ ] Check that product status is set to "active" (not "draft")

