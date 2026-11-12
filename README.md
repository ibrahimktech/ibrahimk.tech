# ibrahimk.tech

Personal site of Ibrahim Kerimov (Ibrahim K): portfolio, blog and a learning log.

There is no CMS, no database and no admin panel. **All content is Markdown files in [`content/`](content/README.md).** You edit a file, push to `main` and Vercel deploys it.

**Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS 4, Markdown with gray-matter, unified/remark/rehype and Shiki for code highlighting. Every page is generated at build time.

## Editing content

Start with [content/README.md](content/README.md). Each folder has its own README and, where you add things, a `_template.md` to copy.

```
content/
├── blog/        one .md per post       → /blog, /blog/<name>
├── projects/    one .md per project    → /projects, /projects/<name>
├── learning/    one .md per course/book → /learning
├── about/       about.md               → name, intro, /about page
└── links/       links.md               → email + social links
```

Images go next to the `.md` file that uses them. Write just the file name (`image: "robot.png"`). They're copied into `public/content/` automatically, so don't edit that folder; it's generated and git-ignored.

Anything with `draft: true` shows only in `npm run dev`. Production leaves it out of every page, the sitemap and RSS, and its URL returns 404.

A typo in a setting, a missing image or a wrong value shows an error naming the file and what to fix, and stops `npm run build`, so it can't reach the live site.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000 (drafts visible)
```

Before pushing:

```bash
npm run lint
npm run build      # fails on bad content or type errors
npm start          # serve the production build (drafts hidden)
```

## Code layout

| Path                     | What                                                   |
| ------------------------ | ------------------------------------------------------ |
| `src/config.ts`          | Site URL (used for sitemap, RSS, canonical/OG tags)    |
| `src/lib/content/`       | Reads and validates each content folder                |
| `src/lib/markdown.ts`    | Markdown → HTML (GFM, heading ids, Shiki, local images) |
| `src/app/`               | Pages, sitemap, robots, RSS, OG image                  |
| `src/components/`        | UI pieces                                              |
| `src/app/globals.css`    | Colours (one accent), typography                       |
| `scripts/sync-content-images.mjs` | Copies content images to `public/content/` before dev/build |

## Deploy (Vercel)

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project**, import the repo, then deploy with the defaults. The framework is detected as Next.js, and no environment variables are needed.
3. Under **Project → Settings → Domains**, add `ibrahimk.tech`, and `www.ibrahimk.tech` redirecting to it, then set the DNS records Vercel shows you at your registrar.
4. Every push to `main` deploys to production. Other branches get preview URLs.

If the domain changes, update `SITE_URL` in `src/config.ts`.
