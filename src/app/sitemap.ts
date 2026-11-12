import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config";
import { getPosts } from "@/lib/content/blog";
import { getProjects } from "@/lib/content/projects";

// getPosts()/getProjects() exclude drafts in production, so drafts never reach the sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const latest = posts[0]?.date;

  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
      ...(latest ? { lastModified: latest } : {}),
    },
    { url: `${SITE_URL}/learning`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const projectPages: MetadataRoute.Sitemap = getProjects().map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...pages, ...projectPages, ...postPages];
}
