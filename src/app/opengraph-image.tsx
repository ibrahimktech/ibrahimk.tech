import { ImageResponse } from "next/og";
import { getSite } from "@/lib/site";

const site = getSite();

// Default social preview image for every page (1200x630), generated at build.
export const alt = `${site.name} (${site.brand})`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#fafaf9",
          color: "#1c1917",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 20, height: 20, borderRadius: 999, background: "#c2410c" }} />
          <div style={{ fontSize: 36, color: "#57534e" }}>{site.url.replace("https://", "")}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: "-0.03em" }}>{site.name}</div>
          <div style={{ fontSize: 40, color: "#57534e", marginTop: 16 }}>
            {`${site.role} · ${site.location}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
