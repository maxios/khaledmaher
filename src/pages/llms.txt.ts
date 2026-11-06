import type { APIContext } from 'astro';
import { dictionary } from '../data/dictionary';
import { getPosts, href } from '../lib/content';
import { site } from '../site.config';

/** A plain-text map of the site for AI agents, following llmstxt.org. */
export async function GET(context: APIContext) {
  const url = (path: string) => new URL(href(path), context.site).href;
  const posts = await getPosts();
  const openWork = dictionary.filter((entry) => entry.href);

  const body = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `Based in ${site.city}, working in English and Arabic. Contact: ${site.email}`,
    '',
    '## Pages',
    '',
    `- [About](${url('/about/')}): who he is and what there is to show`,
    `- [Writing](${url('/writing/')}): every guide and note`,
    `- [Graph](${url('/graph/')}): how the writing links together`,
    '',
    '## Writing',
    '',
    ...posts.map((post) => `- [${post.title}](${url(post.url.replace(href('/'), '/'))}): ${post.description}`),
    '',
    '## Open work',
    '',
    ...openWork.map((entry) => `- [${entry.term}](${entry.href}): ${entry.definition}`),
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
