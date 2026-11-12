import type { NextConfig } from "next";

// Cache Components is intentionally OFF. This is a fully static, file-based
// site: every page is generated at build time from files in the repo. Leaving
// it off lets us use `dynamicParams = false`, so unknown blog slugs (and drafts
// in production) are a hard 404 instead of being rendered on demand.
const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    // Pin the project root (a stray package-lock.json in a parent folder
    // otherwise makes Next guess the wrong workspace root).
    root: import.meta.dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
