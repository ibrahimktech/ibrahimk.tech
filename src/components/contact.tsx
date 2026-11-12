import { getContact } from "@/lib/content/links";

/** Email + social links (content/links/links.md), used on the home and about pages. */
export function ContactLinks() {
  const { email, links } = getContact();
  const rows = [
    { label: "Email", href: `mailto:${email}`, text: email, external: false },
    ...links.map((s) => ({
      label: s.platform,
      href: s.url,
      text: s.handle ?? s.url.replace(/^https:\/\/(www\.)?/, ""),
      external: true,
    })),
  ];
  return (
    // Phones: label above the link, so long addresses never break mid-word.
    <ul className="space-y-3 sm:space-y-2">
      {rows.map((r) => (
        <li key={r.href} className="flex flex-col sm:flex-row sm:items-baseline">
          <span className="text-sm text-muted sm:w-24 sm:shrink-0 sm:text-base">{r.label}</span>
          <a
            href={r.href}
            className="link min-w-0 break-words"
            {...(r.external ? { target: "_blank", rel: "me noopener" } : {})}
          >
            {r.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
