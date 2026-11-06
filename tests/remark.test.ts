import { describe, expect, test } from 'bun:test';
import path from 'node:path';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { VFile } from 'vfile';
import { splitIslands } from '../src/islands/placeholder';
import { type RemarkObsidianOptions, remarkObsidian } from '../src/vault/remark';
import { createVault } from '../src/vault/vault';

const root = path.resolve(import.meta.dir, 'fixtures/vault');
const vault = createVault(root);

async function render(
  markdown: string,
  { file = 'posts/Alpha.md', ...options }: RemarkObsidianOptions & { file?: string } = {},
) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkObsidian, { vault: () => vault, strict: true, ...options })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(new VFile({ value: markdown, path: path.join(root, file) }));
  return String(result);
}

describe('wikilinks', () => {
  test('uses the title by default and the alias when given', async () => {
    expect(await render('[[Beta note]]')).toContain('href="/posts/beta-note/"');
    expect(await render('[[Gamma]]')).toContain('>Gamma<');
    expect(await render('[[Beta note|the other one]]')).toContain('>the other one<');
  });

  test('links to headings, using the id of the rendered heading', async () => {
    const html = await render('[[Alpha#Second Heading]]', { file: 'posts/Beta note.md' });
    expect(html).toContain('href="/posts/alpha/#second-heading-1"');
    expect(html).toContain('Alpha title › Second Heading');
  });

  test('links within the same note', async () => {
    expect(await render('[[#Top]]')).toContain('href="#top"');
  });

  test('links to blocks', async () => {
    const html = await render('[[Alpha#^para-1]]', { file: 'posts/Beta note.md' });
    expect(html).toContain('href="/posts/alpha/#block-para-1"');
  });

  test('resolves names with apostrophes', async () => {
    expect(await render("[[Don't stop]]")).toContain('href="/posts/dont-stop/"');
  });

  test('adds the site base', async () => {
    expect(await render('[[Gamma]]', { base: '/blog/' })).toContain(
      'href="/blog/posts/gamma-custom/"',
    );
  });

  test('keeps the words of links to missing notes', async () => {
    const html = await render('[[Not written yet|a later post]]');
    expect(html).toBe('<p>a later post</p>');
  });

  test('never links to an unpublished note', async () => {
    const html = await render('[[Secret|a hint]]');
    expect(html).toBe('<p>a hint</p>');
    expect(html).not.toContain('secret');
  });

  test('never links to a note with no route', async () => {
    expect(await render('[[Loose]]')).toBe('<p>Loose</p>');
  });

  test('leaves code alone', async () => {
    const html = await render('`[[Alpha]]`\n\n```\n[[Alpha]]\n```');
    expect(html).not.toContain('<a ');
  });

  test('works inside table cells', async () => {
    const html = await render('| a |\n| - |\n| [[Gamma\\|shown]] |');
    expect(html).toContain('>shown</a>');
  });
});

describe('embeds', () => {
  test('points at the file relative to the note, with spaces encoded', async () => {
    const html = await render('![[Pasted image 1.png]]');
    expect(html).toContain('src="../attachments/Pasted%20image%201.png"');
  });

  test('reads size and alt text', async () => {
    const html = await render('![[Pasted image 1.png|a diagram|300]]');
    expect(html).toContain('alt="a diagram"');
    expect(html).toContain('width="300"');
  });

  test('a missing image stops a strict build', async () => {
    await expect(render('![[nope.png]]')).rejects.toThrow('nope.png');
  });

  test('a missing image is visible in dev instead of crashing', async () => {
    expect(await render('![[nope.png]]', { strict: false })).toContain('[missing image: nope.png]');
  });

  test('an unsupported file stops a strict build', async () => {
    await expect(render('![[clip.mp4]]')).rejects.toThrow('only image embeds');
  });

  test('note embeds become links, and unpublished ones disappear', async () => {
    expect(await render('![[Gamma]]')).toContain('class="wikilink note-embed"');
    expect(await render('![[Secret]]')).not.toContain('Secret');
  });
});

describe('standard Markdown links', () => {
  test('resolves links to notes', async () => {
    const html = await render('[text](Beta%20note.md)');
    expect(html).toContain('href="/posts/beta-note/"');
  });

  test('keeps the text of links to unpublished notes', async () => {
    expect(await render('[hint](Secret.md)')).toBe('<p>hint</p>');
  });

  test('resolves vault-relative images', async () => {
    const html = await render('![x](Pasted%20image%201.png)');
    expect(html).toContain('src="../attachments/Pasted%20image%201.png"');
  });

  test('adds the base to site paths, but not to protocol-relative URLs', async () => {
    expect(await render('[x](/graph/)', { base: '/blog/' })).toContain('href="/blog/graph/"');
    expect(await render('[x](//cdn.test/a)', { base: '/blog/' })).toContain('href="//cdn.test/a"');
  });

  test('leaves external URLs alone', async () => {
    expect(await render('[x](https://example.com/a.md)')).toContain(
      'href="https://example.com/a.md"',
    );
  });
});

