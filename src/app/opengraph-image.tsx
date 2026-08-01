import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Suprabase — Full Stack & AI Engineering Learning Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default Open Graph / Twitter social preview. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(145deg, #14151a 0%, #1c1917 48%, #3a2424 100%)",
          padding: "64px 72px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background:
                "linear-gradient(145deg, #e56b68 0%, #a7423d 55%, #5f3435 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                color: "#fafafa",
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: "-0.03em",
              }}
            >
              Suprabase
            </div>
            <div
              style={{
                color: "rgba(250,250,250,0.55)",
                fontSize: 18,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Learn · Build · Ship
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              color: "#fafafa",
              fontSize: 58,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.08,
              maxWidth: 920,
            }}
          >
            Become the developer companies actually hire.
          </div>
          <div
            style={{
              color: "rgba(250,250,250,0.68)",
              fontSize: 26,
              lineHeight: 1.35,
              maxWidth: 860,
            }}
          >
            Full Stack Development, AI Engineering, System Design, and DevOps —
            with real projects, an AI mentor, and verifiable certifications.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "rgba(250,250,250,0.45)",
            fontSize: 18,
          }}
        >
          <span>AI Learning Platform · Developer Roadmap · Certifications</span>
          <span style={{ color: "#f3aaa0" }}>suprabase.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
