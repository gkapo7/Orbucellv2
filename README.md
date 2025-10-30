# Orbucell — React + Vite + Tailwind + Vercel Functions

## Develop

```bash
npm install
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
- POST `/api/checkout` → body: `{ items: [{ id: string, qty: number }] }` → returns mock order summary `{ orderId, subtotal, total }`

Notes:
- CORS is enabled for demo; restrict origins in production.
- Checkout totals use server-side pricing from the catalog.
