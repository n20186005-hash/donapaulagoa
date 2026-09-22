import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Canonical production origin. Hard-coded so that canonical URLs, absolute Open Graph
 * URLs, hreflang fallbacks and the sitemap are always emitted for donapaulagoa.com.
 * Override locally with PUBLIC_SITE_URL when needed.
 */
const SITE = 'https://donapaulagoa.com';

const rawSite = process.env.PUBLIC_SITE_URL?.trim();
const site = rawSite ? rawSite.replace(/\/$/, '') : SITE;

export default defineConfig({
  site,
  output: 'static',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  build: { format: 'directory' }
});
