import { KIND_LABEL, type LearningEntry } from "@/lib/content/learning";
import { renderContent } from "@/lib/markdown";
import { formatDate } from "@/lib/format";
import { DraftBadge } from "./post-list";

/** Each entry is its own bordered card, so separate items never blend together. */
export async function LearningList({
  entries,
  showNotes = true,
}: {
  entries: LearningEntry[];
  /** Render the notes written below the settings in each file. */
  showNotes?: boolean;
}) {
  const notes = showNotes ? await Promise.all(entries.map((e) => renderContent(e.file))) : [];

  return (
    <ul className="grid gap-4">
      {entries.map((e, i) => (
        <li key={e.slug}>
          <article className="rounded-lg border border-border p-5">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <span className="rounded border border-border bg-surface px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-muted">
                {KIND_LABEL[e.kind]}
              </span>
              <span className="text-sm text-muted">
                {e.status === "done" ? "Finished" : "Started"}{" "}
                <time dateTime={e.date}>{formatDate(e.date, "short")}</time>
              </span>
            </div>

            <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight">
              {e.url ? (
                <a href={e.url} target="_blank" rel="noopener" className="link">
                  {e.title}
                </a>
              ) : (
                e.title
              )}
              {e.draft && <DraftBadge />}
            </h3>
            {e.source && <p className="mt-0.5 text-sm text-muted">{e.source}</p>}

            {notes[i] && (
              <div
                className="prose prose-sans mt-4 max-w-none border-t border-border pt-4"
                dangerouslySetInnerHTML={{ __html: notes[i] }}
              />
            )}
          </article>
        </li>
      ))}
    </ul>
  );
}
