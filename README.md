# Dona Paula View Point Guide

Independent, non-profit visitor information landing site for Dona Paula View Point / Dona Paula Jetty, Panaji, Goa, India.

## Stack

- Astro 7.2.6
- Tailwind CSS 4.3.3 via `@tailwindcss/vite` 4.3.3
- TypeScript 6.0.3 (within `@astrojs/check` 0.9.10 peer range `^5 || ^6`)
- pnpm 11.23.0 (pinned with `packageManager`)
- Node.js 24.19.0 LTS (pinned in `engines` and `.node-version`)
- Cloudflare Workers static-assets deployment via Wrangler 4.125.0
- No database, login or CMS

## Domain configuration

The canonical production origin is **hard-coded** to `https://donapaulagoa.com` in `astro.config.mjs` so that canonical URLs, absolute Open Graph URLs and the sitemap are always emitted. It can be overridden locally with `PUBLIC_SITE_URL`:

```bash
PUBLIC_SITE_URL=https://your-final-domain.in pnpm build
```

All entity facts (attraction name, city, state, country, coordinates, Google Maps links, nearby landmarks, official tourism portal) live in **one place only**: `src/data/site.ts`. Edit that file to retarget the site.

## Commands

```bash
corepack enable
corepack prepare pnpm@11.23.0 --activate
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm deploy
```

Cloudflare Workers serves `./dist` as static assets using `wrangler.jsonc`.

## Cookie / analytics implementation

GA4 measurement ID `G-HXM22WWPKP` is present, but the Google Analytics script is loaded only after the visitor explicitly enables Analytics on `/cookies/`. The default is off. Necessary preference storage uses `localStorage`.

## Content and source notes

Primary research sources used in the editorial copy:

- Government of Goa, Department of Information & Publicity: 2023 Dona Paula Coastal Circuit II / jetty redevelopment notice.
- Government of Goa: Cabo Raj Niwas history.
- Lok Bhavan Goa: chapel and Paula Menezes historical/legend discussion.
- Goa Tourism Development Corporation: Dona Paula listing and package fee reference.
- Kadamba Transport Corporation: Panaji electric-bus route including Dona Paula Circle.
- Google Maps listing supplied by the project brief for rating/review count and embedded location.

The history section intentionally labels the romantic/suicide narratives as folklore/conjecture rather than proven fact.

## Photography

The live design uses genuine location photography through source-hosted image URLs rather than AI-generated images:

- Dona Paula sunset (hero background): Hinterscapes source image.
- Supporting Dona Paula photographs: Wikimedia Commons file redirects; photographer/licence details are listed on each Commons source page.

This execution environment could not fetch remote binary assets into the build workspace, so the photo files are **not copied into `public/images`**. For a production publication that requires zero external image requests, download licensed originals, keep the author/licence attribution, place them under `public/images`, and replace the three CSS URLs in `src/styles/global.css`.

### Generated brand assets

`scripts/gen-assets.py` (run with `python scripts/gen-assets.py`) produces locally:

- `public/images/hero.jpg` (1600×900) — a brand **cover** (gradient + wordmark), used for the JSON-LD `image` node and the About figure. It is an illustration, not a photograph.
- `public/images/og-cover.jpg` (1200×630) — the social share image (`og:image`).
- `public/icons/icon-192.png`, `public/icons/icon-512.png`, `public/icons/icon-512-maskable.png` — PWA icons, drawn from the logo palette.

## PWA support

The site ships a Progressive Web App layer:

- `public/site.webmanifest` — name, theme colour, display `standalone`, icon set.
- `public/sw.js` — network-first for pages (with offline fallback to the cached home page), cache-first for static assets. Registered by `BaseLayout.astro` on load.
- `public/icons/*` — the icon set referenced by the manifest.

`BaseHead.astro` links the manifest and sets `theme-color` / `apple-mobile-web-app-*` tags.

## Weather module

`src/components/WeatherSection.astro` shows current conditions and a 7-day forecast for the attraction's coordinates.

- It is a server component: at build time it fetches the Open-Meteo forecast API (no key required) and renders the result directly into the static HTML, so the page is useful even before JavaScript runs.
- A small inline client script then refreshes the data live in the visitor's browser and caches it in `sessionStorage` for 30 minutes, updating a "Live · updated HH:MM" status line.
- No API key, account or third-party identifier is shown to visitors; the implementation detail stays in code only.

## Editorial / content model

The page is organised as a professional, non-profit visitor-information landing page:

- **Entity sections** — About, History & Significance, Location & how to visit, Landmarks & attractions, Visitor services & facilities.
- **Planning** — Facilities (type-neutral, no brand names), Transport (airport / bus / taxi / walk, with a modes-at-a-glance table), Weather, Itineraries (half-day / full-day, plus families / photography / low-mobility), Seasonal visiting strategy (Goa climate normals + sea conditions + wildlife).
- **Trust** — FAQ (with `FAQPage` schema), Sources & editorial method, Responsible / coastal-science section.

All fast-changing facts (fees, hours, ratings, weather) are flagged as changeable and sourced from public/government material where possible.

## Pre-deployment verification

Required clean-environment sequence:

```bash
rm -rf node_modules dist .astro
CI=1 corepack pnpm install --frozen-lockfile
pnpm check
pnpm build
grep -RIE "example\\.com|localhost|chrome-extension://" dist && exit 1 || true
```

If a real `PUBLIC_SITE_URL` is configured, inspect generated sitemap URLs before deployment. When `PUBLIC_SITE_URL` is blank, no sitemap is generated by design.

## Editorial policy

- English (`en-IN`) only; no mixed UI languages.
- Commercial services are described by type, not by individual merchant name.
- Fees, opening hours, ratings, transport and access are marked as changeable where appropriate.
- Official/public sources take precedence over travel blogs for factual claims.
