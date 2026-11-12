import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentPosts, getPost, getPosts } from "@/lib/content/blog";
import { renderContent } from "@/lib/markdown";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { getSite } from "@/lib/site";
import { DraftBadge } from "@/components/post-list";

// Only slugs returned below exist. Anything else (including drafts in
// production, which getPosts() leaves out) is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.cover,
    openGraph: {
      type: "article",
      publishedTime: post.date,
      authors: [getSite().name],
    },
  });
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const html = await renderContent(post.file);
  const { newer, older } = getAdjacentPosts(post.slug);

  return (
    <article>
      <Link href="/blog" className="text-sm text-muted hover:text-fg">
        <span aria-hidden="true">←</span> Blog
      </Link>

      <header className="mb-10 mt-6">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {post.title}
          {post.draft && <DraftBadge />}
        </h1>
        <p className="mt-3 text-sm text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true"> · </span>
          {post.readingMinutes} min read
        </p>
      </header>

      {post.cover && (
        <div className="relative mb-10 aspect-video overflow-hidden rounded-lg border border-border bg-surface">
          <Image src={post.cover} alt="" fill priority sizes="(min-width: 672px) 624px, 100vw" className="object-cover" />
        </div>
      )}

      <div
        className="prose prose-lg max-w-none prose-headings:scroll-mt-8"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {(newer || older) && (
        <nav aria-label="More posts" className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
          {older ? (
            <Link href={`/blog/${older.slug}`} className="group block">
              <span className="text-sm text-muted">
                <span aria-hidden="true">←</span> Previous
              </span>
              <span className="mt-1 block text-lg font-medium leading-snug group-hover:underline group-hover:decoration-accent group-hover:underline-offset-4">
                {older.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link href={`/blog/${newer.slug}`} className="group block sm:text-right">
              <span className="text-sm text-muted">
                Next <span aria-hidden="true">→</span>
              </span>
              <span className="mt-1 block text-lg font-medium leading-snug group-hover:underline group-hover:decoration-accent group-hover:underline-offset-4">
                {newer.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
