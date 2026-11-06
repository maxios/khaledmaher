import type { IslandName } from './registry';

const PLACEHOLDER = /<vault-island data-name="([^"]+)" data-props="([^"]*)"><\/vault-island>/g;

export type ProsePart =
  | { kind: 'html'; html: string }
  | { kind: 'island'; name: IslandName; props: Record<string, unknown> };

export function encodeIsland(name: IslandName, props: unknown): string {
  const encoded = Buffer.from(JSON.stringify(props)).toString('base64url');
  return `<vault-island data-name="${name}" data-props="${encoded}"></vault-island>`;
}

/**
 * Cuts rendered HTML at each placeholder. A fence nested in a callout or list
 * leaves an open tag in one part and its closing tag in a later one. That's
 * safe because the parts are written back out in order, as plain strings.
 */
export function splitIslands(html: string): ProsePart[] {
  const parts: ProsePart[] = [];
  let cursor = 0;

  for (const match of html.matchAll(PLACEHOLDER)) {
    const [whole, name, encoded] = match;
    if (match.index > cursor) parts.push({ kind: 'html', html: html.slice(cursor, match.index) });
    parts.push({
      kind: 'island',
      name: name as IslandName,
      props: JSON.parse(Buffer.from(encoded ?? '', 'base64url').toString('utf8')),
    });
    cursor = match.index + whole.length;
  }

  if (cursor < html.length) parts.push({ kind: 'html', html: html.slice(cursor) });
  return parts;
}
