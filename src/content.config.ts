import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';
import { VAULT_DIR, noteSlug } from './vault/vault';

/** Obsidian's Properties panel leaves an empty key as `null`. */
const blankToUndefined = (value: unknown) => (value === null || value === '' ? undefined : value);

const optionalText = z.preprocess(blankToUndefined, z.string().optional());
// Without the null check, `date:` would coerce to 1 January 1970.
const optionalDate = z.preprocess(blankToUndefined, z.coerce.date().optional());
const tags = z.preprocess(
  (value) => (value === null || value === undefined ? [] : [value].flat()),
  z.array(z.string().transform((tag) => tag.replace(/^#/, '').toLowerCase())),
);

const shared = {
  title: optionalText,
  description: optionalText,
  slug: optionalText,
  publish: z.boolean().default(false),
};

const loaderFor = (folder: string) =>
  glob({
    base: `./${VAULT_DIR}/${folder}`,
    pattern: '**/*.md',
    generateId: ({ entry, data }) => noteSlug(entry, data.slug),
  });

const posts = defineCollection({
  loader: loaderFor('posts'),
  schema: z
    .object({
      ...shared,
      date: optionalDate,
      updated: optionalDate,
      tags,
      /** Name of a layout in `src/experiences/`. */
      experience: optionalText,
    })
    .refine((post) => !post.publish || post.date !== undefined, {
      message: 'A published post needs a `date`',
      path: ['date'],
    })
    // Without this every post would share one description, which search engines discount.
    .refine((post) => !post.publish || post.description !== undefined, {
      message: 'A published post needs a `description`, for search results and link previews',
      path: ['description'],
    }),
});

const pages = defineCollection({
  loader: loaderFor('pages'),
  schema: z.object({
    ...shared,
    /** The H1, when the page's title in search results should stay short. */
    heading: optionalText,
  }),
});

export const collections = { posts, pages };
