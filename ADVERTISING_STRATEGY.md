# x.md Advertising & Growth Strategy (Internal)

This document contains advertising, marketing, and distribution tactics. It is intentionally git-ignored and should never be committed or discussed publicly in the repository.

## Positioning
- Core value: Turn any public X post or thread into clean, structured Markdown/Obsidian notes with zero paid X API keys required for the base path.
- Free tier stays generous and anonymous for basic conversion.
- Premium (Starter/Pro) unlocks higher-volume agent usage, richer exports (JSON-LD, bulk), advanced parsing, and credit-based premium modes.
- Audience: Obsidian power users, AI agent builders, researchers, journalists, developers who consume social data programmatically, heavy X users who want archival + searchability.

## Primary Channels & Tactics
- Organic on X: Regular useful conversions posted from the tool, reply to interesting threads with the converted Markdown link, developer threads explaining the provider chain and why no key is needed.
- Product Hunt: Dedicated launch day with clear before/after, pricing transparency, and "self-host on Vercel" angle.
- Reddit: r/ObsidianMD (Obsidian export), r/selfhosted, r/DataHoarder, r/MachineLearning (for agent ingestion), r/IndieHackers, r/saas.
- Hacker News: "Show HN" when stable with real user stories and open-source link.
- Developer/AI newsletters: Sponsorships or free mentions once there is usage proof (e.g. "used by N agents daily").
- GitHub & README: Keep examples fresh, add "Used in production by..." case studies once real users exist, maintain excellent docs.
- Agent ecosystem: Promote the bundled skills (read-x-links-vercel, read-x-links-local). Target Cursor, Claude Projects, custom agent frameworks.
- Cross-posting: Convert high-signal X threads and share the Markdown version on LinkedIn, personal blogs, or as source material for other content.
- Partnerships / embeds: Reach out to note-taking tool authors, AI wrapper products, or research tooling for mutual mentions or integrations.
- Paid amplification (later): Targeted X ads to "Obsidian" + "AI agent" interests, or Reddit promoted posts once CAC can be measured.

## Content & Messaging Angles
- "No X API key tax": Emphasize that the default path is free and public-data only.
- "Agent-ready output": Structured Markdown + optional JSON-LD, Obsidian frontmatter, full thread context.
- "Self-hostable in one click": Vercel deploy button + open source.
- Credit system transparency: Show exactly what each premium mode costs in social credits.
- Real examples: Before/after of messy X thread → beautiful note or agent prompt.

## Funnel & Conversion
- Homepage convert box + pricing section + "Sign up free" CTA everywhere.
- Dashboard: immediate value (API keys, credit balance, plan management).
- Post-signup: prompt to create first API key and try a premium mode.
- Docs emphasize the path-style URLs and curl examples for agents.

## Measurement (once live)
- Track sign-ups via Clerk.
- Track paid conversions and churn via Autumn/Stripe dashboards.
- Monitor top sources of traffic and conversions (Vercel Analytics + custom logs in Convex if needed).
- Watch credit burn rate and feature usage to validate pricing.

## Timing & Sequencing
1. Get production keys live (Clerk prod, Convex prod, Autumn live + Stripe).
2. End-to-end test real checkout + real credit deduction + real API key usage.
3. Soft launch to personal network + small X posts.
4. Gather 5-10 real user quotes or before/after examples.
5. Product Hunt + broader push.
6. Iterate on pricing/credits based on actual usage data.

## Budget Notes
- Start with $0 (organic + launch platforms).
- Once revenue exists, allocate a % of MRR to paid amplification on X/Reddit.
- Track everything against actual Autumn revenue, not vanity metrics.

## Risks & Notes
- Do not over-promise on scrape fallbacks (Context.dev/Firecrawl) on the public hosted instance.
- Keep the free anonymous path fast and reliable; premium is for volume + advanced features.
- Compliance: clear terms, privacy policy, and "we only access public data" messaging.
- Never discuss or link this internal strategy document publicly.

Keep this file private. Update it as experiments run.
