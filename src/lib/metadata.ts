import type { Metadata } from "next";
import { getSite } from "./site";

export function rssAlternate() {
  return {
    "application/rss+xml": [{ url: "/rss.xml", title: `${getSite().brand} · Blog` }],
  };
}

/**
 * Per-page metadata with a canonical URL and matching Open Graph / Twitter tags.
 * Metadata merges shallowly, so a page's `openGraph` replaces the root one
 * entirely (including the image). Every page therefore goes through here.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  openGraph,
}: {
  title: string;
  description: string;
  path: string;
  /** Optional page-specific image URL, e.g. a post cover or project image. */
  image?: string | null;
  openGraph?: Metadata["openGraph"];
}): Metadata {
  const site = getSite();
  const fullTitle = `${title} · ${site.brand}`;
  const images = [
    image
      ? { url: image }
      : { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} (${site.brand})` },
  ];
  return {
    title,
    description,
    alternates: { canonical: path, types: rssAlternate() },
    openGraph: {
      type: "website",
      siteName: site.brand,
      locale: "en_US",
      title: fullTitle,
      description,
      url: path,
      images,
      ...openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images,
    },
  };
}
