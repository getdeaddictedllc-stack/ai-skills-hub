# Progress

_Last updated: 2026-06-01_

## Done

- **Catalog**: 420 skills, 177 workflows, 12 agents, 35 industries, 11 blog posts.
- **Live on production**: https://www.aiskillhub.info (Vercel, `vercel --prod`).
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

- Human-gated revenue switches (tracked in `~/.rasm/action_queue.md`,
  tag `[skillhub-grow]`): Stripe Payment Link + keys + `PAID_MODE=true`,
  Resend verified domain, GA4 measurement ID.
- Reconnect Vercel Git integration (currently deploying via CLI only).
- Expand E2E coverage beyond the smoke path (checkout, auth).

## Decisions

- **Deploy on Vercel, not the multi-tenant VM** — apex `aiskillhub.info` → `www`.
- **Stripe via raw API fetch**, no SDK dependency — smaller bundle, fewer moving parts.
- **Revenue off by default behind env flags** — app is safe to ship and demo with
  zero credentials; flip flags to monetize.
