# Orbucell — React + Vite + Tailwind + Vercel Functions + Supabase

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase (Optional but Recommended)

The app uses Supabase as the primary database with file storage as a fallback.

**Steps:**

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the schema in Supabase SQL Editor:
   - Open `supabase-schema.sql` in your editor
   - Copy and paste the entire file into Supabase SQL Editor
   - Click "Run" to create all tables

3. Get your Supabase credentials:
   - Go to Project Settings → API
   - Copy your Project URL and API keys

4. Set environment variables in Vercel:
   - Go to your Vercel project → Settings → Environment Variables
   - Add the following:
     - `SUPABASE_URL` - Your Supabase project URL
     - `SUPABASE_SERVICE_ROLE_KEY` - Your service_role key (for admin operations)
     - `SUPABASE_ANON_KEY` - Your anon/public key (optional fallback)

5. For local development, create a `.env.local` file:
   ```bash
   SUPABASE_URL=your-project-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_ANON_KEY=your-anon-key
   ```

### 3. Seed Initial Data (Optional)

After creating tables, run `supabase-seed.sql` in Supabase SQL Editor to add initial products.

## Develop

```bash
npm install
npm run dev
```

For local API development with Vercel:
```bash
npx vercel dev
```

Then in another terminal:
```bash
npm run dev
```

## Build

```bash
npm run build
```

## API (Vercel Functions)

Endpoints (deployed under `/api/*`):

- GET `/api/health` → `{ ok: true }`
- GET `/api/products` → returns all products
- GET `/api/products?id=PRODUCT_ID` → returns a single product
- GET `/api/posts` → returns all blog posts
- GET `/api/posts?slug=POST_SLUG` → returns a single post
- GET `/api/customers` → returns all customers
- GET `/api/inventory` → returns all inventory items
- GET `/api/orders` → returns all orders
- POST `/api/products` → body: `{ products: Product[] }` → saves products
- POST `/api/posts` → body: `{ posts: BlogPost[] }` → saves posts
- POST `/api/customers` → body: `{ customers: Customer[] }` → saves customers
- POST `/api/inventory` → body: `{ inventory: InventoryItem[] }` → saves inventory
- POST `/api/orders` → body: `{ orders: Order[] }` → saves orders
- POST `/api/checkout` → body: `{ items: [{ id: string, qty: number }] }` → returns mock order summary

## Database Strategy

The app uses a **Supabase-first** approach:

1. **Primary**: Queries Supabase for data
2. **Fallback**: If Supabase is unavailable or missing env vars, falls back to file-based storage (`data/content.json`)

This ensures:
- Production uses Supabase (persistent, scalable)
- Development works without Supabase (local file fallback)
- Data migration is seamless (file storage → Supabase)

## Notes

- CORS is enabled for demo; restrict origins in production.
- Checkout totals use server-side pricing from the catalog.
- Admin panel available at `/admin` (login with `admin@orbucell.com`)
