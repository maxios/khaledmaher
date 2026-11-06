import type { APIContext } from 'astro';
import { href } from '../lib/content';

export function GET(context: APIContext) {
  const sitemap = new URL(href('/sitemap-index.xml'), context.site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`);
}
