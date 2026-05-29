import { NextRequest, NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL ?? "noreply@aiskillhub.info";
const LEAD_NOTIFICATION_EMAIL = process.env.LEAD_NOTIFICATION_EMAIL ?? FROM_EMAIL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aiskillhub.info";

// Allow /tmp on serverless (Vercel), .data/ on local dev
const LEADS_DIR = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), ".data");
const LEADS_FILE = path.join(LEADS_DIR, "leads.jsonl");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { email?: string; source?: string } | null;

  if (!body?.email || !EMAIL_RE.test(body.email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  const source = (body.source ?? "homepage").slice(0, 64);
  const record = { email, source, ts: new Date().toISOString() };

  // 1. Always log — survives as long as Vercel log retention, easy to grep/export
  console.log("[LEAD]", JSON.stringify(record));

  // 2. Append to JSONL file (ephemeral on Vercel /tmp, durable locally)
  try {
    await mkdir(LEADS_DIR, { recursive: true });
    await appendFile(LEADS_FILE, JSON.stringify(record) + "\n", "utf-8");
  } catch (err) {
    console.warn("[LEAD] file append failed", err);
  }

  // 3. If Resend is live, notify the owner so the inbox is the durable queue
  if (RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `AI Skills Hub <${FROM_EMAIL}>`,
          to: [LEAD_NOTIFICATION_EMAIL],
          subject: `New lead: ${email}`,
          text: `Source: ${source}\nEmail: ${email}\nAt: ${record.ts}\nSite: ${SITE_URL}`,
        }),
      });
    } catch (err) {
      console.warn("[LEAD] Resend notification failed", err);
    }
  }

  return NextResponse.json({ ok: true });
}
