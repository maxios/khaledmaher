import type { Parents, Root, RootContent } from 'mdast';

/**
 * Removes Obsidian `%%comments%%`.
 *
 * A comment can start and end in different nodes, or different paragraphs, so
 * this walks the document in order and tracks whether a comment is open. An
 * unclosed `%%` hides the rest of the note, which matches Obsidian and errs
 * towards not publishing private text. `%%` inside code is left alone.
 */
export function stripComments(tree: Root): void {
  let open = false;

  const keepText = (value: string): string => {
    let kept = '';
    value.split('%%').forEach((piece, index) => {
      if (index > 0) open = !open;
      if (!open) kept += piece;
    });
    return kept;
  };

  const walk = (parent: Parents): void => {
    const kept: RootContent[] = [];

    for (const node of parent.children) {
      if (node.type === 'text') {
        const value = keepText(node.value);
        if (value) kept.push({ ...node, value });
      } else if ('children' in node) {
        const hadChildren = node.children.length > 0;
        walk(node);
        // Removing a table cell would shift the columns after it.
        const emptied = hadChildren && node.children.length === 0;
        if (!emptied || node.type === 'tableCell') kept.push(node);
      } else if (!open) {
        kept.push(node);
      }
    }

    parent.children = kept as typeof parent.children;
  };

  walk(tree);
}
