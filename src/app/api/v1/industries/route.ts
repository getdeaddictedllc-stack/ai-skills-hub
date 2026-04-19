import { NextResponse } from "next/server";
import { getAllIndustries, getIndustryStats } from "@/lib/data-service";

export async function GET() {
  const industries = getAllIndustries().map((ind) => {
    const stats = getIndustryStats(ind.id);
    return {
      ...ind,
      skillCount: stats.skillCount,
      workflowCount: stats.workflowCount,
      topSkills: stats.topSkills.map((s) => ({ id: s.id, name: s.name, popularity: s.popularity })),
    };
  });

  return NextResponse.json(
    { data: industries },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=3600",
      },
    }
  );
}
