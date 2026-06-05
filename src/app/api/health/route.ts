import { NextResponse } from "next/server";
import pkg from "../../../../package.json";
import { getStripeKeyMode, prodStripeMisconfig } from "@/lib/stripe-mode";

export const dynamic = "force-dynamic";

const START = Date.now();

export function GET() {
  const misconfig = prodStripeMisconfig();
  return NextResponse.json({
    status: misconfig ? "degraded" : "ok",
    version: pkg.version,
    uptime: Math.round((Date.now() - START) / 1000),
    timestamp: new Date().toISOString(),
    stripe: {
      mode: getStripeKeyMode(),
      ...(misconfig ? { warning: misconfig } : {}),
    },
  });
}
