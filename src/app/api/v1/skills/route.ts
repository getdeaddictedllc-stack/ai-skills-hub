import { NextRequest, NextResponse } from "next/server";
import { getAllSkills, searchSkills, sortSkills, paginateResults } from "@/lib/data-service";
import type { SkillSortOption } from "@/lib/data-service";
import type { Skill } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const apiKey = req.headers.get("x-api-key");

  // Rate limit header for transparency (actual rate limiting would use Redis/upstash)
  const headers = {
    "X-RateLimit-Limit": "100",
    "X-RateLimit-Remaining": "99",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
  };

  const q = searchParams.get("q") ?? "";
  const industry = searchParams.get("industry") ?? undefined;
  const difficulty = searchParams.get("difficulty") as Skill["difficulty"] | undefined;
  const sort = (searchParams.get("sort") as SkillSortOption) || "popularity";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);

  let results = searchSkills(q, {
    industry,
    difficulty: difficulty ? [difficulty] : undefined,
  });

  results = sortSkills(results, sort);
  const paginated = paginateResults(results, page, limit);

  return NextResponse.json(
    {
      data: paginated.items,
      meta: {
        total: paginated.total,
        page: paginated.page,
        pageSize: paginated.pageSize,
        totalPages: paginated.totalPages,
        hasNext: paginated.hasNext,
        hasPrev: paginated.hasPrev,
      },
    },
    { headers }
  );
}
