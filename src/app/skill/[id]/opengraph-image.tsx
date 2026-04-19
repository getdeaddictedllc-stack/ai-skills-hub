import { ImageResponse } from "next/og";
import { getSkillById, getAllSkills } from "@/lib/data-service";
import { getSkillPrice, PAID_MODE } from "@/lib/pricing";

export const runtime = "nodejs";
export const alt = "AI Skills Hub - Skill";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllSkills().map((s) => ({ id: s.id }));
}

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skill = getSkillById(id);

  if (!skill) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", backgroundColor: "#030712", color: "#fff", fontSize: 48 }}>
          Skill Not Found
        </div>
      ),
      { ...size }
    );
  }

  const price = getSkillPrice(skill);
  const diffColors: Record<string, string> = {
    beginner: "#22c55e",
    intermediate: "#eab308",
    advanced: "#f97316",
    expert: "#ef4444",
  };

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "60px",
          background: "linear-gradient(135deg, #030712 0%, #1e1b4b 50%, #030712 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                padding: "6px 16px",
                borderRadius: "999px",
                fontSize: "18px",
                fontWeight: 700,
                backgroundColor: diffColors[skill.difficulty] ?? "#6366f1",
                color: "#fff",
                textTransform: "capitalize" as const,
              }}
            >
              {skill.difficulty}
            </div>
            <div
              style={{
                padding: "6px 16px",
                borderRadius: "999px",
                fontSize: "18px",
                fontWeight: 600,
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "#d1d5db",
              }}
            >
              {skill.category}
            </div>
          </div>
          <div style={{ fontSize: "52px", fontWeight: 800, lineHeight: 1.1, maxWidth: "900px" }}>
            {skill.name}
          </div>
          <div style={{ fontSize: "22px", color: "#9ca3af", lineHeight: 1.4, maxWidth: "800px" }}>
            {skill.description.length > 150 ? skill.description.slice(0, 150) + "..." : skill.description}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#818cf8" }}>AI Skills Hub</div>
            <div style={{ fontSize: "18px", color: "#6b7280" }}>aiskillhub.info</div>
          </div>
          <div style={{ fontSize: "36px", fontWeight: 800, color: price === 0 ? "#22c55e" : "#fff" }}>
            {price === 0 ? "FREE" : `$${price.toFixed(2)}`}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
