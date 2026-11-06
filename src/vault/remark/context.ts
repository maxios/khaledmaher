import path from 'node:path';
import type { Note, Vault } from '../vault';

export interface Context {
  vault: Vault;
  note: Note;
  base: string;
  /** Absolute path of the Markdown file being rendered. */
  file: string;
  /** Something the writer should know about, such as a link to a missing note. */
  warn(message: string): void;
  /** Something that would ship broken. Stops a production build, warns in dev. */
  fail(message: string): void;
}

/** A URL from the current note to a vault file, in the form Astro's image pipeline expects. */
export function relativeUrl(context: Context, vaultPath: string): string {
  const absolute = path.join(context.vault.root, vaultPath);
  const relative = path.relative(path.dirname(context.file), absolute).split(path.sep).join('/');
  return encodeURI(relative.startsWith('.') ? relative : `./${relative}`);
}
