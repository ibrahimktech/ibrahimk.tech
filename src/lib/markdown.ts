import fs from "node:fs";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { getImageProps } from "next/image";
import { imageSize } from "image-size";
import type { Element, Root } from "hast";
import type { VFile } from "vfile";
import { resolveImageFile, type MarkdownFile } from "./content/fields";

type ImageResolver = (src: string) => { url: string; path: string };

/** Body images are at most the text column wide (max-w-2xl minus padding). */
const BODY_IMAGE_SIZES = "(min-width: 672px) 624px, 100vw";
/** Formats the Next.js image optimizer resizes and converts to WebP/AVIF. */
const OPTIMIZABLE = /\.(png|jpe?g|webp|avif)$/i;

function readDimensions(file: string): { width: number; height: number } | null {
  try {
    const d = imageSize(fs.readFileSync(file));
    if (!d.width || !d.height) return null;
    // Phone photos often store rotation in EXIF; 5–8 means rotated 90°.
    return d.orientation && d.orientation >= 5
      ? { width: d.height, height: d.width }
      : { width: d.width, height: d.height };
  } catch {
    return null;
  }
}

/**
 * Images in a content file's body:
 * - `![alt](photo.jpg)` points at a file next to the .md file (missing = clear error)
 * - served resized + as WebP/AVIF through the Next.js image optimizer
 * - width/height set from the file, so the page doesn't jump while loading
 * - `![alt](photo.jpg "Caption")` on its own line becomes a figure with a caption
 */
function rehypeContentImages() {
  return (tree: Root, file: VFile) => {
    const resolve = (file.data as { resolveImage?: ImageResolver }).resolveImage;

    const processImg = (img: Element) => {
      img.properties.loading = "lazy";
      img.properties.decoding = "async";
      const src = String(img.properties.src ?? "");
      if (!resolve || !src || /^(https?:|data:)/i.test(src)) return; // external image: leave as is

      const { url, path } = resolve(decodeURI(src));
      const dims = readDimensions(path);
      if (dims && OPTIMIZABLE.test(path)) {
        const { props } = getImageProps({
          src: url,
          alt: String(img.properties.alt ?? ""),
          width: dims.width,
          height: dims.height,
          sizes: BODY_IMAGE_SIZES,
        });
        img.properties.src = props.src;
        img.properties.srcSet = props.srcSet;
        img.properties.sizes = props.sizes;
      } else {
        img.properties.src = url; // svg/gif: served as-is
      }
      if (dims) {
        img.properties.width = dims.width;
        img.properties.height = dims.height;
      }
    };

    const visit = (parent: Root | Element) => {
      parent.children.forEach((child, i) => {
        if (child.type !== "element") return;

        if (child.tagName === "p") {
          const content = child.children.filter((c) => !(c.type === "text" && c.value.trim() === ""));
          const only = content[0];
          if (
            content.length === 1 &&
            only.type === "element" &&
            only.tagName === "img" &&
            only.properties.title
          ) {
            const caption = String(only.properties.title);
            delete only.properties.title;
            processImg(only);
            parent.children[i] = {
              type: "element",
              tagName: "figure",
              properties: {},
              children: [
                only,
                {
                  type: "element",
                  tagName: "figcaption",
                  properties: {},
                  children: [{ type: "text", value: caption }],
                },
              ],
            };
            return;
          }
        }

        if (child.tagName === "img") processImg(child);
        visit(child);
      });
    };

    visit(tree);
  };
}

// Markdown -> HTML at build time. Code blocks are highlighted by Shiki with a
// light and a dark theme; globals.css picks one based on the system theme.
// Raw HTML inside markdown is dropped (remark-rehype's default).
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeContentImages)
  .use(rehypePrettyCode, {
    theme: {
      light: "github-light-high-contrast",
      dark: "github-dark-high-contrast",
    },
    keepBackground: false,
    // Only fenced blocks; inline `code` stays plain.
    defaultLang: { block: "plaintext" },
  })
  .use(rehypeStringify);

/** Render the body of a content file. Returns "" for an empty body. */
export async function renderContent(source: MarkdownFile): Promise<string> {
  if (source.body.trim() === "") return "";
  const resolveImage: ImageResolver = (src) => resolveImageFile(source, src, "image");
  const file = await processor.process({ value: source.body, data: { resolveImage } });
  return String(file);
}
