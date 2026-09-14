import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

export const runtime = "edge";
export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default branded social card (v2.1 §5). Navy backdrop + blue mark + wordmark. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          color: "white",
          backgroundColor: "#0B0E1A",
          backgroundImage:
            "radial-gradient(60% 80% at 85% 0%, rgba(37,99,235,0.45) 0%, transparent 60%), linear-gradient(135deg, #0B0E1A 0%, #101828 60%, #1B2540 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background: "#2563EB",
              fontSize: "44px",
              fontWeight: 700,
            }}
          >
            C
          </div>
          <div style={{ fontSize: "40px", fontWeight: 700, letterSpacing: "-0.02em" }}>
            {SITE.name}
          </div>
        </div>
        <div
          style={{
            fontSize: "72px",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginTop: "40px",
            maxWidth: "900px",
          }}
        >
          {SITE.tagline}
        </div>
        <div style={{ fontSize: "30px", opacity: 0.9, marginTop: "28px" }}>
          In-depth reviews · Buying guides · Honest verdicts
        </div>
      </div>
    ),
    { ...size },
  );
}
