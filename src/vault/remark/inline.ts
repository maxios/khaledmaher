import type { PhrasingContent, Root } from 'mdast';
import { visit } from 'unist-util-visit';
import { withBase } from '../urls';
import type { Note } from '../vault';
import {
  type Wikilink,
  normalizeHeading,
  parseEmbedOptions,
  parseWikilink,
} from '../wikilink';
import { blockAnchor } from './block-ids';
import { type Context, relativeUrl } from './context';

/** A wikilink or embed, or a `==highlight==`. */
const TOKEN = /(!?)\[\[([^[\]\n]+?)\]\]|==(?=\S)([^\n]+?)(?<=\S)==/g;

const IMAGE = /\.(png|jpe?g|gif|webp|avif|svg)$/i;
const OTHER_FILE = /\.(mp4|webm|mov|mkv|ogv|mp3|wav|m4a|ogg|flac|pdf|canvas|base)$/i;

function lastHeading(subpath: string): string {
  return subpath.split('#').filter(Boolean).at(-1) ?? subpath;
}

function fragmentFor(target: Note, subpath: string | undefined, context: Context): string {
  if (!subpath) return '';

  const part = lastHeading(subpath);
  if (part.startsWith('^')) {
    const id = part.slice(1);
    if (target.blocks.has(id)) return `#${blockAnchor(id)}`;
    context.warn(`no block "^${id}" in "${target.path}"`);
    return '';
  }

  const anchor = target.anchors.get(normalizeHeading(part));
  if (anchor) return `#${anchor}`;
  context.warn(`no heading "${part}" in "${target.path}"`);
  return '';
}

/** The site URL for a note and subpath, or `undefined` if the note isn't reachable. */
export function noteHref(
  target: Note,
  subpath: string | undefined,
  context: Context,
): string | undefined {
  const fragment = fragmentFor(target, subpath, context);
  if (target === context.note) return fragment || undefined;
  if (!target.url || !context.vault.isVisible(target)) return undefined;
  return `${withBase(target.url, context.base)}${fragment}`;
}

function displayText(link: Wikilink, target: Note | undefined): string {
  if (link.display) return link.display;

  const name = target?.title ?? link.target;
  if (!link.subpath) return name;

  const part = lastHeading(link.subpath).replace(/^\^/, '');
  return link.target ? `${name} › ${part}` : part;
}

function toLink(link: Wikilink, context: Context): PhrasingContent[] {
  const target = link.target ? context.vault.find(link.target, context.note) : context.note;
  const text = displayText(link, target);

  if (!target) {
    context.warn(`[[${link.target}]] doesn't match any note`);
    return link.embed ? [] : [{ type: 'text', value: text }];
  }

  const url = noteHref(target, link.subpath, context);
  if (!url) {
    // Keep the words, drop the link: an unpublished note must not appear in the output.
    if (target !== context.note) context.warn(`[[${link.target}]] isn't published`);
    return link.embed ? [] : [{ type: 'text', value: text }];
  }

  return [
    {
      type: 'link',
      url,
      children: [{ type: 'text', value: text }],
      data: {
        hProperties: { className: link.embed ? ['wikilink', 'note-embed'] : ['wikilink'] },
      },
    },
  ];
}

function toImage(link: Wikilink, context: Context): PhrasingContent[] {
  const found = context.vault.attachment(link.target, context.note);
  if (!found) {
    context.fail(`![[${link.target}]] doesn't match any file in the vault`);
    return [{ type: 'text', value: `[missing image: ${link.target}]` }];
  }

  const { alt, width, height } = parseEmbedOptions(link.display);
  return [
    {
      type: 'image',
      url: relativeUrl(context, found),
      alt: alt ?? '',
      data: {
        hProperties: {
          ...(width ? { width } : {}),
          ...(height ? { height } : {}),
        },
      },
    },
  ];
}

function toEmbed(link: Wikilink, context: Context): PhrasingContent[] {
  if (IMAGE.test(link.target)) return toImage(link, context);

  if (OTHER_FILE.test(link.target)) {
    context.fail(`![[${link.target}]]: only image embeds are supported`);
    return [{ type: 'text', value: `[unsupported embed: ${link.target}]` }];
  }
  return toLink(link, context);
}

function splitText(value: string, context: Context): PhrasingContent[] | undefined {
  const parts: PhrasingContent[] = [];
  let cursor = 0;

  for (const match of value.matchAll(TOKEN)) {
    const [whole, bang, inner, highlighted] = match;
    if (match.index > cursor) parts.push({ type: 'text', value: value.slice(cursor, match.index) });
    cursor = match.index + whole.length;

    if (highlighted !== undefined) {
      parts.push({
        // Any phrasing parent works here: `hName` decides the rendered element.
        type: 'emphasis',
        children: splitText(highlighted, context) ?? [{ type: 'text', value: highlighted }],
        data: { hName: 'mark' },
      });
    } else {
      const link = parseWikilink(bang === '!', inner ?? '');
      parts.push(...(link.embed ? toEmbed(link, context) : toLink(link, context)));
    }
  }

  if (cursor === 0) return undefined;
  if (cursor < value.length) parts.push({ type: 'text', value: value.slice(cursor) });
  return parts;
}

/** Replaces wikilinks, embeds and highlights in running text. */
export function transformInline(tree: Root, context: Context): void {
  visit(tree, 'text', (node, index, parent) => {
    if (!parent || index === undefined || parent.type === 'link') return;

    const parts = splitText(node.value, context);
    if (!parts) return;

    parent.children.splice(index, 1, ...parts);
    return index + parts.length;
  });
}
