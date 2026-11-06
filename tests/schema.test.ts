import { describe, expect, test } from 'bun:test';
import {
  PERSON_ID,
  articleSchema,
  breadcrumbSchema,
  graphOf,
  personSchema,
  serializeJsonLd,
} from '../src/lib/schema';
import { site } from '../src/site.config';

const article = {
  url: 'https://khaledmaher.com/posts/a/',
  title: 'A title',
  description: 'A description',
  image: 'https://khaledmaher.com/og.png',
  published: new Date('2026-01-01'),
  tags: ['meta'],
};

describe('personSchema', () => {
  test('identifies the same person across profiles', () => {
    const person = personSchema();
    expect(person['@id']).toBe(PERSON_ID);
    expect(person.alternateName).toBe(site.nameArabic);
    expect(person.sameAs).toEqual([site.social.github, site.social.x]);
  });
});

describe('articleSchema', () => {
  test('falls back to the publish date when never updated', () => {
    const node = articleSchema(article);
    expect(node.dateModified).toBe(node.datePublished);
  });

  test('uses the update date when there is one', () => {
    const node = articleSchema({ ...article, modified: new Date('2026-02-02') });
    expect(node.dateModified).toBe('2026-02-02T00:00:00.000Z');
  });

  test('points at the shared person instead of repeating them', () => {
    expect(articleSchema(article).author).toEqual({ '@id': PERSON_ID });
  });

  test('leaves keywords out when there are no tags', () => {
    expect(articleSchema({ ...article, tags: [] })).not.toHaveProperty('keywords');
  });
});

test('breadcrumbs are numbered from one', () => {
  const list = breadcrumbSchema([
    { name: 'Home', url: 'https://a.test/' },
    { name: 'Post', url: 'https://a.test/post/' },
  ]).itemListElement as Array<{ position: number }>;
  expect(list.map((item) => item.position)).toEqual([1, 2]);
});

test('every page carries the person and the site', () => {
  const graph = graphOf({ '@type': 'Thing' })['@graph'] as Array<Record<string, unknown>>;
  expect(graph.map((node) => node['@type'])).toEqual(['Person', 'WebSite', 'Thing']);
});

test('a title cannot break out of the script tag', () => {
  const json = serializeJsonLd({ headline: '</script><script>alert(1)</script>' });
  expect(json).not.toContain('</script>');
  expect(JSON.parse(json).headline).toBe('</script><script>alert(1)</script>');
});
