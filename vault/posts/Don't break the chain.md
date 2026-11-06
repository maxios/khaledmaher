---
description: Why an apostrophe can break a link in a Markdown pipeline, and how this site keeps links between notes working when it builds.
date: 2026-11-05
tags:
  - meta
publish: true
---

This post has no `title` in its frontmatter, so the site uses the file name. Its name contains an apostrophe on purpose, because that's an easy way to break a link.

## Why apostrophes matter

Many Markdown pipelines turn straight quotes into curly ones before anything else runs. If that happens first, a link to this post stops matching the file name. This site changes the quotes last, so the link in [[How this blog works]] still resolves.

Links are checked when the site builds, not when it's read. ^the-rule
