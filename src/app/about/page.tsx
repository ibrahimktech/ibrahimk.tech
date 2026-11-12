import type { Metadata } from "next";
import { getProfile } from "@/lib/content/about";
import { renderContent } from "@/lib/markdown";
import { PageTitle, Section } from "@/components/section";
import { ContactLinks } from "@/components/contact";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata(): Metadata {
  const p = getProfile();
  return pageMetadata({
    title: "About",
    description: `About ${p.name} (${p.brand}). ${p.description}`,
    path: "/about",
  });
}

export default async function AboutPage() {
  const html = await renderContent(getProfile().file);
  return (
    <>
      <PageTitle title="About" />

      {html.trim() && (
        <div className="prose prose-lg max-w-none prose-h2:text-[1.25em]" dangerouslySetInnerHTML={{ __html: html }} />
      )}

      <Section title="Contact">
        <ContactLinks />
      </Section>
    </>
  );
}
