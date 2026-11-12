import Link from "next/link";

export function Section({
  title,
  more,
  children,
}: {
  title: string;
  more?: { href: string; label: string };
  children: React.ReactNode;
}) {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <section aria-labelledby={id} className="mt-16">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 id={id} className="text-xl font-semibold tracking-tight">
          {title}
        </h2>
        {more && (
          <Link href={more.href} className="text-sm text-muted hover:text-fg">
            {more.label} <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export function PageTitle({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="mb-12">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {lead && <p className="mt-3 text-muted">{lead}</p>}
    </div>
  );
}
