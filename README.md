# AI Skills Hub

**The production-ready library of AI skills, workflows, and agents for teams that ship.**
Stop rewriting prompts from scratch. Browse 420 battle-tested skills, 177 multi-step
workflows, and 12 domain agents across 35 industries — copy, adapt, ship in hours.

Live: **https://www.aiskillhub.info**

---

## Investor pitch

Every company is racing to put AI into production, and every one of them is
re-solving the same problem: turning a clever prompt into something reliable enough
to ship. AI Skills Hub is the system-of-record for that work — a curated catalog of
**420 production-ready skills, 177 workflows, and 12 industry agents spanning 35
verticals**, each with the prompt engineering, guardrails, and integration notes a
team needs to deploy the same day. We monetize through a freemium catalog (free to
browse, paid to unlock the full library and bundles) with Stripe-native checkout, a
lead-capture funnel, and an SEO content engine already driving organic discovery. The
catalog is the moat: it compounds with every skill we add, and it's the connective
tissue between the thousands of teams who need AI in production and the patterns that
actually work. We're free to browse today and one config flag away from revenue.

---

## Quickstart

```bash
git clone <repo-url> ai-skills-hub
cd ai-skills-hub
npm install
cp .env.example .env.local   # fill in values (see Configuration)
npm run dev                  # http://localhost:3000
```

### Quality gates

```bash
npm run lint        # ESLint (next/core-web-vitals) — 0 warnings
npx tsc --noEmit    # TypeScript strict typecheck
npm run build       # production build
npm test            # Jest unit suite
npm run test:e2e    # Playwright smoke test (lead-capture funnel)
```

Health check: `GET /api/health` → `{ "status": "ok", "version", "uptime", "timestamp" }`

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, server components) |
| Language | TypeScript (strict) |
| Auth | NextAuth |
| Payments | Stripe (raw API, feature-flagged) |
| Email | Resend (lead notifications + receipts) |
| Search | Fuse.js fuzzy search over the catalog |
| Hosting | Vercel (`vercel --prod`) |
| Tests | Jest (unit) + Playwright (E2E) |

---

## Configuration

Revenue and integrations are **off by default** behind environment flags so the app
runs free-to-browse with zero credentials. Set these in the Vercel dashboard (or
`.env.local`) to turn features on:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_PAID_MODE` | `false` = everything free; `true` after Stripe keys are set |
| `NEXT_PUBLIC_PAYMENT_LINK_URL` | Stripe Payment Link for the homepage $99 bundle banner |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Per-item cart → checkout flow |
| `RESEND_API_KEY` / `FROM_EMAIL` | Lead notifications + receipts (log-only until set) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 conversion events (already wired) |
| `NEXTAUTH_URL` / `NEXTAUTH_SECRET` | Auth session config |

Full go-live checklist: see [`SETUP.md`](./SETUP.md).

---

## Project structure

```
src/
  app/            # App Router pages + API routes (/api/health, /api/leads, /api/checkout)
  components/     # UI (home, catalog, layout)
  data/           # Catalog: skills.ts, workflows.ts, agents.ts, blog-posts.ts
  lib/            # data-service, pricing, industries, search
docs/marketing/   # Launch posts, cold DMs, welcome drip sequence
```

---

## License

Proprietary. All rights reserved.
