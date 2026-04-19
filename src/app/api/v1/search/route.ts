import { NextRequest, NextResponse } from "next/server";
import { searchAll } from "@/lib/data-service";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";

  if (!q.trim()) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  const results = searchAll(q);

  return NextResponse.json(
    {
      data: {
        skills: results.skills.slice(0, 20),
        workflows: results.workflows.slice(0, 10),
        industries: results.industries.slice(0, 5),
      },
      meta: {
        query: q,
        totalSkills: results.skills.length,
        totalWorkflows: results.workflows.length,
        totalIndustries: results.industries.length,
      },
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=60",
      },
    }
  );
}
