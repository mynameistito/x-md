# Agent notes

## Frontend structure

- Pages: `index.html` (`src/main.ts`), `docs.html` (`src/docs.ts`), `dashboard.html` (`src/dashboard.ts`)
- Shared header/footer/mobile menu: `src/chrome.ts`
- Design tokens live in the Tailwind v4 `@theme` block in `src/style.css` (semantic colors: `ink`/`ink-2`/`ink-3`/`ink-4`, `surface`, `raised`, `line`, `hair`, `accent`, `cyan`). Use these utilities instead of hard-coded hex values in markup.
- `/docs` is rewritten to `/docs.html` in `vercel.json` and registered as a Rollup input in `vite.config.ts`.
