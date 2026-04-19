import { ImageResponse } from "next/og";
import { getWorkflowById, getAllWorkflows } from "@/lib/data-service";
import { getWorkflowPrice } from "@/lib/pricing";

export const runtime = "nodejs";
export const alt = "AI Skills Hub - Workflow";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllWorkflows().map((w) => ({ id: w.id }));
}

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workflow = getWorkflowById(id);

  if (!workflow) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", backgroundColor: "#030712", color: "#fff", fontSize: 48 }}>
          Workflow Not Found
        </div>
      ),
      { ...size }
    );
  }

  const price = getWorkflowPrice(workflow);
  const complexColors: Record<string, string> = {
    simple: "#22c55e",
    moderate: "#3b82f6",
    complex: "#f97316",
    enterprise: "#a855f7",
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
          background: "linear-gradient(135deg, #030712 0%, #312e81 50%, #030712 100%)",
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
                backgroundColor: complexColors[workflow.complexity] ?? "#6366f1",
                color: "#fff",
                textTransform: "capitalize" as const,
              }}
            >
              {workflow.complexity}
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
              {workflow.steps.length} Steps
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
              {workflow.category}
            </div>
          </div>
          <div style={{ fontSize: "48px", fontWeight: 800, lineHeight: 1.1, maxWidth: "900px" }}>
            {workflow.name}
          </div>
          <div style={{ fontSize: "20px", color: "#9ca3af", lineHeight: 1.4, maxWidth: "800px" }}>
            {workflow.description.length > 160 ? workflow.description.slice(0, 160) + "..." : workflow.description}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#a78bfa" }}>AI Skills Hub</div>
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
