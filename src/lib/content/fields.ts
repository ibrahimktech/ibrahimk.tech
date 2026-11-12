import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Shared reading + validation for everything in /content.
 * Any problem throws a ContentError naming the file and what to fix, which
 * shows in the dev overlay and stops `npm run build`.
 */

export const CONTENT_DIR = path.join(process.cwd(), "content");
/** Images from /content are copied here so they can be served (git-ignored). */
const PUBLIC_MIRROR = path.join(process.cwd(), "public", "content");
const IMAGE_EXT = /\.(png|jpe?g|webp|avif|gif|svg)$/i;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ContentError extends Error {
  constructor(file: string, message: string) {
    super(`${file}: ${message}`);
    this.name = "ContentError";
  }
}

export type MarkdownFile = {
  /** Repo-relative path for messages, e.g. "content/projects/decodedsat.md". */
  file: string;
  /** File name without ".md"; becomes the URL. */
  slug: string;
  /** Absolute folder of the file (relative images resolve from here). */
  dir: string;
  data: Record<string, unknown>;
  body: string;
};

/** In production, read each file once per build. In dev, re-read on every request. */
const CACHE = process.env.NODE_ENV === "production";

export function memo<T>(load: () => T): () => T {
  let value: T;
  let loaded = false;
  return () => {
    if (CACHE && loaded) return value;
    value = load();
    loaded = true;
    return value;
  };
}

/** Never published: templates/notes starting with "_" and README.md. */
function isIgnored(name: string): boolean {
  return name.startsWith("_") || name.toLowerCase() === "readme.md";
}

export function readFile(section: string, name: string): MarkdownFile {
  const abs = path.join(CONTENT_DIR, section, name);
  const file = `content/${section}/${name}`;
  if (!fs.existsSync(abs)) throw new ContentError(file, "this file is missing.");
  const { data, content } = matter(fs.readFileSync(abs, "utf8"));
  return { file, slug: name.replace(/\.md$/i, ""), dir: path.dirname(abs), data, body: content };
}

/** Every publishable .md file in content/<section>/. */
export function readSection(section: string): MarkdownFile[] {
  const dir = path.join(CONTENT_DIR, section);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.toLowerCase().endsWith(".md") && !isIgnored(name))
    .map((name) => readFile(section, name));
}

// --- Field helpers -----------------------------------------------------------

function present(value: unknown): boolean {
  return value !== undefined && value !== null && !(typeof value === "string" && value.trim() === "");
}

export function allowOnly(f: MarkdownFile, keys: readonly string[]): void {
  for (const key of Object.keys(f.data)) {
    if (!keys.includes(key)) {
      throw new ContentError(f.file, `unknown field "${key}". Allowed fields: ${keys.join(", ")}.`);
    }
  }
}

export function requireSlug(f: MarkdownFile): void {
  if (!SLUG_RE.test(f.slug)) {
    throw new ContentError(
      f.file,
      `the file name becomes the URL, so use lowercase words separated by dashes, e.g. "my-new-project.md".`,
    );
  }
}

export function text(f: MarkdownFile, key: string): string {
  const value = f.data[key];
  if (!present(value)) throw new ContentError(f.file, `"${key}" is required.`);
  if (typeof value !== "string" && typeof value !== "number") {
    throw new ContentError(f.file, `"${key}" must be text.`);
  }
  return String(value).trim();
}

export function optionalText(f: MarkdownFile, key: string): string | null {
  return present(f.data[key]) ? text(f, key) : null;
}

export function bool(f: MarkdownFile, key: string, hint = ""): boolean {
  const value = f.data[key];
  if (typeof value === "boolean") return value;
  if (value === "true" || value === "false") {
    throw new ContentError(f.file, `"${key}" must be true or false without quotes.`);
  }
  throw new ContentError(f.file, `"${key}" is required and must be true or false.${hint ? ` ${hint}` : ""}`);
}

export function optionalBool(f: MarkdownFile, key: string, fallback: boolean): boolean {
  return present(f.data[key]) ? bool(f, key) : fallback;
}

export function optionalNumber(f: MarkdownFile, key: string, fallback: number): number {
  const value = f.data[key];
  if (!present(value)) return fallback;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new ContentError(f.file, `"${key}" must be a number, e.g. ${key}: 1`);
  }
  return value;
}

export function choice<T extends string>(f: MarkdownFile, key: string, options: readonly T[]): T {
  const value = f.data[key];
  if (typeof value === "string" && (options as readonly string[]).includes(value)) return value as T;
  throw new ContentError(
    f.file,
    `"${key}" must be one of: ${options.join(", ")}${present(value) ? ` (got "${String(value)}")` : ""}.`,
  );
}

