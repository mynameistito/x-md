import './style.css'
import { footerHtml, headerHtml, setupMobileMenu } from './chrome'

const app = document.querySelector<HTMLDivElement>('#app')!

const EXAMPLE_HANDLE = 'trq212'
const EXAMPLE_ID = '2052809885763747935'
const EXAMPLE_X_URL = `https://x.com/${EXAMPLE_HANDLE}/status/${EXAMPLE_ID}`
const EXAMPLE_HOSTED_URL = `https://x.pcstyle.dev/${EXAMPLE_HANDLE}/status/${EXAMPLE_ID}`
const EXAMPLE_PATH = `/${EXAMPLE_HANDLE}/status/${EXAMPLE_ID}`

const SECTIONS = [
  { id: 'hosted', label: 'How the hosted site works' },
  { id: 'routes', label: 'HTTP routes' },
  { id: 'params', label: 'Query params' },
  { id: 'formats', label: 'Output formats' },
  { id: 'articles', label: 'X Articles' },
  { id: 'agents', label: 'AI agents' },
  { id: 'deploy', label: 'Self-host on Vercel' },
]

const sidebarLinks = SECTIONS.map(
  (s) => `<a href="#${s.id}" class="docs-nav-link" data-section-link="${s.id}">${s.label}</a>`,
).join('\n          ')

