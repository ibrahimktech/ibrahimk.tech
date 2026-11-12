import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSite } from "@/lib/site";
import { rssAlternate } from "@/lib/metadata";
import "./globals.css";

// Downloaded from Google Fonts at build time and served from this site
// (no request to Google from visitors). Poppins isn't a variable font, so
// only the weights the site actually uses are included.
const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export function generateMetadata(): Metadata {
  const site = getSite();
  const title = `${site.name} (${site.brand})`;
  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s · ${site.brand}` },
    description: site.description,
    applicationName: site.brand,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    alternates: { canonical: "/", types: rssAlternate() },
    openGraph: {
      type: "website",
      siteName: site.brand,
      locale: "en_US",
      url: "/",
      title,
      description: site.description,
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans text-[15px] leading-relaxed sm:text-base">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded focus:bg-fg focus:px-3 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 pb-20 sm:px-6">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
