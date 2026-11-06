import type { Blockquote, BlockContent, DefinitionContent, Paragraph, PhrasingContent, Root } from 'mdast';
import { visit } from 'unist-util-visit';

const MARKER = /^\[!([\w-]+)\]([+-]?)[ \t]*/;

/** Obsidian's alternative names, mapped to the type that carries the styling. */
const ALIASES: Record<string, string> = {
  summary: 'abstract',
  tldr: 'abstract',
  hint: 'tip',
  important: 'tip',
  check: 'success',
  done: 'success',
  help: 'question',
  faq: 'question',
  caution: 'warning',
  attention: 'warning',
  fail: 'failure',
  missing: 'failure',
  error: 'danger',
  cite: 'quote',
};

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
}

/** Splits the first paragraph at its first line break: the title line, then the rest. */
function splitTitleLine(children: PhrasingContent[]): {
  title: PhrasingContent[];
  rest: PhrasingContent[];
} {
  for (const [index, node] of children.entries()) {
    const newline = node.type === 'text' ? node.value.indexOf('\n') : -1;
    if (node.type !== 'text' || newline === -1) continue;

    const before = node.value.slice(0, newline);
    const after = node.value.slice(newline + 1);
    return {
      title: [
        ...children.slice(0, index),
        ...(before ? [{ ...node, value: before }] : []),
      ],
      rest: [...(after ? [{ ...node, value: after }] : []), ...children.slice(index + 1)],
    };
  }
  return { title: children, rest: [] };
}

function toCallout(node: Blockquote): void {
  const first = node.children[0];
  if (first?.type !== 'paragraph') return;

  const lead = first.children[0];
  const marker = lead?.type === 'text' ? lead.value.match(MARKER) : null;
  if (lead?.type !== 'text' || !marker) return;

  const written = (marker[1] ?? 'note').toLowerCase();
  const fold = marker[2];
  const remainder = lead.value.slice(marker[0].length);
  const { title, rest } = splitTitleLine([
    ...(remainder ? [{ ...lead, value: remainder }] : []),
    ...first.children.slice(1),
  ]);

  const foldable = fold === '+' || fold === '-';
  const heading: Paragraph = {
    type: 'paragraph',
    children: title.length ? title : [{ type: 'text', value: titleCase(written) }],
    data: {
      hName: foldable ? 'summary' : 'div',
      hProperties: { className: ['callout-title'] },
    },
  };

  const body: Array<BlockContent | DefinitionContent> = [
    ...(rest.length ? [{ type: 'paragraph', children: rest } satisfies Paragraph] : []),
    ...node.children.slice(1),
  ];

  node.data = {
    hName: foldable ? 'details' : 'aside',
    hProperties: {
      className: ['callout'],
      dataCallout: ALIASES[written] ?? written,
      ...(fold === '+' ? { open: true } : {}),
    },
  };
  node.children = [
    heading,
    ...(body.length
      ? [
          {
            type: 'blockquote',
            children: body,
            data: { hName: 'div', hProperties: { className: ['callout-body'] } },
          } satisfies Blockquote,
        ]
      : []),
  ];
}

/** Turns `> [!type]` blockquotes into callouts, including nested and foldable ones. */
export function transformCallouts(tree: Root): void {
  visit(tree, 'blockquote', toCallout);
}
