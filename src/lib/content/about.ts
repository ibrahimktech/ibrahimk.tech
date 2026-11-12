import { allowOnly, memo, readFile, text, type MarkdownFile } from "./fields";

const FIELDS = ["name", "brand", "role", "location", "intro", "description"] as const;

export type Profile = {
  /** Full name, e.g. "Ibrahim Kerimov". */
  name: string;
  /** Short name in the header and page titles, e.g. "Ibrahim K". */
  brand: string;
  /** e.g. "Developer & entrepreneur". */
  role: string;
  location: string;
  /** Home page intro paragraph. */
  intro: string;
  /** One-line summary for search engines and social previews. */
  description: string;
  /** The About page itself (markdown body). */
  file: MarkdownFile;
};

export const getProfile = memo((): Profile => {
  const f = readFile("about", "about.md");
  allowOnly(f, FIELDS);
  return {
    name: text(f, "name"),
    brand: text(f, "brand"),
    role: text(f, "role"),
    location: text(f, "location"),
    intro: text(f, "intro"),
    description: text(f, "description"),
    file: f,
  };
});
