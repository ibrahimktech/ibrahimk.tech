import { SITE_URL } from "@/config";
import { getProfile } from "./content/about";

/** Site-wide values used by the layout, metadata, RSS and social image. */
export function getSite() {
  const p = getProfile();
  return {
    url: SITE_URL,
    name: p.name,
    brand: p.brand,
    role: p.role,
    location: p.location,
    intro: p.intro,
    description: p.description,
  };
}
