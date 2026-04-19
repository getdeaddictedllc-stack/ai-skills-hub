import { NextRequest, NextResponse } from "next/server";
import { getAllAgents, getAgentsByIndustry } from "@/data/agents";

export async function GET(req: NextRequest) {
  const industry = req.nextUrl.searchParams.get("industry");

  const agents = industry ? getAgentsByIndustry(industry) : getAllAgents();

  // Strip system prompts from list view (only full detail shows them)
  const sanitized = agents.map(({ systemPrompt, ...rest }) => ({
    ...rest,
    systemPromptPreview: systemPrompt.slice(0, 200) + "...",
    toolCount: rest.tools.length,
    tools: rest.tools.map((t) => ({ name: t.name, description: t.description })),
  }));

  return NextResponse.json(
    { data: sanitized, meta: { total: sanitized.length } },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=300",
      },
    }
  );
}
