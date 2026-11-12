import { allowOnly, checkEmail, checkUrl, ContentError, memo, readFile, text } from "./fields";

export type Social = {
  platform: string;
  handle: string | null;
  url: string;
};

export type Contact = {
  email: string;
  links: Social[];
};

export const getContact = memo((): Contact => {
  const f = readFile("links", "links.md");
  allowOnly(f, ["email", "links"]);

  const raw = f.data.links ?? [];
  if (!Array.isArray(raw)) {
    throw new ContentError(f.file, `"links" must be a list. Copy the format of an existing link.`);
  }

  const links = raw.map((item: unknown, i: number): Social => {
    const where = `link #${i + 1}`;
    if (typeof item !== "object" || item === null) {
      throw new ContentError(f.file, `${where} must have "platform" and "url".`);
    }
    const { platform, handle, url, ...rest } = item as Record<string, unknown>;
    const extra = Object.keys(rest);
    if (extra.length > 0) {
      throw new ContentError(f.file, `${where} has unknown field "${extra[0]}". Allowed: platform, handle, url.`);
    }
    if (typeof platform !== "string" || platform.trim() === "") {
      throw new ContentError(f.file, `${where} needs a "platform", e.g. platform: Instagram`);
    }
    if (typeof url !== "string") {
      throw new ContentError(f.file, `${where} (${platform}) needs a "url".`);
    }
    if (handle !== undefined && handle !== null && typeof handle !== "string") {
      throw new ContentError(f.file, `${where} (${platform}): "handle" must be text in quotes, e.g. "@name".`);
    }
    return {
      platform: platform.trim(),
      handle: typeof handle === "string" && handle.trim() !== "" ? handle.trim() : null,
      url: checkUrl(f.file, `${platform} url`, url.trim()),
    };
  });

  return { email: checkEmail(f.file, text(f, "email")), links };
});
