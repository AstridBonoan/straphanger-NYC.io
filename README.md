# Straphanger NYC

New York streetwear merch **demo**.

**Hold on. We're moving.**

Clothes for the ones hanging from the bar at 8am and 2am — Canal Street tees, delayed-train hoodies, and platform accessories packed in Brooklyn.

## Live demo (GitHub Pages)

Public demo URL:

**https://astridbonoan.github.io/b-c-merchstore.io-/**

Hosted with **GitHub Pages → Deploy from branch (`gh-pages`)**. No Vercel login required for visitors.

> This is a static portfolio demo. Checkout completes without real charges. Auth/admin use a browser-local demo session.

## Features

- Storefront: home, shop (filters/sort), product detail, about, contact
- Persistent guest cart + wishlist (localStorage)
- Demo auth + customer account + admin dashboard
- Demo checkout with seed-price/inventory validation
- Vitest unit/component tests + Playwright smoke tests
- GitHub Actions CI + automatic Pages deploy on `main`

## Tech stack

Next.js (static export) · React · TypeScript · Tailwind CSS · Zustand · Zod · Vitest · Playwright · GitHub Actions · GitHub Pages

## Local development

```bash
git clone https://github.com/AstridBonoan/b-c-merchstore.io-.git
cd b-c-merchstore.io-
npm install
cp .env.example .env.local
# For local `npm run dev`, leave NEXT_PUBLIC_BASE_PATH empty/unset
npm run dev
```

### Demo accounts

| Role | Action |
| --- | --- |
| Admin | `/login` → **Admin demo** |
| Customer | `/login` → **Customer demo** |

## Scripts

```bash
npm run dev          # local development (no basePath)
npm run build:pages  # static export for GitHub Pages
npm run lint
npm run typecheck
npm run test
```

## GitHub Pages setup

1. Repo **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: **`gh-pages`** / folder: **`/` (root)**
4. Save

Pushing to `main` runs `.github/workflows/pages.yml`, which:

1. Builds the static export with base path `/b-c-merchstore.io-`
2. Publishes the `out/` folder to the `gh-pages` branch

Manual run: Actions → **Deploy GitHub Pages** → Run workflow.

## Architecture notes

- Static hosting cannot run Next.js API routes, server actions, or Stripe webhooks
- Demo auth is stored in `localStorage` (`bc-demo-session`)
- Product catalog comes from seed data so the storefront works offline of Supabase
- Optional Supabase/Stripe wiring remains in `lib/` and `supabase/` for a future dynamic host

See `docs/` for architecture, database, deployment, testing, and git workflow.
