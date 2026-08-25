import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const rawSite = process.env.PUBLIC_SITE_URL?.trim();
const site = rawSite ? rawSite.replace(/\/$/, '') : undefined;

export default defineConfig({
  site,
  output: 'static',
  integrations: site ? [sitemap()] : [],
  vite: { plugins: [tailwindcss()] },
  build: { format: 'directory' }
});
