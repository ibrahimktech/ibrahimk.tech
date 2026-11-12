import type { Metadata } from "next";
import { getLearning } from "@/lib/content/learning";
import { PageTitle, Section } from "@/components/section";
import { LearningList } from "@/components/learning-list";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Learning",
    description: "A running log of the courses, books and videos I'm learning from, and what I took away.",
    path: "/learning",
  });
}

export default function LearningPage() {
  const entries = getLearning();
  const current = entries.filter((e) => e.status === "in-progress");
  const done = entries.filter((e) => e.status === "done");

  return (
    <>
      <PageTitle
        title="Learning"
        lead="A running log of courses, books and videos I'm learning from, and what I took away from each."
      />

      {entries.length === 0 && <p className="text-muted">Nothing logged yet.</p>}

      {current.length > 0 && (
        <Section title="Now">
          <LearningList entries={current} />
        </Section>
      )}

      {done.length > 0 && (
        <Section title="Finished">
          <LearningList entries={done} />
        </Section>
      )}
    </>
  );
}
