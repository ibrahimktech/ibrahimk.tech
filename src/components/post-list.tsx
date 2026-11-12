import Link from "next/link";
import type { Post } from "@/lib/content/blog";
import { formatDate } from "@/lib/format";

export function DraftBadge() {
  return (
    <span className="ml-2 rounded border border-accent px-1.5 py-px align-middle font-sans text-[11px] font-medium uppercase tracking-wide text-accent">
      Draft
    </span>
  );
}

export function PostList({
  posts,
  showDescription = false,
  headingLevel = 3,
}: {
  posts: Post[];
  showDescription?: boolean;
  /** h2 directly under a page h1, h3 under a section h2. */
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  if (posts.length === 0) {
    return <p className="text-muted">No posts yet. The first one is on its way.</p>;
  }
  return (
    <ul className="space-y-6">
      {posts.map((post) => (
        <li key={post.slug} className="border-l-2 border-accent py-0.5 pl-4">
          <Link href={`/blog/${post.slug}`} className="group block">
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <Heading className="text-lg font-medium leading-snug tracking-tight group-hover:underline group-hover:decoration-accent group-hover:underline-offset-4">
                {post.title}
                {post.draft && <DraftBadge />}
              </Heading>
              <time dateTime={post.date} className="shrink-0 text-sm tabular-nums text-muted">
                {formatDate(post.date, "short")}
              </time>
            </div>
            {showDescription && <p className="mt-1 text-muted">{post.description}</p>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
