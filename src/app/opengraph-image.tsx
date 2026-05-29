import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "AI Skills Hub - Production-ready AI skills, workflows, and agents for every industry";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "70px",
          background: "linear-gradient(135deg, #030712 0%, #1e1b4b 50%, #030712 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "8px 18px",
              borderRadius: "999px",
              fontSize: "20px",
              fontWeight: 700,
              backgroundColor: "rgba(129,140,248,0.18)",
              color: "#a5b4fc",
            }}
          >
            500+ skills · 35+ industries
          </div>
          <div style={{ fontSize: "70px", fontWeight: 800, lineHeight: 1.05, maxWidth: "1000px" }}>
            Stop rewriting prompts. Ship production AI in hours.
          </div>
          <div style={{ fontSize: "28px", color: "#9ca3af", lineHeight: 1.4, maxWidth: "900px" }}>
            Production-ready AI skills, workflows, and agents by industry — system prompt, model config, contract, and integration code, done.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ fontSize: "30px", fontWeight: 800, color: "#818cf8" }}>AI Skills Hub</div>
            <div style={{ fontSize: "20px", color: "#6b7280" }}>aiskillhub.info</div>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#22c55e" }}>Free to browse →</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
