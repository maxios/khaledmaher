---
title: How this blog works
description: A tour of how this site is written in Obsidian and built with Astro, using every feature it supports, from wikilinks to live components.
date: 2026-11-06
tags:
  - meta
  - obsidian
publish: true
---

This site is written in Obsidian and built by Astro. Each post is a plain Markdown file in a git repository, so nothing is locked in. Pushing to `main` deploys it.

![[Pasted image 20261106071500.png|The path from a note to the site|640]]

## Links

Links use Obsidian's syntax. A plain link shows the post's title: [[Don't break the chain]]. An alias changes the words: [[Don't break the chain|like this]]. A heading link jumps to a section: [[Don't break the chain#Why apostrophes matter]]. A block link lands on one paragraph: [[Don't break the chain#^the-rule|the rule]].

Links to notes that don't exist yet stay as plain text, like [[A post for another day]]. The site never shows a broken link.

Every link also counts backwards. Open [[Don't break the chain]] and you'll find this post under "Linked from". The [graph](/graph/) is drawn from those same links.

## Callouts

> [!note]
> Callouts work the way they do in Obsidian.

> [!tip] A custom title, with *formatting*
> The body can hold anything, including [[Don't break the chain|links]].

> [!warning]- Folded callouts open on click
> This one starts closed. Use `+` instead of `-` to start open.

## Small things

You can ==highlight text== and use `inline code`. Comments like the one in this sentence%% this text never leaves the vault %% are removed from the page, so they're safe for notes to yourself.

```ts
const greeting: string = 'Code blocks are highlighted at build time';
```

## Interactive pieces

A fenced block with a registered language becomes a live React component. In Obsidian it stays a tidy code block:

````md
```sim
type: loop
speed: 2
```
````

On the site, it runs:

```sim
type: loop
speed: 2
caption: The fence above, running. Try the speed slider.
```

The same fence takes other props:

```sim
type: wave
speed: 1.5
```

Each one loads its JavaScript only when it scrolls into view, so a post with no interactive pieces ships no JavaScript at all.

## Longer pieces

Some posts need their own layout, like [[The loop, step by step]]. The prose stays in Obsidian and the layout lives in Astro.