app.innerHTML = `
<div class="x-root w-full overflow-x-clip">
  <a href="#docs-content" class="skip-link">Skip to content</a>
  ${headerHtml({ page: 'docs' })}

  <main class="mx-auto max-w-[1200px] px-6 pb-[112px] sm:px-8">
    <div class="pt-14 pb-12">
      <p class="eyebrow eyebrow-accent mb-3">Documentation</p>
      <h1 class="hero-h text-[clamp(32px,4vw,48px)] leading-[1.05] font-medium text-ink">Setup and API</h1>
      <p class="mt-4 max-w-[560px] text-[17px] leading-[1.6] text-ink-3">Use the hosted converter as-is, or fork and deploy your own stack on Vercel.</p>
    </div>

    <div class="grid gap-12 lg:grid-cols-[220px_1fr]">
      <nav aria-label="Docs sections" class="hidden lg:block">
        <div class="sticky top-24 flex flex-col gap-0.5">
          <p class="eyebrow eyebrow-muted mb-3 px-3">On this page</p>
          ${sidebarLinks}
        </div>
      </nav>

      <div id="docs-content" class="min-w-0 max-w-[760px]">
        <details class="mb-8 rounded-xl border border-hair bg-raised lg:hidden">
          <summary class="cursor-pointer list-none px-5 py-3.5 text-[14px] font-medium text-ink">On this page</summary>
          <div class="flex flex-col gap-0.5 border-t border-hair px-2 py-2">
            ${sidebarLinks}
          </div>
        </details>

        <article id="hosted" class="docs-article">
          <p class="eyebrow eyebrow-muted mb-3">Hosted</p>
          <h2 class="text-[24px] leading-tight font-semibold text-ink">How x.pcstyle.dev works</h2>
          <p class="mt-3 max-w-[640px] text-[16px] leading-relaxed text-ink-3">
            The public deploy is a read-only converter. Take any X status link and replace the host — keep the path identical:
          </p>
          <pre class="code-block mt-6">https://x.com/${EXAMPLE_HANDLE}/status/${EXAMPLE_ID}
        ↓
${EXAMPLE_HOSTED_URL}</pre>
          <p class="mt-4 text-[16px] leading-relaxed text-ink-3">
            Append query params the same way: <code class="code-chip">?format=obsidian</code>, <code class="code-chip">?thread=full</code>, <code class="code-chip">?userinfo=author</code>.
          </p>
          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            <div class="compare-tile">
              <h4>Hosted (x.pcstyle.dev)</h4>
              <ul class="mt-3 space-y-2 text-[14px] leading-relaxed text-ink-3">
                <li>FxTwitter primary, X syndication fallback</li>
                <li>Cached responses (about 1 hour by default)</li>
                <li>CORS open on <code class="code-chip">/api/*</code> for agents</li>
                <li><strong class="text-ink">No paid scrape fallback</strong> unless configured by the maintainer</li>
              </ul>
            </div>
            <div class="compare-tile">
              <h4>Self-host (your Vercel project)</h4>
              <ul class="mt-3 space-y-2 text-[14px] leading-relaxed text-ink-3">
                <li>Same FxTwitter + syndication chain</li>
                <li>Optional <code class="code-chip">CONTEXT_DEV_API_KEY</code> and <code class="code-chip">FIRECRAWL_API_KEY</code> scrape fallbacks</li>
                <li>Your cache TTL and env vars</li>
                <li>Same URL swap on your domain</li>
              </ul>
            </div>
          </div>
          <p class="mt-4 text-[14px] text-ink-4">
            <code class="code-chip">X-Source</code> is <code class="code-chip">fxtwitter</code> or <code class="code-chip">syndication</code> by default. Self-hosted deploys can also return <code class="code-chip">contextdev</code> or <code class="code-chip">firecrawl</code> when keys are set.
          </p>
          <div class="info-banner mt-8">
            <strong class="font-medium text-ink">Provider chain:</strong> FxTwitter for rich data, X syndication as fallback.
            <span class="text-ink-3"> Context.dev and Firecrawl are optional </span>
            <strong class="font-medium text-ink">self-host fallbacks</strong>
            <span class="text-ink-3"> — set </span>
            <code class="code-chip text-ink">CONTEXT_DEV_API_KEY</code>
            <span class="text-ink-3"> and/or </span>
            <code class="code-chip text-ink">FIRECRAWL_API_KEY</code>
            <span class="text-ink-3"> on your own deploy.</span>
          </div>
        </article>

        <article id="routes" class="docs-article grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <p class="eyebrow eyebrow-muted mb-3">HTTP</p>
            <h2 class="text-[24px] leading-tight font-semibold text-ink">Routes</h2>
            <p class="mt-3 text-[16px] leading-relaxed text-ink-3">
              Path-style is the usual way: <code class="code-chip">/:handle/status/:id</code> returns Markdown in the browser. Vercel rewrites map it to the converter.
            </p>
            <p class="mt-4 text-[16px] leading-relaxed text-ink-3">
              <code class="code-chip">/api/convert?url=…</code> still works when you need an encoded URL (agents, curl, tools that only accept query strings).
            </p>
            <p class="mt-4 text-[14px] text-ink-4">Responses are Markdown by default (plain text, not JSON).</p>
          </div>
          <pre class="code-block">GET ${EXAMPLE_PATH}
Accept: text/markdown

# ${EXAMPLE_HANDLE} (@${EXAMPLE_HANDLE})
…</pre>
        </article>

        <article id="params" class="docs-article">
          <p class="eyebrow eyebrow-muted mb-3">API</p>
          <h2 class="text-[24px] leading-tight font-semibold text-ink">Query params</h2>
          <p class="mt-3 text-[16px] leading-relaxed text-ink-3">
            Append to path URLs or <code class="code-chip">/api/convert?url=…</code>.
          </p>
          <div class="mt-6 overflow-x-auto rounded-xl border border-line">
            <table class="docs-table">
              <thead>
                <tr>
                  <th>Param</th>
                  <th>Default</th>
                  <th>Values</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>format</code></td>
                  <td>markdown</td>
                  <td class="font-mono text-[12px]">markdown, obsidian</td>
                </tr>
                <tr>
                  <td><code>thread</code></td>
                  <td>full</td>
                  <td class="font-mono text-[12px]">off, full, conversation, 2-100</td>
                </tr>
                <tr>
                  <td><code>userinfo</code></td>
                  <td>off</td>
                  <td class="font-mono text-[12px]">off, author, all</td>
                </tr>
                <tr>
                  <td><code>url</code></td>
                  <td>—</td>
                  <td class="text-ink-2">Encoded X status URL (<code class="code-chip">/api/convert</code> only; path routes omit this)</td>
                </tr>
                <tr>
                  <td><code>premium</code></td>
                  <td>—</td>
                  <td class="text-ink-2">Authenticated premium mode; requires Clerk JWT or <code class="code-chip">Authorization: Bearer xmd_...</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article id="formats" class="docs-article">
          <p class="eyebrow eyebrow-muted mb-3">Output</p>
          <h2 class="text-[24px] leading-tight font-semibold text-ink">Output formats</h2>
          <p class="mt-3 text-[16px] leading-relaxed text-ink-3">
            Use <code class="code-chip">?format=</code> on any convert URL. Omit for markdown.
          </p>
          <div class="mt-7 grid gap-4 sm:grid-cols-2">
            <div class="format-tile">
              <strong class="font-mono text-[15px] font-medium text-cyan">markdown</strong>
              <p class="mt-2 text-[14px] leading-relaxed text-ink-3">Notes with author, stats, media, quotes, and X Article bodies when available.</p>
            </div>
            <div class="format-tile">
              <strong class="font-mono text-[15px] font-medium text-cyan">obsidian</strong>
              <p class="mt-2 text-[14px] leading-relaxed text-ink-3">Vault import with YAML frontmatter and per-post headings.</p>
            </div>
          </div>
          <p class="mt-4 text-[14px] text-ink-4">Media uses public X preview URLs in the output file.</p>
        </article>

        <article id="articles" class="docs-article">
          <p class="eyebrow eyebrow-muted mb-3">Long form</p>
          <h2 class="text-[24px] leading-tight font-semibold text-ink">X Articles</h2>
          <p class="mt-3 max-w-[640px] text-[16px] leading-relaxed text-ink-3">
            Long-form posts use the normal status URL. Article text is pulled from X Article blocks when FxTwitter returns them (syndication fallback may omit article body).
          </p>
          <pre class="code-block mt-6">${EXAMPLE_HOSTED_URL}?format=markdown&amp;thread=full</pre>
        </article>

        <article id="agents" class="docs-article">
          <p class="eyebrow eyebrow-muted mb-3">Automation</p>
          <h2 class="text-[24px] leading-tight font-semibold text-ink">AI agents</h2>
          <p class="mt-3 max-w-[640px] text-[16px] leading-relaxed text-ink-3">
            Easiest path: swap the host and fetch Markdown. For Cursor and other agents, install the bundled skills with the <a href="https://skills.sh/" class="text-accent hover:text-[#8a89ff]" target="_blank" rel="noreferrer">skills</a> CLI:
          </p>
          <pre class="code-block mt-6"># list skills in this repo
bunx skills add pc-style/x-md --list

# global install (recommended — works across projects)
bunx skills add pc-style/x-md -g -y \\
  --skill read-x-links-vercel --skill read-x-links-local

# or project-only, from an x-md checkout
bunx skills add pc-style/x-md -y \\
  --skill read-x-links-vercel --skill read-x-links-local</pre>
          <div class="mt-8 grid gap-4 lg:grid-cols-2">
            <div class="compare-tile">
              <h4>read-x-links-vercel</h4>
              <p class="mt-2 text-[14px] leading-relaxed text-ink-3">Hosted API only — no local repo or Bun required. Uses FxTwitter + syndication on x.pcstyle.dev by default.</p>
              <pre class="code-block mt-4 text-[12px]"># after bunx skills add …
~/.agents/skills/read-x-links-vercel/scripts/read-x.sh \\
  "${EXAMPLE_X_URL}"

# or from this repo without installing:
./skills/read-x-links-vercel/scripts/read-x.sh \\
  "${EXAMPLE_X_URL}"</pre>
            </div>
            <div class="compare-tile">
              <h4>read-x-links-local</h4>
              <p class="mt-2 text-[14px] leading-relaxed text-ink-3">Full local CLI — threads, Obsidian output, optional Context.dev/Firecrawl when you set fallback API keys.</p>
              <pre class="code-block mt-4 text-[12px]">cd x-md && bun install
cp .env.local.example .env.local   # optional

bun run read-x -- "${EXAMPLE_X_URL}" --thread full

# or the installed skill script (needs X_MD_ROOT):
~/.agents/skills/read-x-links-local/scripts/read-x.sh \\
  "${EXAMPLE_X_URL}" --thread full</pre>
            </div>
          </div>
          <p class="mt-6 text-[16px] leading-relaxed text-ink-3">
            Raw HTTP without skills — path-style first, query-style when you need an encoded URL:
          </p>
          <pre class="code-block mt-4"># path-style (preferred)
curl -sS -H "Accept: text/markdown" \\
  "${EXAMPLE_HOSTED_URL}?thread=full"

# query-style (tools that only accept ?url=)
curl -sS -G "https://x.pcstyle.dev/api/convert" \\
  --data-urlencode "url=${EXAMPLE_X_URL}" \\
  -H "Accept: text/markdown"</pre>
          <p class="mt-4 text-[14px] text-ink-4">
            JSON: <code class="code-chip">Accept: application/json</code> includes <code class="code-chip">source</code> (<code class="code-chip">fxtwitter</code> | <code class="code-chip">syndication</code> by default; <code class="code-chip">contextdev</code> and <code class="code-chip">firecrawl</code> when configured).
          </p>
        </article>

        <article id="deploy" class="docs-article !pb-0">
          <p class="eyebrow eyebrow-muted mb-3">Infrastructure</p>
          <h2 class="text-[24px] leading-tight font-semibold text-ink">Self-host on Vercel</h2>
          <p class="mt-3 max-w-[640px] text-[16px] leading-relaxed text-ink-3">
            Fork the repo, deploy to Vercel, and optionally add env vars in <code class="code-chip">.env.local</code>. Your instance gets the same path-style URLs on your domain.
          </p>
          <div class="mt-7 space-y-0">
            <div class="provider-row">
              <strong class="text-[17px] font-medium text-ink">FxTwitter</strong>
              <span class="text-[14px] text-ink-3">Primary — threads, media, articles (hosted + self-host)</span>
            </div>
            <div class="provider-row">
              <strong class="text-[17px] font-medium text-ink">Syndication</strong>
              <span class="text-[14px] text-ink-3">X CDN fallback for single posts (hosted + self-host)</span>
            </div>
            <div class="provider-row">
              <strong class="text-[17px] font-medium text-ink">Context.dev</strong>
              <span class="text-[14px] text-ink-3">Optional scrape fallback when you set <code class="code-chip">CONTEXT_DEV_API_KEY</code></span>
            </div>
            <div class="provider-row">
              <strong class="text-[17px] font-medium text-ink">Firecrawl</strong>
              <span class="text-[14px] text-ink-3">Optional final scrape fallback when you set <code class="code-chip">FIRECRAWL_API_KEY</code></span>
            </div>
          </div>
          <div class="info-banner-muted mt-6">
            The default chain is FxTwitter → syndication. If you configure one or both optional keys, the chain extends to Context.dev → Firecrawl.
          </div>
        </article>
      </div>
    </div>
  </main>

  ${footerHtml()}
</div>
`

