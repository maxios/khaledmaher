/** Matches `[[target]]` and `![[target]]`. Group 1 is the `!`, group 2 the inner text. */
export const WIKILINK = /(!?)\[\[([^[\]\n]+?)\]\]/g;

export interface Wikilink {
  embed: boolean;
  /** Note or file name. Empty for same-note links such as `[[#Heading]]`. */
  target: string;
  /** Text after the first `#`: a heading path, or `^id` for a block. */
  subpath?: string;
  /** Text after the first `|`. */
  display?: string;
}

export function parseWikilink(embed: boolean, inner: string): Wikilink {
  // Obsidian requires `\|` inside tables, so accept it everywhere.
  const text = inner.replace(/\\\|/g, '|');
  const pipe = text.indexOf('|');
  const destination = pipe === -1 ? text : text.slice(0, pipe);
  const display = pipe === -1 ? undefined : text.slice(pipe + 1).trim();
  const hash = destination.indexOf('#');

  return {
    embed,
    target: (hash === -1 ? destination : destination.slice(0, hash)).trim(),
    subpath: hash === -1 ? undefined : destination.slice(hash + 1).trim() || undefined,
    display: display || undefined,
  };
}

/** Reads the `alt`, `300`, `300x200` and `alt|300` forms of an embed's display text. */
export function parseEmbedOptions(display?: string): {
  alt?: string;
  width?: number;
  height?: number;
} {
  if (!display) return {};

  const parts = display.split('|');
  const size = parts.at(-1)?.match(/^(\d+)(?:x(\d+))?$/);
  if (!size) return { alt: display };

  return {
    alt: parts.slice(0, -1).join('|') || undefined,
    width: Number(size[1]),
    height: size[2] ? Number(size[2]) : undefined,
  };
}

/** Obsidian drops these characters from heading links, so compare without them. */
export function normalizeHeading(heading: string): string {
  return heading
    .replace(/[#|^:%[\]\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}
