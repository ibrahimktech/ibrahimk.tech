import Link from "next/link";
import { getSite } from "@/lib/site";
import { NavLink } from "./nav-link";

const NAV = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/learning", label: "Learning" },
  { href: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const site = getSite();
  return (
    <header className="mx-auto flex w-full max-w-2xl flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-4 pb-12 pt-8 sm:px-6 sm:pt-12">
      <Link href="/" className="text-xl font-semibold tracking-tight">
        {site.brand}
      </Link>
      <nav aria-label="Main">
        <ul className="flex gap-4 text-sm sm:gap-6">
          {NAV.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href}>{item.label}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
