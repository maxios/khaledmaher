import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import GithubSlugger, { slug as toSlug } from 'github-slugger';
import type { Root } from 'mdast';
import { toString } from 'mdast-util-to-string';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import { parse as parseYaml } from 'yaml';
import { stripComments } from './remark/comments';
import { BLOCK_ID } from './remark/block-ids';
import { isExternalUrl, safeDecode } from './urls';
import { WIKILINK, normalizeHeading, parseWikilink } from './wikilink';

export const VAULT_DIR = 'vault';

/** Vault folders that never hold notes, even though they contain Markdown. */
const IGNORED_FOLDERS = new Set(['templates']);

export interface Note {
  /** Path inside the vault, with forward slashes: `posts/Hello.md`. */
  path: string;
  /** File name without the extension, which is what wikilinks point at. */
  name: string;
  title: string;
  slug: string;
  /** Site path without the base, or `null` for notes outside `posts/` and `pages/`. */
  url: string | null;
  publish: boolean;
  /** The `updated` property, or `date`, as written. Feeds the sitemap's `lastmod`. */
  lastModified?: string;
  /** Normalised heading text to rendered heading id. */
  anchors: Map<string, string>;
  /** Block ids defined in the note, without the `^`. */
  blocks: Set<string>;
  /** Link targets as written, so they can be resolved once every note is known. */
  targets: string[];
}

export interface Vault {
  root: string;
  notes: Note[];
  fromFile(file: string): Note | undefined;
  find(target: string, from?: Note): Note | undefined;
  attachment(target: string, from?: Note): string | undefined;
  /** Can this note be rendered and linked to in the current mode? */
  isVisible(note: Note): boolean;
  backlinks(note: Note): Note[];
  /** Listed notes linked to or from this one. */
  neighbours(note: Note): Note[];
  edges(): Array<{ source: Note; target: Note }>;
}

export interface VaultOptions {
  /** Treat unpublished notes as public. Only `astro dev` turns this on. */
  drafts?: boolean;
}

export function noteSlug(fileName: string, frontmatterSlug: unknown): string {
  if (typeof frontmatterSlug === 'string' && frontmatterSlug.trim()) {
    return toSlug(frontmatterSlug);
  }
  return toSlug(path.posix.basename(fileName).replace(/\.md$/i, ''));
}

function asDate(value: unknown): string | undefined {
  return typeof value === 'string' && value ? value : undefined;
}

function routeFor(notePath: string, slug: string): string | null {
  if (notePath.startsWith('posts/')) return `/posts/${slug}/`;
  if (notePath.startsWith('pages/')) return `/${slug}/`;
  return null;
}

function readFrontmatter(source: string): { data: Record<string, unknown>; body: string } {
  const match = source.match(/^---\r?\n(?:([\s\S]*?)\r?\n)?---(?:\r?\n|$)/);
  if (!match) return { data: {}, body: source };

  const body = source.slice(match[0].length);
  try {
    return { data: (parseYaml(match[1] ?? '') as Record<string, unknown>) ?? {}, body };
  } catch {
    // A note with broken YAML can't declare `publish: true`, so it stays private.
    return { data: {}, body };
  }
}

function readNote(root: string, notePath: string): Note {
  const { data, body } = readFrontmatter(readFileSync(path.join(root, notePath), 'utf8'));
  const tree = unified().use(remarkParse).use(remarkGfm).parse(body) as Root;
  // Links and headings inside `%%comments%%` don't exist on the site.
  stripComments(tree);

  const name = path.posix.basename(notePath).replace(/\.md$/i, '');
  const slug = noteSlug(notePath, data.slug);
  const anchors = new Map<string, string>();
  const blocks = new Set<string>();
  const targets: string[] = [];
  const slugger = new GithubSlugger();

  visit(tree, (node) => {
    if (node.type === 'heading') {
      const text = toString(node);
      anchors.set(normalizeHeading(text), slugger.slug(text));
    } else if (node.type === 'text') {
      for (const [, bang, inner] of node.value.matchAll(WIKILINK)) {
        const { target } = parseWikilink(bang === '!', inner ?? '');
        if (target) targets.push(target);
      }
      const block = node.value.match(BLOCK_ID);
      if (block?.[1]) blocks.add(block[1]);
    } else if (node.type === 'link' && !isExternalUrl(node.url)) {
      const target = safeDecode(node.url).split('#')[0];
      if (target) targets.push(target);
    }
  });

  return {
    path: notePath,
    name,
    title: typeof data.title === 'string' && data.title ? data.title : name,
    slug,
    url: routeFor(notePath, slug),
    publish: data.publish === true,
    lastModified: asDate(data.updated) ?? asDate(data.date),
    anchors,
    blocks,
    targets,
  };
}

