# Seed Database Instructions

## Quick Steps to Seed Supabase

1. **Open Supabase Dashboard**
   - Go to your Supabase project at https://app.supabase.com
   - Navigate to **SQL Editor** (in the left sidebar)

2. **Run the Seed SQL**
   - Copy the entire contents of `supabase-seed.sql`
   - Paste it into the SQL Editor
   - Click **Run** (or press Cmd/Ctrl + Enter)

3. **Verify the Products**
   - After running, you should see "Success. No rows returned" (which is normal for INSERT)
   - Go to **Table Editor** → `products` table
   - You should see 2 products: `magnesium-bisglycinate` and `psyllium-fiber`

## Alternative: Use Production API Endpoint

If your Vercel deployment is live, you can also seed via API:

```bash
curl -X POST https://your-site.vercel.app/api/seed
```

Replace `your-site.vercel.app` with your actual Vercel URL.

## What Gets Seeded

- ✅ **Magnesium Bisglycinate** - Full product data with all fields
- ✅ **Organic Psyllium Fiber** - Full product data with all fields

Both products include:
- Complete descriptions
- Pricing and inventory data
- SEO metadata
- Gallery images
- Highlights and benefits
- **Theme colors** (Blue for Magnesium, Orange for Psyllium)
- **Benefits** (4 benefits each with titles and details)
- **Why It Works** (3 items each explaining the formulation)
- **How To Use** (3 steps with detailed instructions)
- **Science Description** (Full scientific explanation)
- **Lab Notes** (Quality and testing information)
- **FAQ** (4 common questions with answers)
- **Ratings & Reviews** (Sample ratings and review counts)
- **Ingredients, Quality Claims, Reviews** (Ready for future data)

After seeding, your products will automatically appear in:
- `/products` catalog page
- `/admin/products` admin panel
- Homepage featured products
- Navigation dropdowns

