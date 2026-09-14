# Deployment

## Primary host: GitHub Pages

The public portfolio demo is static and hosted on GitHub Pages so anyone can visit without a Vercel login.

### Configure Pages (one-time)

1. Open the repo on GitHub → **Settings → Pages**
2. **Build and deployment → Source**: Deploy from a branch
3. **Branch**: `gh-pages`
4. **Folder**: `/ (root)`
5. Save

Public URL:

`https://astridbonoan.github.io/straphanger-NYC.io/`

### Automatic deploys

Workflow: `.github/workflows/pages.yml`

On every push to `main` (or manual workflow dispatch):

1. `npm ci`
2. `npm run build:pages` (static export + basePath)
3. Add `out/.nojekyll`
4. Publish `out/` to the `gh-pages` branch via `peaceiris/actions-gh-pages`

### Local static build

```bash
npm run build:pages
```

Output is written to `out/`.

## What works on Pages

- Browse catalog / product pages
- Cart + wishlist (localStorage)
- Demo login / account / admin UI
- Demo checkout confirmation (no real payment)

## What Pages cannot host

- Stripe Checkout Session API + webhooks
- Supabase Auth cookie sessions / RLS-backed APIs
- Next.js Route Handlers / Server Actions

Those integrations remain in the codebase for documentation and a future dynamic host, but the shipped demo path is static.

## Optional future: Vercel

Vercel is **not** required for this demo. If you later need live Stripe/Supabase, deploy a dynamic Next.js build separately and keep GitHub Pages as the public portfolio snapshot.
