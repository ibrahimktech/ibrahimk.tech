import type { Metadata } from "next";
import { getPosts } from "@/lib/content/blog";
import { PageTitle } from "@/components/section";
import { PostList } from "@/components/post-list";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Blog",
    description: "Writing about building products, code and what I learn along the way.",
    path: "/blog",
  });
}

export default function BlogPage() {
  const posts = getPosts();
  return (
    <>
      <PageTitle
        title="Blog"
        lead="Notes on building products, code, and what I learn along the way."
      />
      <PostList posts={posts} showDescription headingLevel={2} />
      <p className="mt-12 text-sm text-muted">
        Subscribe via{" "}
        <a href="/rss.xml" className="link">
          RSS
        </a>
        .
      </p>
    </>
  );
}
