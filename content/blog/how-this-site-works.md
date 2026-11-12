---
title: "How this site works"
date: 2026-11-10
description: "A sample post that shows every formatting feature: headings, lists, quotes, tables and highlighted code."
draft: true
---

This is a sample post. It's marked `draft: true`, so you can see it while running `npm run dev`, but it won't appear on the live site, in the sitemap or in the RSS feed. Its URL returns a 404 in production.

## No CMS, just files

Everything on this site lives in the repository:

- Posts are Markdown files in `content/blog/`.
- Projects are Markdown files in `content/projects/`.
- Your bio lives in `content/about/` and social links in `content/links/`.
- The learning log lives in `content/learning/`.

Publishing means editing a file and pushing to `main`.

> If a required field is missing or misspelled, the build fails instead of shipping a broken page.

## Code

Fenced code blocks are highlighted at build time, with a light and a dark theme that follow your system setting:

```ts
type ProjectStatus = "live" | "building" | "archived";

export function isPublic(status: ProjectStatus): boolean {
  return status !== "archived";
}
```

```bash
npm run dev
```

## Tables

| File                   | What it holds            |
| ---------------------- | ------------------------ |
| `content/blog/`        | Blog posts               |
| `content/projects/`    | Portfolio projects       |
| `content/learning/`    | Courses, books and notes |

That's it. Delete this file, or copy `_template.md` to start a real post.
