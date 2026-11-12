import {
  allowOnly,
  bool,
  choice,
  ContentError,
  memo,
  optionalBool,
  optionalImage,
  optionalList,
  optionalNumber,
  optionalText,
  optionalUrl,
  readSection,
  requireSlug,
  text,
  type MarkdownFile,
} from "./fields";
import { SHOW_DRAFTS } from "../drafts";

export const PROJECT_STATUSES = ["live", "building", "archived"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

const FIELDS = [
  "name",
  "description",
  "status",
  "url",
  "image",
  "imageAlt",
  "tags",
  "metric",
  "featured",
  "order",
  "draft",
] as const;

export type Project = {
  slug: string;
  name: string;
  /** One or two sentences: used on cards and for SEO. */
  description: string;
  status: ProjectStatus;
  url: string | null;
  image: { src: string; alt: string } | null;
  tags: string[];
  metric: string | null;
  featured: boolean;
  order: number;
  draft: boolean;
  file: MarkdownFile;
};

function parse(f: MarkdownFile): Project {
  requireSlug(f);
  allowOnly(f, FIELDS);

  const imageSrc = optionalImage(f, "image");
  const imageAlt = optionalText(f, "imageAlt");
  if (imageSrc && !imageAlt) {
    throw new ContentError(f.file, `"imageAlt" is required when there's an image. Describe what it shows.`);
  }

  return {
    slug: f.slug,
    name: text(f, "name"),
    description: text(f, "description"),
    status: choice(f, "status", PROJECT_STATUSES),
    url: optionalUrl(f, "url"),
    image: imageSrc && imageAlt ? { src: imageSrc, alt: imageAlt } : null,
    tags: optionalList(f, "tags"),
    metric: optionalText(f, "metric"),
    featured: optionalBool(f, "featured", false),
    order: optionalNumber(f, "order", 999),
    draft: bool(f, "draft", `Add "draft: true" (only visible in dev) or "draft: false" (published).`),
    file: f,
  };
}

const loadAll = memo(() =>
  readSection("projects")
    .map(parse)
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
);

/** Visible projects (no drafts in production), by `order`. */
export function getProjects(): Project[] {
  return loadAll().filter((p) => SHOW_DRAFTS || !p.draft);
}

export function getFeaturedProjects(limit = 3): Project[] {
  return getProjects()
    .filter((p) => p.featured)
    .slice(0, limit);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}
