import { getSite } from "@/lib/site";
import { getPosts } from "@/lib/content/blog";
import { renderContent } from "@/lib/markdown";

// Generated once at build time. getPosts() excludes drafts in production.
export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

function rfc822(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toUTCString();
}

export async function GET() {
  const site = getSite();
  const posts = getPosts();

  const items = await Promise.all(
    posts.map(async (post) => {
      const url = `${site.url}/blog/${post.slug}`;
      // Make site-relative links/images absolute for feed readers.
      const html = (await renderContent(post.file)).replace(
        /(src|href)="\/(?!\/)/g,
        `$1="${site.url}/`,
      );
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(post.date)}</pubDate>
      <description>${escapeXml(post.description)}</description>
      <content:encoded>${cdata(html)}</content:encoded>
    </item>`;
    }),
  );

  const lastBuild = posts[0] ? `\n    <lastBuildDate>${rfc822(posts[0].date)}</lastBuildDate>` : "";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(`${site.brand} · Blog`)}</title>
    <link>${site.url}/blog</link>
    <description>${escapeXml(site.description)}</description>
    <language>en</language>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>${lastBuild}
${items.join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
