import { existsSync } from 'node:fs';
import path from 'node:path';
import type { Image, Link, Parents, Root } from 'mdast';
import { visit } from 'unist-util-visit';
import { isExternalUrl, safeDecode, withBase } from '../urls';
import { type Context, relativeUrl } from './context';
import { noteHref } from './inline';

function rewriteLink(node: Link, index: number, parent: Parents, context: Context): void {
  const [target = '', ...fragment] = safeDecode(node.url).split('#');
  const note = context.vault.find(target, context.note);
  if (!note) {
    if (/\.md$/i.test(target)) context.warn(`link to "${target}" doesn't match any note`);
    return;
  }

  const url = noteHref(note, fragment.join('#') || undefined, context);
  if (url) {
    node.url = url;
  } else {
    context.warn(`link to "${target}" isn't published`);
    parent.children.splice(index, 1, ...(node.children as typeof parent.children));
  }
}

function rewriteImage(node: Image, context: Context): void {
  const wanted = safeDecode(node.url);
  if (existsSync(path.resolve(path.dirname(context.file), wanted))) return;

  const found = context.vault.attachment(wanted, context.note);
  if (found) {
    node.url = relativeUrl(context, found);
  } else {
    context.fail(`image "${wanted}" doesn't match any file in the vault`);
    node.url = '';
  }
}

/**
 * Handles standard Markdown links and images that use vault paths. Obsidian
 * writes these when "Use [[Wikilinks]]" is off, and they are relative to the
 * vault root, not the note, so Astro couldn't resolve them alone.
 */
export function transformMarkdownLinks(tree: Root, context: Context): void {
  visit(tree, (node, index, parent) => {
    if (node.type === 'link' && /^\/(?!\/)/.test(node.url)) {
      // A site path like `/graph/` has to keep working under a subpath.
      node.url = withBase(node.url, context.base);
    } else if (node.type === 'link' && !isExternalUrl(node.url) && parent && index !== undefined) {
      rewriteLink(node, index, parent, context);
    } else if (node.type === 'image' && !isExternalUrl(node.url)) {
      rewriteImage(node, context);
    }
  });
}
