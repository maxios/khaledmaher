import type { Root } from 'mdast';
import type { VFile } from 'vfile';
import { type Vault, getVault } from '../vault';
import { transformBlockIds } from './block-ids';
import { transformCallouts } from './callouts';
import { stripComments } from './comments';
import type { Context } from './context';
import { transformInline } from './inline';
import { transformIslands } from './islands';
import { transformMarkdownLinks } from './markdown-links';

export interface RemarkObsidianOptions {
  /** The site's `base`, so links keep working under a subpath. */
  base?: string;
  /** Overrides the site vault. Used by the tests. */
  vault?: () => Vault;
  /** Whether `fail` stops the build. Defaults to on for everything except `astro dev`. */
  strict?: boolean;
}

export function remarkObsidian(options: RemarkObsidianOptions = {}) {
  return (tree: Root, file: VFile): void => {
    const vault = (options.vault ?? getVault)();
    const note = vault.fromFile(file.path);
    if (!note) return;

    // Rendering an unpublished note would pull its images into the build output.
    if (!vault.isVisible(note)) {
      tree.children = [];
      return;
    }

    const strict = options.strict ?? process.env.NODE_ENV !== 'development';
    const report = (message: string) => `[vault] ${note.path}: ${message}`;
    const context: Context = {
      vault,
      note,
      base: options.base ?? '/',
      file: file.path,
      warn: (message) => console.warn(report(message)),
      fail: (message) => {
        if (strict) throw new Error(report(message));
        console.warn(report(message));
      },
    };

    // Comments go first so nothing inside one is treated as content.
    stripComments(tree);
    transformCallouts(tree);
    transformBlockIds(tree);
    // Before inline, so it doesn't reprocess the links inline creates.
    transformMarkdownLinks(tree, context);
    transformInline(tree, context);
    transformIslands(tree, context);
  };
}
