# x-md

- Pages: `index.html` (`src/main.ts`), `docs.html` (`src/docs.ts`). Shared chrome in `src/chrome.ts`. `/docs` rewrites to `/docs.html` in `vercel.json` and is a Rollup input in `vite.config.ts`.
- Tokens are the Tailwind v4 `@theme` block in `src/style.css` (`ink`..`ink-4`, `surface`, `raised`, `raised-2`, `line`, `hair`, `accent`, `accent-deep`, `accent-soft`, `cyan`, dark `code`/`code-ink`/`code-dim`). Use them, not hex.
- Look: warm paper `#f7f6f2`, Satoshi, deep green `#146c43`, pill buttons, 16px cards, near-black code panes. Not pcstyle.dev styling.
- Landing copy frame (Theo's feedback): "Tweets are just markdown now", what-you-see vs what-your-agent-sees curl comparison in the `#how` bento, skill install under `#agents`. No stack or provider talk on the landing page.
- Motion: GSAP + ScrollTrigger in `setupMotion` (`src/main.ts`), all gated by `prefers-reduced-motion` via `gsap.matchMedia`.
- Status URLs serve Markdown by default. Discord, Telegram, and Slack preview bots get Open Graph HTML from `lib/embed.ts` via `api/convert.ts`; `GET /oembed` rewrites to `api/oembed.ts`.
- Commit freely and push your own branches. Ask once before pushing to `main`, then keep going for the job.
