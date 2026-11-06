import { describe, expect, test } from 'bun:test';
import path from 'node:path';
import { createVault, noteSlug } from '../src/vault/vault';
import { normalizeHeading, parseEmbedOptions, parseWikilink } from '../src/vault/wikilink';

const root = path.resolve(import.meta.dir, 'fixtures/vault');
const vault = createVault(root);
const note = (name: string) => {
  const found = vault.find(name);
  if (!found) throw new Error(`fixture "${name}" is missing`);
  return found;
};

describe('parseWikilink', () => {
  test('reads target, subpath and display', () => {
    expect(parseWikilink(false, 'Note#Heading|shown')).toEqual({
      embed: false,
      target: 'Note',
      subpath: 'Heading',
      display: 'shown',
    });
  });

  test('reads same-note links and the escaped pipe used in tables', () => {
    expect(parseWikilink(false, '#Heading').target).toBe('');
    expect(parseWikilink(false, 'Note\\|shown').display).toBe('shown');
  });
});

describe('parseEmbedOptions', () => {
  test.each([
    ['300', { alt: undefined, width: 300, height: undefined }],
    ['300x200', { alt: undefined, width: 300, height: 200 }],
    ['a diagram', { alt: 'a diagram' }],
    ['a diagram|300', { alt: 'a diagram', width: 300, height: undefined }],
  ])('%s', (input, expected) => {
    expect(parseEmbedOptions(input)).toEqual(expected);
  });
});

test('normalizeHeading ignores case and the characters Obsidian strips', () => {
  expect(normalizeHeading('What: is ^this?  ')).toBe('what is this?');
});

test('noteSlug prefers frontmatter and handles apostrophes', () => {
  expect(noteSlug('posts/Don\'t stop.md', undefined)).toBe('dont-stop');
  expect(noteSlug('posts/Anything.md', 'My Slug')).toBe('my-slug');
});

describe('index', () => {
  test('titles fall back to the file name', () => {
    expect(note('Alpha').title).toBe('Alpha title');
    expect(note('Beta note').title).toBe('Beta note');
  });

  test('routes depend on the folder, and only posts and pages get one', () => {
    expect(note('Alpha').url).toBe('/posts/alpha/');
    expect(note('Gamma').url).toBe('/posts/gamma-custom/');
    expect(note('Loose').url).toBeNull();
  });

  test('publishing is opt-in', () => {
    expect(note('Secret').publish).toBe(false);
    expect(vault.isVisible(note('Secret'))).toBe(false);
    expect(createVault(root, { drafts: true }).isVisible(note('Secret'))).toBe(true);
  });

  test('templates are not notes, so they cannot shadow a real one', () => {
    expect(note('Alpha').path).toBe('posts/Alpha.md');
    expect(vault.notes.some((item) => item.path.startsWith('templates/'))).toBe(false);
  });

  test('resolves case-insensitively, by path, and with or without the extension', () => {
    expect(vault.find('alpha')?.path).toBe('posts/Alpha.md');
    expect(vault.find('nested/gamma')?.path).toBe('posts/nested/Gamma.md');
    expect(vault.find('Alpha.md')?.path).toBe('posts/Alpha.md');
    expect(vault.find('Nope')).toBeUndefined();
  });

  test('ambiguous names resolve to the same folder as the linking note', () => {
    const from = vault.notes.find((item) => item.path === 'posts/other/Twin.md');
    expect(vault.find('Twin', from)?.path).toBe('posts/other/Twin.md');
  });

  test('duplicate headings get the same ids Astro renders', () => {
    // The id keeps the first slug for a normalised heading plus the later one.
    expect(note('Alpha').anchors.get('top')).toBe('top');
    expect(note('Alpha').anchors.get('second heading')).toBe('second-heading-1');
  });

  test('finds attachments by name, including names with spaces', () => {
    expect(vault.attachment('pasted image 1.png')).toBe('attachments/Pasted image 1.png');
  });

  test('drafts sharing a name do not stop the dev server', () => {
    expect(() => createVault(root, { drafts: true })).not.toThrow();
  });

  test('throws when two published notes want the same URL', () => {
    const clashing = path.resolve(import.meta.dir, 'fixtures/clash');
    expect(() => createVault(clashing)).toThrow('both publish to /posts/same/');
  });
});

describe('graph', () => {
  const backlinks = (name: string) => vault.backlinks(note(name)).map((item) => item.name);

  test('collects published backlinks', () => {
    expect(backlinks('Beta note')).toEqual(['Alpha']);
  });

  test('ignores unpublished notes, notes with no route and links in comments', () => {
    expect(backlinks('Alpha')).toEqual(['Beta note']);
    expect(backlinks('Gamma')).toEqual([]);
  });

  test('edges only join published notes', () => {
    const pairs = vault.edges().map(({ source, target }) => `${source.name}>${target.name}`);
    expect(pairs.sort()).toEqual(['Alpha>Beta note', 'Beta note>Alpha']);
  });
});

describe('neighbours', () => {
  test('counts links in both directions, once each', () => {
    const names = vault.neighbours(note('Alpha')).map((item) => item.name);
    expect(names).toEqual(['Beta note']);
  });

  test('ignores unpublished notes', () => {
    expect(vault.neighbours(note('Gamma'))).toEqual([]);
  });
});

test('lastModified prefers `updated`, then `date`', () => {
  expect(note('Alpha').lastModified).toBe('2026-01-01');
  expect(note('Loose').lastModified).toBeUndefined();
});
