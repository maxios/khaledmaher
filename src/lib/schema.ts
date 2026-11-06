import { site } from '../site.config';

export const PERSON_ID = `${site.url}/#person`;
const WEBSITE_ID = `${site.url}/#website`;

type Node = Record<string, unknown>;

/** One entity for the author, referenced by id everywhere else so search engines see one person. */
export function personSchema(): Node {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.name,
    alternateName: site.nameArabic,
    url: `${site.url}/`,
    jobTitle: site.jobTitle,
    description: site.description,
    address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: site.country },
    knowsLanguage: ['en', 'ar'],
    knowsAbout: [
      'Software architecture',
      'Documentation engineering',
      'AI agents',
      'Software delivery',
      'TypeScript',
    ],
    sameAs: [site.social.github, site.social.x],
  };
}

export function websiteSchema(): Node {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${site.url}/`,
    name: site.name,
    description: site.description,
    inLanguage: site.lang,
    publisher: { '@id': PERSON_ID },
  };
}

export function profilePageSchema(url: string): Node {
  return {
    '@type': 'ProfilePage',
    '@id': `${url}#profile`,
    url,
    name: `About ${site.name}`,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: { '@id': PERSON_ID },
  };
}

export function collectionPageSchema(url: string, name: string, description: string): Node {
  return {
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name,
    description,
    isPartOf: { '@id': WEBSITE_ID },
    author: { '@id': PERSON_ID },
  };
}

export interface ArticleInput {
  url: string;
  title: string;
  description: string;
  image: string;
  published: Date;
  modified?: Date;
  tags: string[];
}

export function articleSchema(article: ArticleInput): Node {
  return {
    '@type': 'BlogPosting',
    '@id': `${article.url}#article`,
    mainEntityOfPage: article.url,
    url: article.url,
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.published.toISOString(),
    dateModified: (article.modified ?? article.published).toISOString(),
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: site.lang,
    ...(article.tags.length > 0 ? { keywords: article.tags } : {}),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Every page carries the person and the site, so each one stands alone for a crawler. */
export function graphOf(...nodes: Node[]): Node {
  return {
    '@context': 'https://schema.org',
    '@graph': [personSchema(), websiteSchema(), ...nodes],
  };
}

/** `</script>` inside a title must not be able to close the tag it's embedded in. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