function walk(root: string, folder = ''): string[] {
  return readdirSync(path.join(root, folder), { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('.')) return [];

    const relative = folder ? `${folder}/${entry.name}` : entry.name;
    if (!entry.isDirectory()) return [relative];
    return IGNORED_FOLDERS.has(relative) ? [] : walk(root, relative);
  });
}

/** Obsidian's rule for ambiguous names: same folder first, then the shortest path. */
function closest<T>(candidates: T[], pathOf: (item: T) => string, from?: Note): T | undefined {
  const folder = from ? path.posix.dirname(from.path) : undefined;
  return [...candidates].sort((a, b) => {
    const sameFolder =
      Number(path.posix.dirname(pathOf(b)) === folder) -
      Number(path.posix.dirname(pathOf(a)) === folder);
    return sameFolder || pathOf(a).length - pathOf(b).length || pathOf(a).localeCompare(pathOf(b));
  })[0];
}

/** Finds `target` by exact path, then by trailing path, then by file name. */
function lookup<T>(
  items: T[],
  target: string,
  pathOf: (item: T) => string,
  from?: Note,
): T | undefined {
  const wanted = target.replace(/^\.?\//, '').toLowerCase();
  const paths = items.map((item) => ({ item, lower: pathOf(item).toLowerCase() }));

  const exact = paths.find(({ lower }) => lower === wanted);
  if (exact) return exact.item;

  const matches = paths.filter(({ lower }) => lower.endsWith(`/${wanted}`));
  return closest(
    matches.map(({ item }) => item),
    pathOf,
    from,
  );
}

export function createVault(root: string, options: VaultOptions = {}): Vault {
  const files = walk(root);
  const notes = files.filter((file) => /\.md$/i.test(file)).map((file) => readNote(root, file));
  const attachments = files.filter((file) => !/\.md$/i.test(file));
  const isVisible = (note: Note) => note.publish || options.drafts === true;

  const find: Vault['find'] = (target, from) => {
    const withExtension = /\.md$/i.test(target) ? target : `${target}.md`;
    return lookup(notes, withExtension, (note) => note.path, from);
  };

  const outgoing = new Map<Note, Set<Note>>(
    notes.map((note) => [
      note,
      new Set(
        note.targets
          .map((target) => find(target, note))
          .filter((hit): hit is Note => hit !== undefined && hit !== note),
      ),
    ]),
  );
  const isListed = (note: Note) => isVisible(note) && note.url !== null;

  // Only notes that will ship can clash: two drafts sharing a name shouldn't stop `astro dev`.
  const taken = new Map<string, Note>();
  for (const note of notes) {
    if (!note.publish || !note.url) continue;

    const clash = taken.get(note.url);
    if (clash) {
      throw new Error(
        `[vault] "${clash.path}" and "${note.path}" both publish to ${note.url}. Set a different \`slug\` on one of them.`,
      );
    }
    taken.set(note.url, note);
  }

  return {
    root,
    notes,
    fromFile: (file) => {
      const relative = path.relative(root, path.resolve(file)).split(path.sep).join('/');
      return notes.find((note) => note.path === relative);
    },
    find,
    attachment: (target, from) => lookup(attachments, target, (file) => file, from),
    isVisible,
    backlinks: (note) =>
      notes.filter((other) => isListed(other) && outgoing.get(other)?.has(note) === true),
    neighbours: (note) =>
      notes.filter(
        (other) =>
          other !== note &&
          isListed(other) &&
          (outgoing.get(other)?.has(note) === true || outgoing.get(note)?.has(other) === true),
      ),
    edges: () =>
      notes.filter(isListed).flatMap((source) =>
        [...(outgoing.get(source) ?? [])]
          .filter(isListed)
          .map((target) => ({ source, target })),
      ),
  };
}

let current: { vault: Vault; builtAt: number } | undefined;

/**
 * The site's vault. Anything other than `astro dev` counts as production, so a
 * misconfigured environment hides drafts rather than publishing them.
 */
export function getVault(): Vault {
  const dev = process.env.NODE_ENV === 'development';
  const stale = dev && current !== undefined && Date.now() - current.builtAt > 1000;

  if (!current || stale) {
    const vault = createVault(path.resolve(process.cwd(), VAULT_DIR), { drafts: dev });
    current = { vault, builtAt: Date.now() };
  }
  return current.vault;
}
