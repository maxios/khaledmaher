import { type RemarkPlugin, unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import remarkSmartypants from 'remark-smartypants';
import { remarkObsidian } from './src/vault/remark';
import { getVault } from './src/vault/vault';

// Set these to build for another address. Canonical URLs follow `SITE_URL`.
const site = process.env.SITE_URL || 'https://khaledmaher.com';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [
    react(),
    sitemap({
      // Tag pages are `noindex`, so listing them would send search engines mixed signals.
      filter: (page) => !new URL(page).pathname.includes('/tags/'),
      serialize(item) {
        const path = new URL(item.url).pathname;
        const note = getVault().notes.find((entry) => entry.url && path.endsWith(entry.url));
        if (note?.lastModified) item.lastmod = new Date(note.lastModified).toISOString();
        return item;
      },
    }),
  ],
  markdown: {
    processor: unified({
      // Off by default and re-added last: it runs before user plugins, and it
      // would curl the apostrophe in [[Don't stop]] so the link stops resolving.
      smartypants: false,
      remarkPlugins: [[remarkObsidian, { base }], remarkSmartypants as RemarkPlugin],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
