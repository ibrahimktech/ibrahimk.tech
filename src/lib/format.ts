/** "2026-11-10" -> "November 10, 2026" (timezone-safe). */
export function formatDate(iso: string, month: "long" | "short" = "long"): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month,
    day: "numeric",
  });
}

/** "https://www.decodedsat.com/" -> "decodedsat.com" */
export function displayHost(url: string): string {
  return new URL(url).host.replace(/^www\./, "");
}
