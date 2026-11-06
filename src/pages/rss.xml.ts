import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, href } from '../lib/content';
import { site } from '../site.config';

export async function GET(context: APIContext) {
  const posts = await getPosts();

  return rss({
    title: site.name,
    description: site.description,
    site: new URL(href('/'), context.site),
    items: posts.map((post) => ({
      title: post.title,
      description: post.description,
      link: post.url,
      pubDate: post.date,
      categories: post.tags,
    })),
  });
}
