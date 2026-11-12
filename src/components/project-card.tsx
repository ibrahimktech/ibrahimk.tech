import Image from "next/image";
import Link from "next/link";
import type { Project, ProjectStatus } from "@/lib/content/projects";
import { displayHost } from "@/lib/format";
import { DraftBadge } from "./post-list";

const STATUS: Record<ProjectStatus, { label: string; dot: string }> = {
  live: { label: "Live", dot: "bg-accent" },
  building: { label: "Building", dot: "border border-accent" },
  archived: { label: "Archived", dot: "bg-muted/50" },
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const s = STATUS[status];
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted">
      <span aria-hidden="true" className={`size-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export function Tags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded border border-border bg-surface px-1.5 py-px text-[11px] font-medium uppercase tracking-wider text-muted"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

/** Small square image, or the project's initials when there's no image. */
export function ProjectThumb({ project, size = "sm" }: { project: Project; size?: "sm" | "lg" }) {
  const box = size === "lg" ? "size-20 sm:size-24" : "size-16 sm:size-20";
  const initials = project.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      className={`${box} relative flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-surface`}
    >
      {project.image ? (
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          sizes="96px"
          unoptimized={project.image.src.endsWith(".svg")}
          className="object-cover"
        />
      ) : (
        <span aria-hidden="true" className="text-xl font-semibold text-muted">
          {initials}
        </span>
      )}
    </div>
  );
}

/** Full-width row: image on the left, details on the right. Links to the project page. */
export function ProjectCard({
  project,
  headingLevel = 3,
}: {
  project: Project;
  /** h2 directly under a page h1, h3 under a section h2. */
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const extra = [project.metric, project.url && displayHost(project.url)].filter(Boolean);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex gap-4 rounded-lg border border-border p-4 transition-colors hover:border-muted/60 sm:gap-5 sm:p-5"
    >
      <ProjectThumb project={project} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <Heading className="text-lg font-semibold leading-snug tracking-tight decoration-accent underline-offset-4 group-hover:underline">
            {project.name}
            {project.draft && <DraftBadge />}
          </Heading>
          <StatusBadge status={project.status} />
        </div>
        <p className="mt-1 text-muted">{project.description}</p>
        {(project.tags.length > 0 || extra.length > 0) && (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
            <Tags tags={project.tags} />
            {extra.length > 0 && <span>{extra.join(" · ")}</span>}
          </div>
        )}
      </div>
    </Link>
  );
}