/** "YYYY-MM-DD". YAML turns unquoted dates into Date objects; both are accepted. */
export function date(f: MarkdownFile, key: string): string {
  const value = f.data[key];
  let iso: string | null = null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    iso = value.toISOString().slice(0, 10);
  } else if (typeof value === "string" && DATE_RE.test(value)) {
    const parsed = new Date(`${value}T00:00:00Z`);
    if (!Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value)) iso = value;
  }
  if (!iso) {
    throw new ContentError(f.file, `"${key}" must be a real date written as YYYY-MM-DD, e.g. 2026-11-10.`);
  }
  return iso;
}

export function checkUrl(file: string, label: string, value: string): string {
  let ok = false;
  try {
    ok = new URL(value).protocol === "https:";
  } catch {}
  if (!ok) throw new ContentError(file, `${label} "${value}" must be a full link starting with https://`);
  return value;
}

export function optionalUrl(f: MarkdownFile, key: string): string | null {
  const value = optionalText(f, key);
  return value === null ? null : checkUrl(f.file, `"${key}"`, value);
}

export function checkEmail(file: string, value: string): string {
  if (!EMAIL_RE.test(value)) throw new ContentError(file, `"${value}" doesn't look like an email address.`);
  return value;
}

/** A YAML list of short texts, e.g. `tags: [Hardware, Robotics]`. */
export function optionalList(f: MarkdownFile, key: string): string[] {
  const value = f.data[key];
  if (!present(value)) return [];
  if (!Array.isArray(value) || value.some((v) => typeof v !== "string" || v.trim() === "")) {
    throw new ContentError(f.file, `"${key}" must be a list, e.g. ${key}: [Hardware, Robotics]`);
  }
  return value.map((v: string) => v.trim());
}

// --- Images ------------------------------------------------------------------

/**
 * Copies a file from /content into public/content (only if new or changed)
 * and returns the URL it's served at.
 */
function publish(src: string): string {
  const rel = path.relative(CONTENT_DIR, src);
  const dest = path.join(PUBLIC_MIRROR, rel);
  const srcStat = fs.statSync(src);
  let fresh = false;
  try {
    const destStat = fs.statSync(dest);
    fresh = destStat.size === srcStat.size && destStat.mtimeMs >= srcStat.mtimeMs;
  } catch {}
  if (!fresh) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
  return `/content/${rel.split(path.sep).map(encodeURIComponent).join("/")}`;
}

/**
 * Turns an image reference written in a content file into a URL.
 * - "photo.png" or "images/photo.png": relative to the .md file (recommended)
 * - "/something.png": a file in /public
 */
export function resolveImage(f: MarkdownFile, value: string, label: string): string {
  return resolveImageFile(f, value, label).url;
}

/** Like resolveImage, but also returns the image's path on disk. */
export function resolveImageFile(
  f: MarkdownFile,
  value: string,
  label: string,
): { url: string; path: string } {
  const ref = value.trim();
  const folder = path.relative(process.cwd(), f.dir).split(path.sep).join("/");

  if (/^[a-zA-Z]:[\\/]/.test(ref) || ref.startsWith("\\\\")) {
    const name = ref.replace(/\\/g, "/").split("/").pop();
    throw new ContentError(
      f.file,
      `${label} "${ref}" is a full path on your computer. Put the image in ${folder}/ and write just its name: "${name}".`,
    );
  }
  if (/^https?:\/\//i.test(ref)) {
    throw new ContentError(f.file, `${label} must be a file in ${folder}/, not a web link.`);
  }
  if (!IMAGE_EXT.test(ref)) {
    throw new ContentError(f.file, `${label} "${ref}" must be a .png, .jpg, .webp, .avif, .gif or .svg file.`);
  }

  if (ref.startsWith("/")) {
    const inPublic = path.join(process.cwd(), "public", ref);
    if (!fs.existsSync(inPublic)) {
      throw new ContentError(f.file, `${label} "${ref}" not found in /public.`);
    }
    return { url: ref, path: inPublic };
  }

  const src = path.resolve(f.dir, ref);
  if (!src.startsWith(CONTENT_DIR + path.sep)) {
    throw new ContentError(f.file, `${label} "${ref}" must be inside the content folder.`);
  }
  if (!fs.existsSync(src)) {
    throw new ContentError(f.file, `${label} "${ref}" not found. Put the file in ${folder}/ next to this .md file.`);
  }
  return { url: publish(src), path: src };
}

export function optionalImage(f: MarkdownFile, key: string): string | null {
  const value = optionalText(f, key);
  return value === null ? null : resolveImage(f, value, `"${key}"`);
}
