import type { Code, Root } from 'mdast';
import { visit } from 'unist-util-visit';
import { parse as parseYaml } from 'yaml';
import { encodeIsland } from '../../islands/placeholder';
import { type IslandName, isIsland, islands } from '../../islands/registry';
import type { Context } from './context';

function readProps(node: Code, name: IslandName, context: Context): unknown {
  const line = node.position?.start.line;
  const where = `\`\`\`${name} fence${line ? ` near line ${line}` : ''}`;

  let raw: unknown;
  try {
    raw = parseYaml(node.value);
  } catch (error) {
    context.fail(`${where}: invalid YAML (${(error as Error).message})`);
    return undefined;
  }

  const result = islands[name].safeParse(raw ?? {});
  if (result.success) return result.data;

  const issues = result.error.issues
    .map((issue) => `${issue.path.join('.') || 'props'}: ${issue.message}`)
    .join('; ');
  context.fail(`${where}: ${issues}`);
  return undefined;
}

/**
 * Replaces island fences with a placeholder. Plain `.md` can't hold components,
 * so `Prose.astro` swaps the placeholder for the real island at render time.
 * Fences that fail validation stay as code blocks, so the problem is visible.
 */
export function transformIslands(tree: Root, context: Context): void {
  visit(tree, 'code', (node, index, parent) => {
    if (!parent || index === undefined || !isIsland(node.lang)) return;

    const props = readProps(node, node.lang, context);
    if (props === undefined) return;

    parent.children[index] = { type: 'html', value: encodeIsland(node.lang, props) };
  });
}
