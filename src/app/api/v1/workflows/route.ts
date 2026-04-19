import { NextRequest, NextResponse } from "next/server";
import { filterWorkflows, sortWorkflows, paginateResults } from "@/lib/data-service";
import type { WorkflowSortOption } from "@/lib/data-service";
import type { Workflow } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const industry = searchParams.get("industry") ?? undefined;
  const complexity = searchParams.get("complexity") as Workflow["complexity"] | undefined;
  const search = searchParams.get("q") ?? undefined;
  const sort = (searchParams.get("sort") as WorkflowSortOption) || "name";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);

  let results = filterWorkflows({
    industry,
    complexity: complexity ? [complexity] : undefined,
    search,
  });

  results = sortWorkflows(results, sort);
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
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=300",
      },
    }
  );
}
