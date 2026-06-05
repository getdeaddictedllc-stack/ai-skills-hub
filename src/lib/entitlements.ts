import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Durable on local dev (.data/), ephemeral on Vercel (/tmp). Tests override
// the path via ENTITLEMENTS_FILE so they never touch real data.
function entitlementsFile(): string {
  if (process.env.ENTITLEMENTS_FILE) return process.env.ENTITLEMENTS_FILE;
  const dir = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), ".data");
  return path.join(dir, "entitlements.jsonl");
}

export interface EntitlementRecord {
  email: string;
  itemId: string;
  sessionId: string;
  // Stripe PaymentIntent id — the stable link between the completed session and
  // a later charge.refunded / dispute event, so refunds can find what to revoke.
  paymentIntentId: string;
  ts: string;
}

async function readAll(): Promise<EntitlementRecord[]> {
  try {
    const raw = await readFile(entitlementsFile(), "utf-8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as EntitlementRecord);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

/**
 * Grant the given items to a customer. Idempotent per Stripe session: replaying
 * the same `sessionId` (Stripe delivers webhooks at-least-once) grants nothing
 * new. Returns the records created by THIS call (empty on a replay).
 */
export async function grantEntitlements(
  email: string,
  itemIds: string[],
  sessionId: string,
  paymentIntentId = ""
): Promise<EntitlementRecord[]> {
  const normalizedEmail = email.trim().toLowerCase();
  const items = Array.from(new Set(itemIds.map((id) => id.trim()).filter(Boolean)));
  if (!normalizedEmail || items.length === 0) return [];

  const existing = await readAll();
  if (existing.some((r) => r.sessionId === sessionId)) return [];

  const ts = new Date().toISOString();
  const records: EntitlementRecord[] = items.map((itemId) => ({
    email: normalizedEmail,
    itemId,
    sessionId,
    paymentIntentId,
    ts,
  }));

  const file = entitlementsFile();
  await mkdir(path.dirname(file), { recursive: true });
  await appendFile(file, records.map((r) => JSON.stringify(r)).join("\n") + "\n", "utf-8");

  console.log("[ENTITLEMENT] granted", JSON.stringify({ email: normalizedEmail, items, sessionId }));
  return records;
}

/**
 * Revoke every entitlement tied to a Stripe PaymentIntent — used on refund or
 * dispute. Idempotent: revoking an unknown/already-revoked payment removes
 * nothing and is a safe no-op. Returns the number of records removed.
 */
export async function revokeByPaymentIntent(paymentIntentId: string): Promise<number> {
  if (!paymentIntentId) return 0;
  const records = await readAll();
  const remaining = records.filter((r) => r.paymentIntentId !== paymentIntentId);
  const removed = records.length - remaining.length;
  if (removed === 0) return 0;

  const file = entitlementsFile();
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(
    file,
    remaining.map((r) => JSON.stringify(r)).join("\n") + (remaining.length ? "\n" : ""),
    "utf-8"
  );

  console.log("[ENTITLEMENT] revoked", JSON.stringify({ paymentIntentId, removed }));
  return removed;
}

/** True if the customer owns the given item. */
export async function hasEntitlement(email: string, itemId: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  const records = await readAll();
  return records.some((r) => r.email === normalizedEmail && r.itemId === itemId);
}

/** All items the customer owns. */
export async function getEntitlements(email: string): Promise<string[]> {
  const normalizedEmail = email.trim().toLowerCase();
  const records = await readAll();
  return records.filter((r) => r.email === normalizedEmail).map((r) => r.itemId);
}
