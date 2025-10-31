# How to Add Products to Database

You have **3 options** to add the magnesium and psyllium products to your database:

## Option 1: Use the Seed API Endpoint (Recommended)

This will automatically save to Supabase (if configured) or file storage.

**If using local development:**
```bash
# Start your API server first (in one terminal)
npx vercel dev

# Then in another terminal, run:
curl -X POST http://localhost:3000/api/seed
```

**If using production (Vercel):**
```bash
curl -X POST https://your-vercel-url.vercel.app/api/seed
```

## Option 2: Use Supabase SQL Editor (Best for Production)

1. Open your Supabase project
2. Go to **SQL Editor**
3. Copy the entire contents of `supabase-seed.sql`
4. Paste and click **Run**
5. Products will be inserted into Supabase

## Option 3: Use Admin Panel

1. Log in as admin (`admin@orbucell.com`)
2. Go to `/admin/products`
3. Click **"Add product"** and manually enter the products
4. Or use the import feature if available

## Verify Products Are Added

After seeding, check:
- Visit `/products` - should show both products
- Visit `/api/products` - should return both products
- Check Supabase table `products` - should have 2 rows

---

**Note:** The seed endpoint (`/api/seed`) will:
- ✅ Use Supabase if environment variables are set
- ✅ Fall back to file storage if Supabase is not available
- ✅ Work automatically without manual SQL

