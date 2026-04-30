# Iris Web — Astro

Production-ready Astro rebuild of [iris-web.studio](https://iris-web.studio/).

## Project structure

```
/
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/         → one per page section
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── Portfolio.astro
│   │   ├── About.astro
│   │   ├── Services.astro
│   │   ├── Clients.astro
│   │   ├── Contact.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Layout.astro    → SEO head, GTM, structured data
│   ├── pages/
│   │   └── index.astro     → composes the page
│   ├── scripts/
│   │   └── main.js         → header, mobile menu, portfolio filter, form
│   └── styles/             → one CSS file per component
│       ├── global.css      → tokens, reset, buttons
│       ├── header.css
│       ├── hero.css
│       ├── portfolio.css
│       ├── about.css
│       ├── services.css
│       ├── clients.css
│       ├── contact.css
│       └── footer.css
├── astro.config.mjs        → site URL, sitemap integration, asset paths
├── .env.example            → GTM/GA placeholder template
└── package.json
```

## Local development

```bash
npm install        # first time only
npm run dev        # http://localhost:4321
npm run build      # production → dist/
npm run preview    # preview the built dist/ locally
```

## Configure GTM / Analytics

1. Copy `.env.example` to `.env`
2. Paste your IDs:
   ```
   PUBLIC_GTM_ID=GTM-XXXXXXX
   PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
3. Restart `npm run dev`

Behavior:
- If `PUBLIC_GTM_ID` is set → GTM is injected (head + noscript). Use GTM to add GA4, pixels, etc.
- If only `PUBLIC_GA_ID` is set → GA4 is injected directly via gtag.js
- If both are blank → nothing tracking-related is injected (clean dev runs)

The contact form already pushes a `contact_form_submit` event to `dataLayer` so you can wire it to a GTM trigger.

## SEO included

- `<title>`, meta description, canonical
- Open Graph tags (og:title, og:description, og:image, og:url, og:site_name, og:locale)
- Twitter Card (summary_large_image)
- JSON-LD structured data (Organization + WebSite)
- Theme color
- Auto-generated `sitemap-index.xml` (via `@astrojs/sitemap`)
- `public/robots.txt`

To override per page, pass props to `<Layout>`:
```astro
<Layout title="..." description="..." image="/og-services.jpg" />
```

## Build output

CSS and JS are kept as separate hashed files (no inlining):

```
dist/
├── assets/
│   ├── css/
│   └── js/
├── favicon.svg
├── robots.txt
├── sitemap-index.xml
├── sitemap-0.xml
└── index.html
```

## Deploying

Run `npm run build`, upload everything inside `dist/` to your host.

For 20i, Netlify, Vercel, or Cloudflare Pages — just point them at the `dist/` folder (or hook the repo and they'll run `npm run build` for you).

## Cleanup notes

These files are leftovers from the starter and can be safely deleted:
- `src/components/Card.astro`
- `src/styles/card.css`
- `src/styles/home.css`

Nothing imports them anymore.

## Replacing placeholders

When you're ready, swap these:
- Portfolio thumbnails → drop real screenshots into `public/portfolio/` and reference them in `Portfolio.astro` instead of the letter placeholder
- Client logos → replace text in `Clients.astro` with `<img>` tags from `public/clients/`
- `og-image.jpg` → drop a 1200×630 PNG/JPG into `public/` for social previews
- `apple-touch-icon.png` → 180×180 PNG into `public/`
- `logo.png` → 512×512 PNG in `public/` (referenced by JSON-LD)
