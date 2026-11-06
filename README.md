# khaledmaher

The source of [khaledmaher.com](https://khaledmaher.com). Posts are written in Obsidian, built with Astro, and deployed to Cloudflare on every push to `main` here or in the private [khaledmaher-vault](https://github.com/maxios/khaledmaher-vault) repository, which holds the notes. The design lives in `design/khaledmaher-site.pen`, with its brand sheet in the same file.

## Getting started

You need [Bun](https://bun.sh) and Node 24. Astro 7 won't start on older versions of Node.

```sh
nvm use
bun install
git clone git@github.com:maxios/khaledmaher-vault.git vault
bun run dev
```

The site won't build without that clone. This repository ignores `vault/`, so Git commands for your notes run inside that folder.

In Obsidian, choose **Open folder as vault** and pick the `vault/` folder.

| Command           | What it does                         |
| ----------------- | ------------------------------------ |
| `bun run dev`     | Local site, with drafts visible      |
| `bun run build`   | Production build into `dist/`        |
| `bun run preview` | Serves `dist/` (runs in background; `bunx astro preview stop` ends it) |
| `bun test`        | Tests for the vault and Markdown code |
| `bun run check`   | Type check                           |
| `bun run deploy`  | Uploads `dist/` to Cloudflare        |

## Writing a post

Create a note in `vault/posts/`. The **Post** template fills in the properties.

```yaml
---
title: Optional. Defaults to the file name.
description: Required to publish. Aim for 120 to 160 characters.
date: 2026-11-06
updated: 2026-11-07   # optional
tags: [meta]
slug: custom-url      # optional. Defaults to the file name.
experience: loop      # optional. See "Adding an experience".
publish: true
---
```

**Nothing appears on the site until it has `publish: true`.** A published post also needs a `date` and a `description`, and the build stops without them. Drafts show up under `bun run dev` with a Draft badge, and they're left out of production builds entirely: pages, feed, sitemap, graph and images.

> [!warning]
> Drafts and `%%comments%%` are private because `khaledmaher-vault` is. Keep that repository private. Notes committed before the move to it are still in this public repository's history.

Notes in `vault/pages/` become top-level pages. `About.md` holds the words of `/about/`, and its layout is in `src/pages/about.astro`. Put a photo at `src/assets/portrait.jpg` and it appears on that page. Notes anywhere else can be used for your own reference and are never published.

To publish from the Mac, push the vault. Pull first, in case the phone got there before you.

```sh
cd vault
git pull
git add -A && git commit -m "Publish the new post"
git push
```

## Writing on an iPhone

The phone runs Obsidian, and [Working Copy](https://workingcopy.app) does the Git work. Pushing and linking a folder both need its Pro unlock.

1. In Obsidian, create an empty vault named `khaledmaher`, stored on the device rather than in iCloud.
2. In Working Copy, sign in to GitHub as `maxios` and clone `khaledmaher-vault`.
3. From the repository's title menu, choose **Link Repository to Folder** and pick the vault you created.
4. Reopen the vault in Obsidian. Your posts and templates should be there.

To publish, set `publish: true` on the note, then tap **Sync Now** in Working Copy. That commits, pulls and pushes in one step, and the site rebuilds within a couple of minutes. The **Sync Repository** action in Shortcuts does the same from the Home Screen.

Leave **Auto-Sync** off. It pushes whenever it sees a change, and every push starts a build.

Use one sync method per vault. Obsidian warns that syncing a vault through two services can corrupt it.

## What works

| Syntax                                      | On the site                                     |
| ------------------------------------------- | ----------------------------------------------- |
| `[[Note]]`, `[[Note\|alias]]`               | A link, using the note's title or the alias     |
| `[[Note#Heading]]`, `[[#Heading]]`          | A link to that heading                          |
| `[[Note#^block]]` and `^block` markers      | A link to that block                            |
| `[[Missing]]`, `[[Unpublished note]]`       | Plain text, with a warning in the build log     |
| `![[image.png]]`, `\|300`, `\|300x200`, `\|alt\|300` | An optimised image                     |
| `> [!type] Title`, `> [!type]-`, `> [!type]+` | A callout, optionally foldable, can be nested |
| `==highlight==`                             | Highlighted text                                |
| `%%comment%%`                               | Removed, even across paragraphs                 |
| Standard `[text](Note.md)` and `![](x.png)` | Resolved through the vault                      |

These don't work yet:

- `![[Note]]` shows a link to the note rather than its content.
- `![[clip.mp4]]`, and audio or PDF embeds, stop the build with a clear error. Only image embeds are supported.
- Inline `#tags` stay as text. Tags come from the `tags` property.
- Math and Mermaid aren't set up. Mermaid fences show as code.

A broken image embed or an invalid island fence in a published post stops the production build, so it can't ship. Under `bun run dev` they only warn.

## Adding an island

A fenced block can become a live React component. `Sim` is the example.

1. Add the component to `src/islands/`.
2. Add the fence language and its props to `src/islands/registry.ts`.
3. Add one line to `src/components/Island.astro`.

Then write it in a note. The body is YAML, checked against the schema at build time:

````md
```sim
type: loop
speed: 2
```
````

## Adding an experience

An experience is a post with its own layout. The words stay in Obsidian, and the layout lives in Astro.

1. Create `src/experiences/<name>.astro`. It receives `post`, `intro` and `sections`, with one section per `##` heading. `loop.astro` is the example.
2. Set `experience: <name>` in the note's properties.

## Editing the site

| What                                     | Where                     |
| ---------------------------------------- | ------------------------- |
| Name, description, email, links, nav     | `src/site.config.ts`      |
| The dictionary on the home page          | `src/data/dictionary.ts`  |
| Guides on the writing page               | `src/data/guides.ts`      |
| "What there is to show" on the About page | `src/data/proof.ts`       |

A guide's row becomes a link as soon as you give it a `url`. The Mindcache link falls back to the About page until `mindcacheUrl` is set.

## SEO

Most of it runs itself:

- Every page gets a title, description, canonical URL, Open Graph tags and Schema.org data from `src/components/Seo.astro` and `src/lib/schema.ts`. All of them describe one `Person`, so search engines see one author.
- The sitemap comes from the published pages, with `lastmod` taken from `updated`, or `date`.
- Tag pages and the 404 page are `noindex`, and stay out of the sitemap, because they only repeat other pages.
- `/llms.txt` lists the site for AI agents. Google doesn't use it.

Your part is the writing. Keep titles under 60 characters including the name, keep descriptions between 120 and 160, and use `site.description` word for word on other profiles.

Grammar labels in the hero are CSS content on purpose. As text, they would become part of the `<h1>`.

## Deploying

The site is a Cloudflare Worker named `khaledmaher` that serves `dist/`. No Worker code runs, and the settings are in `wrangler.jsonc`.

`.github/workflows/deploy.yml` checks out the notes, runs the tests, type check and build, then deploys. It runs on every push to `main`. A push to `khaledmaher-vault` starts it too, through a `repository_dispatch` event, and that event only reaches workflows on the default branch, so `main` has to stay the default. If a build fails, the site stays as it was. To deploy from your own machine, run `bun run build`, then `bun run deploy`.

| Secret                 | Repository          | What it is                                                                   |
| ---------------------- | ------------------- | ---------------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN` | `khaledmaher`       | From the **Edit Cloudflare Workers** template in the Cloudflare dashboard    |
| `VAULT_DEPLOY_KEY`     | `khaledmaher`       | Private half of the read-only deploy key on `khaledmaher-vault`              |
| `SITE_DISPATCH_TOKEN`  | `khaledmaher-vault` | Fine-grained token for `khaledmaher` only, with **Contents** set to write    |

Canonical URLs always use `https://khaledmaher.com`. Set `SITE_URL` to build for another address, and `BASE_PATH` for a subpath.

The domain reaches the Worker through the `routes` in `wrangler.jsonc`. Routes only run on proxied hostnames, so keep the proxied DNS records for `khaledmaher.com` and `www` in Cloudflare, even though the addresses in them are never used.

After launch, verify the domain in Google Search Console and Bing Webmaster Tools, and submit `sitemap-index.xml` to both.

## Why some things look the way they do

- **The notes have their own repository.** This one is public, and Working Copy links whole repositories rather than folders, so a vault inside this repository would bring `src/` to the phone.
- **Scripts run Astro on Node, not Bun.** The Bun runtime crashes loading React's server build. Bun still installs packages, runs scripts and runs the tests.
- **`build` passes `--force`.** Astro caches each note by its own text, so publishing a note wouldn't update the links to it in other notes.
- **The vault code uses `unified()` instead of Astro's default Markdown processor.** It gives access to the remark plugin ecosystem, and the vault code is a remark plugin.
- **`smartypants` is off, and re-added after the vault plugin.** It normally runs first and would curl the apostrophe in `[[Don't stop]]`, which breaks the link.
- **`font-optical-sizing` is off.** Newsreader's automatic optical size draws wider than the design and wraps the hero sentence.
- **`typescript` is pinned to 6.** `astro check` doesn't support 7 yet.
- **`overrides` pins `@emnapi/runtime`.** Otherwise Bun installs a beta that's incompatible with `@emnapi/core`, and `astro check` crashes.
