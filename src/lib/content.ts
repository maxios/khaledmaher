import { type CollectionEntry, getCollection } from 'astro:content';
import { guides } from '../data/guides';
import { undirectedLinks } from '../islands/graph-view';
import { type Note, getVault } from '../vault/vault';

export type PostEntry = CollectionEntry<'posts'>;

export interface Post {
  entry: PostEntry;
  title: string;
  description?: string;
  url: string;
  date: Date;
  tags: string[];
}

export const href = (path: string): string =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;

function noteFor(entry: { filePath?: string }) {
  const note = entry.filePath ? getVault().fromFile(entry.filePath) : undefined;
  if (!note) throw new Error(`[vault] no note for "${entry.filePath}"`);
  return note;
}

function isVisible(entry: { filePath?: string }): boolean {
  return getVault().isVisible(noteFor(entry));
}

/** Visible posts, newest first. Drafts appear only under `astro dev`. */
export async function getPosts(): Promise<Post[]> {
  const entries = await getCollection('posts', isVisible);

  return entries
    .map((entry) => {
      const note = noteFor(entry);
      return {
        entry,
        title: note.title,
        description: entry.data.description,
        url: href(note.url as string),
        // A draft may not have a date yet. Sorting it first keeps it easy to find.
        date: entry.data.date ?? new Date(),
        tags: entry.data.tags,
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getPages() {
  const entries = await getCollection('pages', isVisible);
  return entries.map((entry) => ({ entry, title: noteFor(entry).title }));
}

export function getBacklinks(post: Post): Array<{ title: string; url: string }> {
  const vault = getVault();
  return vault.backlinks(noteFor(post.entry)).map((note) => ({
    title: note.title,
    url: href(note.url as string),
  }));
}

/** How many other posts this one is connected to, in either direction. */
export function getNeighbourCount(post: Post): number {
  return getVault().neighbours(noteFor(post.entry)).length;
}

/** Published posts and the links between them, for the graph island. */
export function getGraph() {
  const vault = getVault();
  const isPost = (note: Note) => note.path.startsWith('posts/');

  const links = undirectedLinks(
    vault
      .edges()
      .filter(({ source, target }) => isPost(source) && isPost(target))
      .map(({ source, target }) => ({ source: source.path, target: target.path })),
  );

  const nodes = vault.notes
    .filter((note) => vault.isVisible(note) && isPost(note))
    .map((note) => ({
      id: note.path,
      title: note.title,
      url: href(note.url as string),
      links: links.filter(({ source, target }) => [source, target].includes(note.path)).length,
    }));

  return { nodes, links };
}

export interface WritingItem {
  title: string;
  /** Absent for guides that don't have a public home yet. */
  url?: string;
  date: Date;
  kind: 'note' | 'guide';
  detail: string;
}

/** Notes from the vault and the published guides, newest first. */
export async function getWriting(): Promise<WritingItem[]> {
  const notes = (await getPosts()).map(
    (post): WritingItem => ({
      title: post.title,
      url: post.url,
      date: post.date,
      kind: 'note',
      detail: 'note',
    }),
  );
  const papers = guides.map(
    (guide): WritingItem => ({
      title: guide.title,
      url: guide.url,
      date: new Date(guide.date),
      kind: 'guide',
      detail: `guide · ${guide.pages} pp`,
    }),
  );

  return [...notes, ...papers].sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getTags(posts: Post[]): Array<{ tag: string; count: number }> {
  const counts = new Map<string, number>();
  for (const tag of posts.flatMap((post) => post.tags)) {
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
