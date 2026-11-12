import {
  allowOnly,
  bool,
  choice,
  date,
  memo,
  optionalText,
  optionalUrl,
  readSection,
  text,
  type MarkdownFile,
} from "./fields";
import { SHOW_DRAFTS } from "../drafts";

export const LEARNING_KINDS = ["course", "book", "video", "article", "talk", "podcast", "note"] as const;
export type LearningKind = (typeof LEARNING_KINDS)[number];

export const LEARNING_STATUSES = ["in-progress", "done"] as const;
export type LearningStatus = (typeof LEARNING_STATUSES)[number];

export const KIND_LABEL: Record<LearningKind, string> = {
  course: "Course",
  book: "Book",
  video: "Video",
  article: "Article",
  talk: "Talk",
  podcast: "Podcast",
  note: "Note",
};

const FIELDS = ["title", "kind", "source", "url", "date", "status", "draft"] as const;

export type LearningEntry = {
  slug: string;
  title: string;
  kind: LearningKind;
  source: string | null;
  url: string | null;
  date: string;
  status: LearningStatus;
  draft: boolean;
  /** Body of the file: your notes/takeaways, rendered on the card. */
  file: MarkdownFile;
};

function parse(f: MarkdownFile): LearningEntry {
  allowOnly(f, FIELDS);
  return {
    slug: f.slug,
    title: text(f, "title"),
    kind: choice(f, "kind", LEARNING_KINDS),
    source: optionalText(f, "source"),
    url: optionalUrl(f, "url"),
    date: date(f, "date"),
    status: choice(f, "status", LEARNING_STATUSES),
    draft: bool(f, "draft", `Add "draft: true" (only visible in dev) or "draft: false" (published).`),
    file: f,
  };
}

const loadAll = memo(() =>
  readSection("learning")
    .map(parse)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title)),
);

/** Visible entries (no drafts in production), newest first. */
export function getLearning(): LearningEntry[] {
  return loadAll().filter((e) => SHOW_DRAFTS || !e.draft);
}
