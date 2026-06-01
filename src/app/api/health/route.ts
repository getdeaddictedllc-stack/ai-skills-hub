import { NextResponse } from "next/server";
import pkg from "../../../../package.json";

export const dynamic = "force-dynamic";

const START = Date.now();

export function GET() {
  return NextResponse.json({
    status: "ok",
    version: pkg.version,
    uptime: Math.round((Date.now() - START) / 1000),
    timestamp: new Date().toISOString(),
  });
}
