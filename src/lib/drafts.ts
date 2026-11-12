/**
 * Anything with `draft: true` (posts, projects, learning entries) is shown in
 * `npm run dev` so you can preview it, and left out of every production build:
 * pages, home page, sitemap and RSS. Draft post and project URLs 404.
 */
export const SHOW_DRAFTS = process.env.NODE_ENV !== "production";
