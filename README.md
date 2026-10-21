# Dona Paula View Point Guide

Independent English (`en-IN`) visitor guide at https://donapaulagoa.com. Existing routes: `/`, `/privacy/`, `/terms/`, `/cookies/` and a custom 404.

## Build and deployment

Astro 7.2.6, Tailwind CSS 4.3.3, TypeScript 6.0.3, pnpm 11.23.0 and Node 24.19.0. Install the committed lockfile, then run `pnpm check` and `pnpm build`. The generated `dist/` is ignored and rebuilt by Cloudflare. Wrangler 4.125.0 uses `src/worker.js` and the `ASSETS` binding; the established Cloudflare project is `donapaulagoa`. Deployment remains an explicit release action.

The Worker redirects established site-host HTTP requests and defensive www requests to HTTPS apex, preserving path/query. It normalizes index.html entrances and adds noindex to true 404 asset responses. This code does not create DNS records or bind optional aliases. No alias is declared verified merely by this defensive code.

## Editorial sources and scope

Entity identity and dated Maps details are in `src/data/site.ts`. Public sources and photograph licences are linked visibly under Sources and Photograph credits. A dated third-party hours/rating snapshot is not an unconditional schedule, admission guarantee or the site's own rating. The GTDC package fee reference is scoped as a package exclusion rather than a complete current gate tariff. Nearby destinations have separate access requirements.

## Photographs

A historical Commons photograph is served locally with visible source, author, date, licence links and display-change notices at `/#photo-credits`. It is CC BY-SA 4.0; CSS cropping and dark overlays are identified as display adaptations under the same licence. Social cover and icons are graphic brand illustrations. The previous Hinterscapes image was removed because reuse permission was not established.

## Weather and privacy

`public/weather.js` loads Open-Meteo forecast and marine estimates in the browser, validates observation freshness and forecast fields, and uses a best-effort 30-minute session cache. There is no build-time weather snapshot. Missing data is labelled unavailable and never implies safe water or favourable weather. Model data is attributed to Open-Meteo under CC BY 4.0. Stable `.wx-*` classes style client output.

`public/consent.js` defaults optional analytics to off. Withdrawal applies immediate runtime denial; regrant updates the same analytics runtime. Failed storage writes are handled, with a tab denial veto and truthful persistence notice. The privacy page describes hosting, Maps, Open-Meteo and browser storage. Legacy `/sw.js` retires only this guide's prior offline caches and unregisters itself; no new service worker is registered.
