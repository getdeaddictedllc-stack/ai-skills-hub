import { NextRequest, NextResponse } from "next/server";
import { getSkillById, getRelatedSkills } from "@/lib/data-service";
import { generateSkillFileContent } from "@/lib/skill-file-generator";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const skill = getSkillById(id);

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  const related = getRelatedSkills(id, 5);

  return NextResponse.json(
    {
      data: {
        ...skill,
        filePreview: generateSkillFileContent(skill).split("\n").slice(0, 30).join("\n"),
        related: related.map((s) => ({ id: s.id, name: s.name, industry: s.industry, difficulty: s.difficulty })),
      },
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=3600",
      },
    }
  );
}
