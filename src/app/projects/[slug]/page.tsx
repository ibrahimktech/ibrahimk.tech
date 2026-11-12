import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/content/projects";
import { renderContent } from "@/lib/markdown";
import { displayHost } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { ProjectThumb, StatusBadge, Tags } from "@/components/project-card";
import { DraftBadge } from "@/components/post-list";

// Only slugs returned below exist. Anything else (including drafts in
// production, which getProjects() leaves out) is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMetadata({
    title: project.name,
    description: project.description,
    path: `/projects/${project.slug}`,
    image: project.image?.src,
  });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const html = await renderContent(project.file);

  return (
    <article>
      <Link href="/projects" className="text-sm text-muted hover:text-fg">
        <span aria-hidden="true">←</span> Projects
      </Link>

      <header className="mb-8 mt-6 flex items-start gap-4 sm:gap-5">
        <ProjectThumb project={project} size="lg" />
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {project.name}
            {project.draft && <DraftBadge />}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
            <StatusBadge status={project.status} />
            <Tags tags={project.tags} />
          </div>
        </div>
      </header>

      <p className="text-lg leading-relaxed">{project.description}</p>

      {(project.url || project.metric) && (
        <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1">
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener" className="link font-medium">
              Visit {displayHost(project.url)} <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.metric && <span className="text-muted">{project.metric}</span>}
        </p>
      )}

      {html.trim() && (
        <div
          className="prose prose-lg mt-10 max-w-none border-t border-border pt-8 prose-headings:scroll-mt-8"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </article>
  );
}
