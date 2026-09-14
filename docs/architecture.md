# Architecture

Straphanger NYC is a Next.js App Router merch store with a clear split between presentation and domain logic.

## Layers

1. **Routes (`src/app`)** — pages, layouts, route handlers
2. **Components (`src/components`)** — UI organized by domain
3. **Lib (`src/lib`)** — products, cart, pricing, Stripe, Supabase, auth, validation
4. **Types (`src/types`)** — shared TypeScript contracts
5. **Supabase (`supabase/`)** — schema + seed SQL

## Data mode

- **Demo mode** (default without real Supabase credentials): seed catalog, local cart/wishlist, cookie-based demo auth, demo checkout success path.
- **Connected mode**: Supabase clients + Stripe Checkout + webhook fulfillment.

`isDemoMode()` in `src/lib/utils.ts` decides which path runs.

## Checkout flow

```
Cart → POST /api/checkout
  → validate products/variants/inventory/prices server-side
  → Stripe Checkout Session (or demo redirect)
  → customer pays
  → POST /api/webhooks/stripe
  → create/update order + inventory (production)
  → /checkout/success
```

Client-provided prices are never trusted.

## AuthZ

- Customers: `/account/*` requires a session
- Admins: `/admin/*` requires `role === "admin"`
- Route proxy + server layout/page guards (defense in depth)
- RLS policies in SQL for production Supabase

## Key modules

| Module | Responsibility |
| --- | --- |
| `lib/products` | Catalog queries, seed data, pricing, inventory |
| `lib/cart` | Pure calculations + zustand store |
| `lib/stripe` | Checkout session creation |
| `lib/supabase` | Browser/server/admin clients + session refresh |
| `lib/auth` | Roles + demo session helpers |
