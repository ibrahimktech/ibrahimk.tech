import type { Metadata } from "next";
import { getProjects } from "@/lib/content/projects";
import { PageTitle } from "@/components/section";
import { ProjectCard } from "@/components/project-card";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Projects",
    description: `Things I've built and am building: ${getProjects()
      .map((p) => p.name)
      .join(", ")}.`,
    path: "/projects",
  });
}

export default function ProjectsPage() {
  const projects = getProjects();
  return (
    <>
      <PageTitle title="Projects" lead="Things I've built, things I'm building." />
      {projects.length === 0 ? (
        <p className="text-muted">Nothing here yet.</p>
      ) : (
        <ul className="grid gap-4">
          {projects.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} headingLevel={2} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
