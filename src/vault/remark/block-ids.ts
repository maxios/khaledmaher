import type { Paragraph, Root, RootContent } from 'mdast';
import { visit } from 'unist-util-visit';

/** A `^block-id` at the end of a line of text. */
export const BLOCK_ID = /(?:^|\s)\^([a-zA-Z0-9-]+)\s*$/;

export const blockAnchor = (id: string): string => `block-${id}`;

function setId(node: RootContent, id: string): void {
  node.data = {
    ...node.data,
    hProperties: { ...node.data?.hProperties, id: blockAnchor(id) },
  } as typeof node.data;
}

/** Removes the marker from the paragraph's text and returns the id, if there is one. */
function takeTrailingId(paragraph: Paragraph): string | undefined {
  const last = paragraph.children.at(-1);
  if (last?.type !== 'text') return undefined;

  const match = last.value.match(BLOCK_ID);
  if (!match?.[1]) return undefined;

  last.value = last.value.slice(0, match.index);
  if (!last.value) paragraph.children.pop();
  return match[1];
}

/**
 * Turns `^id` markers into anchors so `[[Note#^id]]` can land on them. Without
 * this the marker would be printed as text. A marker on its own line belongs to
 * the block above it, which is how Obsidian tags tables and lists.
 */
export function transformBlockIds(tree: Root): void {
  visit(tree, 'paragraph', (node, index, parent) => {
    if (!parent || index === undefined) return;

    const id = takeTrailingId(node);
    if (!id) return;

    if (node.children.length > 0) {
      setId(node, id);
      return;
    }

    const previous = parent.children[index - 1];
    if (previous) setId(previous, id);
    parent.children.splice(index, 1);
    return index;
  });
}
