import Link from "next/link";
import { getSite } from "@/lib/site";
import { getFeaturedProjects } from "@/lib/content/projects";
import { getPosts } from "@/lib/content/blog";
import { getLearning } from "@/lib/content/learning";
import { Section } from "@/components/section";
import { ProjectCard } from "@/components/project-card";
import { PostList } from "@/components/post-list";
import { LearningList } from "@/components/learning-list";
import { ContactLinks } from "@/components/contact";

export default function HomePage() {
  const site = getSite();
  const featured = getFeaturedProjects(3);
  const posts = getPosts().slice(0, 3);
  const learning = getLearning().slice(0, 3);

  return (
    <>
      <section aria-label="Introduction">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{site.name}</h1>
        <p className="mt-1 text-muted">
          {site.role} · {site.location}
        </p>
        <p className="mt-6 text-lg leading-relaxed">{site.intro}</p>
        <p className="mt-4">
          <Link href="/about" className="link">
            More about me
          </Link>
        </p>
      </section>

      {featured.length > 0 && (
        <Section title="Projects" more={{ href: "/projects", label: "All projects" }}>
          <ul className="grid gap-4">
            {featured.map((p) => (
              <li key={p.slug}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Writing" more={posts.length > 0 ? { href: "/blog", label: "All posts" } : undefined}>
        <PostList posts={posts} />
      </Section>

      {learning.length > 0 && (
        <Section title="Learning" more={{ href: "/learning", label: "Full log" }}>
          <LearningList entries={learning} showNotes={false} />
        </Section>
      )}

      <Section title="Contact">
        <p className="mb-4">The best way to reach me is email. I read everything.</p>
        <ContactLinks />
      </Section>
    </>
  );
}
