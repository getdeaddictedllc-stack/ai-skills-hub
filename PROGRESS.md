# Progress

_Last updated: 2026-11-16_

## Done

- **Catalog**: 420 skills, 177 workflows, 12 agents, 35 industries, 11 blog posts.
- **Live on production**: https://aiskillhub.info, now self-hosted on the VM (pm2 `ai-skills-hub`,
  127.0.0.1:3990, nginx; www → apex 301). Stripe in live mode. Server-side catalog pricing at checkout.
  Privacy Policy + ToS pages shipped.
- **Lead-capture funnel**: homepage email capture → `/api/leads` (validates, logs
  `[LEAD]`, JSONL append, Resend owner notification when configured) → post-signup
  browse CTA. GA4 events wired (`lead_capture`, `post_signup_browse`).
- **Monetization, flag-gated**: `$99` bundle banner (`NEXT_PUBLIC_PAYMENT_LINK_URL`),
  per-item cart → Stripe checkout (`/api/checkout`), free-to-browse by default
  (`NEXT_PUBLIC_PAID_MODE`).
- **SEO**: dynamic OpenGraph cards (root `/opengraph-image.tsx` + per-skill OG),
  1,500-word cornerstone blog post, sitemap/metadata.
- **Observability**: `GET /api/health` → `{status, version, uptime, timestamp}`.
- **Marketing pack**: `docs/marketing/` — launch posts (LinkedIn/X/HN/PH/Reddit),
  5 cold DMs, 4-email welcome drip.
- **Quality gates green**: `tsc --noEmit` clean, `next lint` 0 warnings, build
  compiles, 167 Jest tests pass, Playwright smoke test on the lead funnel.
- **Docs**: README (quickstart + investor pitch), this file.

## Next

- **OUTAGE 2026-11-16**: the VM rebooted (07:46 UTC) and got a new ephemeral IP, 34.14.188.68.
  DNS still points to 34.14.131.5, so the site and every *.aiskillhub.info app time out publicly.
  Locally the app is healthy (`curl --resolve aiskillhub.info:443:127.0.0.1 https://aiskillhub.info/api/health` → ok).
  Fix = repoint the A-records and reserve a static IP. Both are queued for the operator (no gcloud/DNS scope here).

- Human-gated revenue switches (tracked in `~/.rasm/action_queue.md`,
  tag `[skillhub-grow]`): Stripe Payment Link + keys + `PAID_MODE=true`,
  Resend verified domain, GA4 measurement ID.
- Reconnect Vercel Git integration (currently deploying via CLI only).
- Expand E2E coverage beyond the smoke path (checkout, auth).

## Decisions

- ~~Deploy on Vercel~~ → moved to the multi-tenant VM on 2026-10-29 (`ecosystem.config.cjs`, port 3990).
- **Stripe via raw API fetch**, no SDK dependency — smaller bundle, fewer moving parts.
- **Revenue off by default behind env flags** — app is safe to ship and demo with
  zero credentials; flip flags to monetize.
