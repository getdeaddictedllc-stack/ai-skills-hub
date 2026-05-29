# Welcome Drip — AI Skills Hub

4-email onboarding sequence for leads captured via the homepage email form (`source: homepage_email_capture`).
Send via Resend once the domain is verified. Suggested cadence: Day 0, Day 2, Day 5, Day 9.
Goal of the sequence: deliver value first, then convert to the lifetime bundle.

Merge fields: `{{first_name}}` (fallback "there"), `{{bundle_url}}`, `{{unsubscribe_url}}`.

---

## Email 1 — Day 0 — Welcome + instant value

**Subject:** You're in. Here's the most-rewritten prompt on your team.
**Preheader:** Plus 3 production-ready skills to steal today.

Hi {{first_name}},

Welcome to AI Skills Hub. You'll get one email a week — the newest production-ready AI skills, workflows, and launch discounts. No spam, unsubscribe anytime.

To make this worth your inbox immediately, here are 3 skills teams reuse the most. Each one ships with the system prompt, model config, I/O contract, and integration code — copy, adapt, ship:

• **Document extractor** — pull structured fields out of any document, with a JSON output contract.
• **Ticket/intent classifier** — route and prioritize inbound messages with >90% accuracy on pinned models.
• **Grounded reply writer** — draft replies that stay inside your policy/source text.

→ Browse the full library: https://www.aiskillhub.info/skills

Reply and tell me the one AI task eating your team's time this month — I'll point you to the exact skill (or build it).

— The AI Skills Hub team

[Unsubscribe]({{unsubscribe_url}})

---

## Email 2 — Day 2 — Teach (the skill file format)

**Subject:** What turns a prompt into something you can actually ship
**Preheader:** The 5-part skill file format.

Hi {{first_name}},

A prompt someone wrote in Slack and a production skill are different things. The difference is five parts:

1. A **validated system prompt** — tested against real inputs.
2. **Model config** — which models it's tested on, temperature, max tokens.
3. An **input/output contract** — ideally a JSON schema.
4. **Guardrails** — how it handles missing/hostile/out-of-scope input.
5. **Integration code** — a snippet that calls it from your stack.

When a skill has all five, a teammate who's never seen it can ship with it in 5 minutes. That's the whole game.

We wrote the full playbook here:
→ https://www.aiskillhub.info/blog/production-ready-ai-skills-library-for-teams

— The AI Skills Hub team

[Unsubscribe]({{unsubscribe_url}})

---

## Email 3 — Day 5 — Workflows + social proof

**Subject:** Lego bricks beat one giant prompt
**Preheader:** Why workflows debug better than mega-prompts.

Hi {{first_name}},

The teams getting the most out of AI aren't writing bigger prompts. They're chaining small, testable skills into workflows:

classify → extract → retrieve → draft → review

Each step is independently testable. When the output is wrong, you know exactly which brick to fix — instead of praying at one 800-line mega-prompt.

We have ready-made multi-step workflows for support, sales, finance ops, and more:
→ https://www.aiskillhub.info/workflows

Pick one close to your use case and fork it.

— The AI Skills Hub team

[Unsubscribe]({{unsubscribe_url}})

---

## Email 4 — Day 9 — Convert (the bundle offer)

**Subject:** Everything, once — the Complete AI Skills Bundle
**Preheader:** Every skill, workflow, and industry. Lifetime access.

Hi {{first_name}},

You've seen how the pieces fit. Here's the shortcut.

The **Complete AI Skills Bundle** gives you lifetime access to every skill, every workflow, and every industry on AI Skills Hub — including everything we add later. One payment, no subscription.

The math is simple: if it saves your team even a single afternoon of prompt-wrangling, it's paid for itself.

→ Get the bundle: {{bundle_url}}

Not ready? No problem — you'll keep getting the weekly skills email. And if there's a skill you need that we don't have yet, just reply and tell me.

— The AI Skills Hub team

[Unsubscribe]({{unsubscribe_url}})