setupMobileMenu(app)
setupSectionHighlight(app)

function setupSectionHighlight(root: HTMLElement) {
  const links = new Map<string, HTMLAnchorElement[]>()
  root.querySelectorAll<HTMLAnchorElement>('[data-section-link]').forEach((link) => {
    const id = link.dataset.sectionLink!
    links.set(id, [...(links.get(id) ?? []), link])
  })
  if (links.size === 0 || !('IntersectionObserver' in window)) return

  let activeId: string | null = null
  const setActive = (id: string) => {
    if (id === activeId) return
    activeId = id
    links.forEach((anchors, sectionId) => {
      anchors.forEach((a) => {
        if (sectionId === id) a.setAttribute('aria-current', 'true')
        else a.removeAttribute('aria-current')
      })
    })
  }

  const visible = new Map<string, number>()
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
      })
      let best: { id: string; ratio: number } | null = null
      visible.forEach((ratio, id) => {
        if (ratio > 0 && (!best || ratio > best.ratio)) best = { id, ratio }
      })
      if (best) setActive((best as { id: string }).id)
    },
    { rootMargin: '-80px 0px -40% 0px', threshold: [0, 0.2, 0.5, 1] },
  )

  SECTIONS.forEach((section) => {
    const el = root.querySelector(`#${section.id}`)
    if (el) observer.observe(el)
  })
}
