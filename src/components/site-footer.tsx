import { getSite } from "@/lib/site";
import { getContact } from "@/lib/content/links";

export function SiteFooter() {
  const site = getSite();
  const { links } = getContact();
  return (
    <footer className="mx-auto w-full max-w-2xl px-4 pb-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-border pt-6 text-sm text-muted">
        <p>
          © {site.name} · {site.location}
        </p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {links.map((s) => (
            <li key={s.url}>
              <a href={s.url} rel="me noopener" target="_blank" className="hover:text-fg">
                {s.platform}
              </a>
            </li>
          ))}
          <li>
            <a href="/rss.xml" className="hover:text-fg">
              RSS
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