describe('callouts', () => {
  test('uses the type as the default title', async () => {
    const html = await render('> [!warning]\n> Careful.');
    expect(html).toContain('data-callout="warning"');
    expect(html).toContain('<div class="callout-title">Warning</div>');
    expect(html).toContain('<p>Careful.</p>');
  });

  test('keeps a custom title, including its formatting', async () => {
    const html = await render('> [!note] A *fine* title\n> Body');
    expect(html).toContain('A <em>fine</em> title');
    expect(html).toContain('<p>Body</p>');
  });

  test('maps aliases to the styled type', async () => {
    expect(await render('> [!tldr] x')).toContain('data-callout="abstract"');
  });

  test('foldable callouts use details, open only with +', async () => {
    const closed = await render('> [!tip]- Closed\n> Body');
    const open = await render('> [!tip]+ Open\n> Body');
    expect(closed).toContain('<details class="callout" data-callout="tip">');
    expect(closed).toContain('<summary class="callout-title">Closed</summary>');
    expect(open).toContain('<details class="callout" data-callout="tip" open>');
  });

  test('nests', async () => {
    const html = await render('> [!note] Outer\n> > [!danger] Inner\n> > Body');
    expect(html).toContain('data-callout="note"');
    expect(html).toContain('data-callout="danger"');
  });

  test('leaves ordinary quotes alone', async () => {
    expect(await render('> Just a quote')).toContain('<blockquote>');
  });

  test('wikilinks work inside callouts', async () => {
    expect(await render('> [!note] See [[Gamma]]')).toContain('href="/posts/gamma-custom/"');
  });
});

describe('comments', () => {
  test('removes inline comments', async () => {
    expect(await render('Keep %%secret%% this.')).toBe('<p>Keep  this.</p>');
  });

  test('removes formatted text inside a comment', async () => {
    const html = await render('Keep %%a **bold secret** b%% this.');
    expect(html).not.toContain('secret');
    expect(html).toContain('Keep');
    expect(html).toContain('this.');
  });

  test('removes comments that span paragraphs', async () => {
    const html = await render('Before\n\n%%\nsecret one\n\nsecret two\n%%\n\nAfter');
    expect(html).not.toContain('secret');
    expect(html).toContain('Before');
    expect(html).toContain('After');
  });

  test('removes code and links inside a comment', async () => {
    const html = await render('%%\n```\nsecret\n```\n\n[[Gamma]]\n%%\n\nAfter');
    expect(html).not.toContain('secret');
    expect(html).not.toContain('gamma');
  });

  test('an unclosed comment hides the rest of the note', async () => {
    expect(await render('Before\n\n%% secret\n\nstill secret')).toBe('<p>Before</p>');
  });

  test('keeps %% inside code', async () => {
    expect(await render('`50%% off`')).toContain('50%% off');
  });
});

test('highlights', async () => {
  expect(await render('A ==marked== word')).toContain('<mark>marked</mark>');
  expect(await render('1 == 2 == 3')).not.toContain('<mark>');
  expect(await render('==[[Gamma]]==')).toContain('<mark><a');
});

describe('block ids', () => {
  test('moves the marker onto the paragraph', async () => {
    const html = await render('Some text ^abc-1');
    expect(html).toBe('<p id="block-abc-1">Some text</p>');
  });

  test('a marker on its own line tags the block above', async () => {
    const html = await render('- one\n- two\n\n^list-1');
    expect(html).toContain('<ul id="block-list-1">');
    expect(html).not.toContain('^list-1');
  });
});

describe('unpublished notes', () => {
  test('render to nothing, so their images never reach the build', async () => {
    const html = await render('Private ![[Pasted image 1.png]]', { file: 'posts/Secret.md' });
    expect(html).toBe('');
  });
});

describe('islands', () => {
  const parts = async (markdown: string) => splitIslands(await render(markdown));

  test('turns a fence into an island with parsed, defaulted props', async () => {
    const [part] = await parts('```sim\ntype: loop\nspeed: 2\n```');
    expect(part).toEqual({
      kind: 'island',
      name: 'sim',
      props: { type: 'loop', speed: 2, nodes: 5 },
    });
  });

  test('accepts an empty fence', async () => {
    expect((await parts('```sim\n```'))[0]).toMatchObject({ kind: 'island', name: 'sim' });
  });

  test('keeps the surrounding HTML in order', async () => {
    const kinds = (await parts('Before\n\n```sim\n```\n\nAfter')).map((part) => part.kind);
    expect(kinds).toEqual(['html', 'island', 'html']);
  });

  test('works inside a callout', async () => {
    const found = await parts('> [!note] Demo\n> ```sim\n> speed: 3\n> ```');
    expect(found.some((part) => part.kind === 'island')).toBe(true);
  });

  test('other languages stay code', async () => {
    expect(await render('```ts\nconst a = 1;\n```')).toContain('language-ts');
  });

  test('a typo in a prop stops a strict build', async () => {
    await expect(render('```sim\nsped: 2\n```')).rejects.toThrow('sped');
  });

  test('a bad value stops a strict build', async () => {
    await expect(render('```sim\ntype: spiral\n```')).rejects.toThrow('type');
  });

  test('broken YAML stops a strict build and names the line', async () => {
    await expect(render('Text\n\n```sim\nspeed: [\n```')).rejects.toThrow('near line 3');
  });

  test('a bad fence stays visible as code in dev', async () => {
    expect(await render('```sim\nsped: 2\n```', { strict: false })).toContain('<code');
  });
});
