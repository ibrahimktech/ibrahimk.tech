import {
  allowOnly,
  bool,
  date,
  memo,
  optionalImage,
  readSection,
  requireSlug,
  text,
  type MarkdownFile,
} from "./fields";
import { SHOW_DRAFTS } from "../drafts";

const WORDS_PER_MINUTE = 220;
const FIELDS = ["title", "date", "description", "cover", "draft"] as const;

export type Post = {
  slug: string;
  title: string;
  /** "YYYY-MM-DD" */
  date: string;
  description: string;
  /** Image URL, or null. */
  cover: string | null;
  draft: boolean;
  readingMinutes: number;
  file: MarkdownFile;
};

function parse(f: MarkdownFile): Post {
  requireSlug(f);
  allowOnly(f, FIELDS);
  const words = f.body.trim().split(/\s+/).filter(Boolean).length;
  return {
    slug: f.slug,
    title: text(f, "title"),
    date: date(f, "date"),
    description: text(f, "description"),
    cover: optionalImage(f, "cover"),
    draft: bool(f, "draft", `Add "draft: true" (only visible in dev) or "draft: false" (published).`),
    readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    file: f,
  };
}

const loadAll = memo(() =>
  readSection("blog")
    .map(parse)
    .sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date))),
);

/** Posts visible in this environment (no drafts in production), newest first. */
export function getPosts(): Post[] {
  return loadAll().filter((p) => SHOW_DRAFTS || !p.draft);
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

/** `newer` is more recent, `older` is earlier. */
export function getAdjacentPosts(slug: string): { newer: Post | null; older: Post | null } {
  const posts = getPosts();
  const i = posts.findIndex((p) => p.slug === slug);
  if (i === -1) return { newer: null, older: null };
  return { newer: posts[i - 1] ?? null, older: posts[i + 1] ?? null };
}
