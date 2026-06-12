import './style.css'
import { beginClerkAuth, CLERK_PUBLISHABLE_KEY, loadClerk as loadClerkInstance, type ClerkInstance } from './clerk'
import { footerHtml, headerHtml, setupMobileMenu } from './chrome'

const app = document.querySelector<HTMLDivElement>('#app')!

const EXAMPLE_HANDLE = 'trq212'
const EXAMPLE_ID = '2052809885763747935'
const EXAMPLE_X_URL = `https://x.com/${EXAMPLE_HANDLE}/status/${EXAMPLE_ID}`
const EXAMPLE_HOSTED_URL = `https://x.pcstyle.dev/${EXAMPLE_HANDLE}/status/${EXAMPLE_ID}`
const EXAMPLE_PATH = `/${EXAMPLE_HANDLE}/status/${EXAMPLE_ID}`

const HOSTED_HOSTS = new Set([
  'x.pcstyle.dev',
  typeof window !== 'undefined' ? window.location.hostname.replace(/^www\./, '') : '',
])

function statusPathFromUrl(raw: string): string | null {
  try {
    const parsed = new URL(raw.trim())
    const host = parsed.hostname.replace(/^www\./, '')
    if (
      !['x.com', 'twitter.com'].includes(host) &&
      !HOSTED_HOSTS.has(host) &&
      !host.endsWith('.vercel.app')
    ) {
      return null
    }
    const match = parsed.pathname.match(/^\/([^/?#]+)\/status\/(\d+)\/?$/)
    if (!match) return null
    return `/${match[1]}/status/${match[2]}`
  } catch {
    return null
  }
}

function setupConvertForm(root: HTMLElement) {
  const form = root.querySelector<HTMLFormElement>('[data-convert-form]')
  const input = root.querySelector<HTMLInputElement>('[data-convert-input]')
  if (!form || !input) return

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const raw = input.value.trim()
    if (!raw) return
    const path = statusPathFromUrl(raw)
    const target = path
      ? `${path}?thread=full`
      : `/api/convert?url=${encodeURIComponent(raw)}&thread=full`
    window.open(target, '_blank', 'noopener,noreferrer')
  })
}

app.innerHTML = `
<div class="x-root w-full overflow-x-clip">
  <a href="#convert" class="skip-link">Skip to converter</a>
  ${headerHtml({ page: 'landing', withAuth: true })}

  <main id="top">
    <section class="relative">
      <div class="hero-glow"></div>
      <div class="mx-auto max-w-[1200px] px-6 pt-20 pb-24 sm:px-8 sm:pt-[88px] sm:pb-[112px]">
        <div class="grid items-center gap-14 lg:grid-cols-2">
          <div class="max-w-[520px]">
            <p class="eyebrow eyebrow-accent mb-5">Open-source converter</p>
            <h1 class="hero-h text-[clamp(38px,5vw,64px)] leading-[1.04] font-medium text-ink">
              X posts as Markdown you can ship anywhere.
            </h1>
            <p class="mt-6 max-w-[440px] text-[17px] leading-[1.6] text-ink-3">
              Use the live site at <code class="code-chip">x.pcstyle.dev</code> or deploy your own on Vercel. Threads, media, quotes, and X Articles — no paid X API keys on the default path.
            </p>
            <div class="mt-9 flex flex-wrap gap-3">
              <button type="button" data-auth-action="sign-up" class="btn-primary flex h-10 items-center rounded-full px-4 text-[13px]">Create free account</button>
              <a href="#convert" class="btn-ghost flex h-10 items-center rounded-full px-3.5 text-[13px]">Convert without account</a>
              <a href="/docs" class="btn-ghost flex h-10 items-center rounded-full px-3.5 text-[13px]">Read the docs</a>
            </div>
          </div>

          <div class="hero-terminal">
            <div class="flex items-center gap-2 border-b border-hair px-4 py-3">
              <span class="h-3 w-3 rounded-full bg-[#232326]"></span>
              <span class="h-3 w-3 rounded-full bg-[#232326]"></span>
              <span class="h-3 w-3 rounded-full bg-[#232326]"></span>
              <span class="ml-2 font-mono text-[11px] text-ink-4">swap the host</span>
            </div>
            <pre class="m-0 overflow-x-auto px-5 py-5 font-mono text-[12.5px] leading-[1.7] text-ink-2"><span class="text-ink-4"># x.com post</span>
<span class="text-ink-3">https://x.com/${EXAMPLE_HANDLE}/status/…</span>

<span class="text-ink-4"># same path on x.md → Markdown in the browser</span>
<span class="text-accent">${EXAMPLE_HOSTED_URL}</span>

<span class="text-ink-4"># trq212 (@trq212)</span>

<span class="text-ink-3">Source:</span> https://x.com/${EXAMPLE_HANDLE}/status/…
<span class="text-ink-3">Stats:</span> 2.1K likes · 412 reposts</pre>
          </div>
        </div>

        <div class="mt-20 grid gap-4 sm:grid-cols-3">
          <div class="step-tile">
            <span class="step-num">1</span>
            <h3 class="text-[15px] font-semibold text-ink">Swap the host</h3>
            <p class="mt-1.5 text-[14px] leading-relaxed text-ink-3">Replace <code class="code-chip">x.com</code> with <code class="code-chip">x.pcstyle.dev</code> in any public status link.</p>
          </div>
          <div class="step-tile">
            <span class="step-num">2</span>
            <h3 class="text-[15px] font-semibold text-ink">Get Markdown</h3>
            <p class="mt-1.5 text-[14px] leading-relaxed text-ink-3">The same path returns the post as Markdown — threads, media, quotes, and X Articles included.</p>
          </div>
          <div class="step-tile">
            <span class="step-num">3</span>
            <h3 class="text-[15px] font-semibold text-ink">Tune with params</h3>
            <p class="mt-1.5 text-[14px] leading-relaxed text-ink-3">Append <code class="code-chip">?format=obsidian</code>, <code class="code-chip">?thread=full</code>, and more. <a href="/docs#params" class="text-accent hover:text-[#8a89ff]">All params →</a></p>
          </div>
        </div>
      </div>
    </section>

    <section id="convert" class="mx-auto max-w-[1200px] scroll-mt-20 px-6 pb-[112px] sm:px-8">
      <div class="convert-card mx-auto max-w-[620px]">
        <p class="eyebrow eyebrow-accent mb-3">Try it</p>
        <h2 class="text-[28px] leading-tight font-medium text-ink">Convert a post</h2>
        <p class="mt-2 text-[16px] text-ink-3">Paste any public X status URL. Opens Markdown at the same path on this site (includes reply-chain context by default).</p>
        <form data-convert-form class="mt-7 flex flex-col gap-3 sm:flex-row">
          <label for="x-url" class="sr-only">X status URL</label>
          <input
            id="x-url"
            data-convert-input
            type="url"
            name="url"
            required
            inputmode="url"
            autocomplete="off"
            spellcheck="false"
            placeholder="https://x.com/handle/status/…"
            value="${EXAMPLE_X_URL}"
            class="convert-input"
          />
          <button type="submit" class="btn-primary flex h-[42px] shrink-0 items-center justify-center rounded-full px-4 text-[13px]">Get Markdown</button>
        </form>
        <p class="mt-4 text-[14px] text-ink-3">
          Opens <code class="code-chip">${EXAMPLE_PATH}?thread=full</code> here — the same trick as swapping <code class="code-chip">x.com</code> → <code class="code-chip">x.pcstyle.dev</code> in the link.
        </p>
      </div>
    </section>

    <section id="pricing" class="mx-auto max-w-[1200px] scroll-mt-20 px-6 pb-[112px] sm:px-8">
      <div class="mb-10 max-w-[640px]">
        <p class="eyebrow eyebrow-accent mb-3">Premium</p>
        <h2 class="text-[clamp(32px,4vw,48px)] leading-[1.05] font-medium tracking-[-0.03em] text-ink">Free conversion stays free. Premium social workflows use credits.</h2>
        <p class="mt-4 text-[17px] leading-[1.6] text-ink-3">x.md uses Clerk accounts, Convex-backed API keys, and Autumn + Stripe billing. Autumn is the source of truth for plans, entitlements, checkout, and social credit balances.</p>
      </div>
      <div class="grid gap-4 lg:grid-cols-3">
        <div class="pricing-card">
          <span class="plan-badge self-start">Free</span>
          <h3 class="mt-4 text-[28px] font-semibold text-ink">$0<span class="text-[14px] font-normal text-ink-3">/mo</span></h3>
          <p class="mt-2 text-[14px] text-ink-2">Anonymous conversion, no account needed</p>
          <ul class="mt-5 space-y-2.5 text-[14px] leading-relaxed text-ink-3">
            <li class="feature-li">Anonymous X Markdown conversion</li>
            <li class="feature-li">Social link bundle</li>
            <li class="feature-li">Conversation map</li>
            <li class="feature-li">Media manifest</li>
          </ul>
        </div>
        <div class="pricing-card pricing-card-featured">
          <span class="plan-badge self-start">Starter</span>
          <h3 class="mt-4 text-[28px] font-semibold text-ink">$5<span class="text-[14px] font-normal text-ink-3">/mo</span></h3>
          <p class="mt-2 text-[14px] text-ink-2">250 social credits/month</p>
          <ul class="mt-5 space-y-2.5 text-[14px] leading-relaxed text-ink-3">
            <li class="feature-li">Obsidian social note templates</li>
            <li class="feature-li">Quote expansion</li>
            <li class="feature-li">JSON-LD basic export</li>
          </ul>
          <button type="button" data-plan="starter" class="btn-primary mt-6 flex h-10 w-full items-center justify-center rounded-full px-4 text-[13px]">Upgrade with Autumn</button>
        </div>
        <div class="pricing-card">
          <span class="plan-badge self-start">Pro</span>
          <h3 class="mt-4 text-[28px] font-semibold text-ink">$15<span class="text-[14px] font-normal text-ink-3">/mo</span></h3>
          <p class="mt-2 text-[14px] text-ink-2">1,500 social credits/month</p>
          <ul class="mt-5 space-y-2.5 text-[14px] leading-relaxed text-ink-3">
            <li class="feature-li">Thread briefing and author dossiers</li>
            <li class="feature-li">Cross-platform parser</li>
            <li class="feature-li">Context-window safe mode</li>
            <li class="feature-li">Bulk JSON-LD archive export</li>
          </ul>
          <button type="button" data-plan="pro" class="btn-ghost mt-6 flex h-10 w-full items-center justify-center rounded-full px-4 text-[13px]">Upgrade to Pro</button>
        </div>
      </div>
      <div class="mt-6 overflow-x-auto rounded-xl border border-line">
        <table class="docs-table">
          <thead><tr><th>Premium feature</th><th>Credits</th><th>API mode</th></tr></thead>
          <tbody>
            <tr><td>Quote-post expansion</td><td>1</td><td><code>premium=quote_expansion</code></td></tr>
            <tr><td>Obsidian social note templates</td><td>1</td><td><code>premium=obsidian_templates</code></td></tr>
            <tr><td>Thread briefing mode</td><td>3</td><td><code>premium=thread_briefing</code></td></tr>
            <tr><td>Context-window safe mode</td><td>3</td><td><code>premium=context_safe_mode</code></td></tr>
            <tr><td>Cross-platform social parser</td><td>3</td><td><code>premium=cross_platform_parser</code></td></tr>
            <tr><td>Social archive JSON-LD bulk/export</td><td>5</td><td><code>premium=jsonld_bulk_export</code></td></tr>
            <tr><td>Author dossier</td><td>10</td><td><code>premium=author_dossier</code></td></tr>
          </tbody>
        </table>
      </div>
      <div id="account" class="account-card mt-6 scroll-mt-20">
        <div>
          <p class="eyebrow eyebrow-muted mb-2">Account</p>
          <h3 class="text-[22px] font-semibold text-ink">Sign up to unlock premium workflows and API keys.</h3>
          <p data-account-status class="mt-2 text-[14px] leading-relaxed text-ink-3">Create a free account first, then upgrade when you need social credits.</p>
          <p data-api-key-output class="mt-4 hidden rounded-lg border border-line bg-surface p-3 font-mono text-[12px] leading-relaxed text-ink-2"></p>
        </div>
        <div class="flex flex-col gap-3 sm:min-w-[220px]">
          <button type="button" data-auth-action="sign-up" class="btn-primary flex h-10 items-center justify-center rounded-full px-4 text-[13px]">Sign up free</button>
          <button type="button" data-auth-action="sign-in" class="btn-ghost flex h-10 items-center justify-center rounded-full px-4 text-[13px]">Sign in</button>
          <a href="/dashboard" data-dashboard-link class="btn-primary hidden h-10 items-center justify-center rounded-full px-4 text-[13px]">Open dashboard</a>
          <button type="button" data-account-action="create-key" class="btn-ghost hidden h-10 items-center justify-center rounded-full px-4 text-[13px]">Create API key</button>
          <button type="button" data-account-action="portal" class="btn-ghost hidden h-10 items-center justify-center rounded-full px-4 text-[13px]">Manage billing</button>
          <button type="button" data-auth-action="sign-out" class="btn-ghost hidden h-10 items-center justify-center rounded-full px-4 text-[13px]">Sign out</button>
        </div>
      </div>
      <div class="info-banner-muted mt-4">
        Account API surface: <code class="code-chip">POST /api/billing?plan=starter|pro</code> starts Autumn checkout, <code class="code-chip">POST /api/billing?action=portal</code> opens the Stripe portal through Autumn, and <code class="code-chip">/api/api-keys</code> creates/revokes hashed <code class="code-chip">xmd_...</code> tokens for <code class="code-chip">Authorization: Bearer</code> requests.
      </div>
    </section>

    <section class="border-t border-line">
      <div class="mx-auto grid max-w-[1200px] items-center gap-8 px-6 py-16 sm:px-8 lg:grid-cols-[1fr_auto]">
        <div class="max-w-[560px]">
          <p class="eyebrow eyebrow-muted mb-3">Documentation</p>
          <h2 class="text-[28px] leading-tight font-medium text-ink">Routes, params, formats, agents, self-hosting.</h2>
          <p class="mt-3 text-[16px] leading-relaxed text-ink-3">Everything about the API lives in the docs — including the bundled agent skills and the FxTwitter → syndication provider chain.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <a href="/docs" class="btn-primary flex h-10 items-center rounded-full px-4 text-[13px]">Open docs</a>
          <a href="/docs#agents" class="btn-ghost flex h-10 items-center rounded-full px-4 text-[13px]">AI agents</a>
        </div>
      </div>
    </section>
  </main>

  ${footerHtml()}
</div>
`

setupConvertForm(app)
setupMobileMenu(app)
void setupAccountFlow(app)

async function setupAccountFlow(root: HTMLElement) {
  const clerk = await loadClerk(root)
  updateAccountUi(root, clerk)

  if (!clerk) return

  clerk.addListener(() => updateAccountUi(root, clerk))

  root.querySelectorAll<HTMLButtonElement>('[data-auth-action]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        const action = button.dataset.authAction
        if (action === 'sign-up') await beginClerkAuth(clerk, 'sign-up')
        if (action === 'sign-in') await beginClerkAuth(clerk, 'sign-in')
        if (action === 'sign-out') await clerk.signOut()
      } catch (error) {
        setAccountStatus(root, error instanceof Error ? error.message : 'Unable to start account flow.')
      }
    })
  })

  root.querySelectorAll<HTMLButtonElement>('[data-plan]').forEach((button) => {
    button.addEventListener('click', async () => {
      const plan = button.dataset.plan
      if (!plan) return
      if (!clerk.user) {
        await beginClerkAuth(clerk, 'sign-up')
        return
      }
      await postWithClerkToken(clerk, button, `/api/billing?plan=${encodeURIComponent(plan)}`, 'Opening checkout…', (payload) => {
        if (!payload.url) throw new Error('Checkout unavailable')
        window.location.href = payload.url
      })
    })
  })

  root.querySelector<HTMLButtonElement>('[data-account-action="portal"]')?.addEventListener('click', async (event) => {
    await postWithClerkToken(clerk, event.currentTarget as HTMLButtonElement, '/api/billing?action=portal', 'Opening portal…', (payload) => {
      if (!payload.url) throw new Error('Portal unavailable')
      window.location.href = payload.url
    })
  })

  root.querySelector<HTMLButtonElement>('[data-account-action="create-key"]')?.addEventListener('click', async (event) => {
    await postWithClerkToken(clerk, event.currentTarget as HTMLButtonElement, '/api/api-keys', 'Creating key…', (payload) => {
      const output = root.querySelector<HTMLElement>('[data-api-key-output]')
      if (!payload.apiKey || !output) throw new Error('API key unavailable')
      output.classList.remove('hidden')
      output.textContent = `Copy this key now. It will not be shown again:
${payload.apiKey}`
    })
  })
}

async function loadClerk(root: HTMLElement): Promise<ClerkInstance | null> {
  if (!CLERK_PUBLISHABLE_KEY) {
    root.querySelectorAll<HTMLButtonElement>('[data-auth-action], [data-plan], [data-account-action]').forEach((button) => {
      button.disabled = true
    })
    setAccountStatus(root, 'Clerk is not configured on this deploy yet. Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to enable sign-up.')
    return null
  }

  return loadClerkInstance()
}

function updateAccountUi(root: HTMLElement, clerk: ClerkInstance | null) {
  const signedIn = !!clerk?.user
  const email = clerk?.user?.primaryEmailAddress?.emailAddress ?? clerk?.user?.username ?? 'your account'
  const userButton = root.querySelector<HTMLDivElement>('[data-user-button]')
  root.querySelectorAll<HTMLElement>('[data-auth-action="sign-up"], [data-auth-action="sign-in"]').forEach((el) => {
    el.classList.toggle('hidden', signedIn)
  })
  root.querySelectorAll<HTMLElement>('[data-auth-action="sign-out"], [data-account-action], [data-dashboard-link]').forEach((el) => {
    el.classList.toggle('hidden', !signedIn)
    el.classList.toggle('flex', signedIn)
  })
  if (userButton && clerk) {
    if (signedIn) {
      userButton.classList.remove('hidden')
      if (!userButton.dataset.mounted) {
        clerk.mountUserButton(userButton, { showName: false })
        userButton.dataset.mounted = '1'
      }
    } else {
      if (userButton.dataset.mounted) {
        clerk.unmountUserButton(userButton)
        delete userButton.dataset.mounted
      }
      userButton.classList.add('hidden')
    }
  }
  setAccountStatus(root,
    signedIn
      ? `Signed in as ${email}. You can upgrade, manage billing, or create an API key for agent access.`
      : 'Create a free account first, then upgrade when you need social credits.',
  )
}

function setAccountStatus(root: HTMLElement, message: string) {
  const status = root.querySelector<HTMLElement>('[data-account-status]')
  if (status) status.textContent = message
}

async function postWithClerkToken(
  clerk: ClerkInstance,
  button: HTMLButtonElement,
  path: string,
  pendingLabel: string,
  onSuccess: (payload: Record<string, string>) => void,
) {
  button.disabled = true
  const original = button.textContent
  button.textContent = pendingLabel
  try {
    const token = await clerk.session?.getToken()
    const response = await fetch(path, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    const payload = await response.json() as Record<string, string>
    if (!response.ok) throw new Error(payload.error ?? 'Request failed')
    onSuccess(payload)
    button.textContent = original
    button.disabled = false
  } catch (error) {
    button.textContent = error instanceof Error ? error.message : 'Request failed'
    setTimeout(() => { button.textContent = original }, 2200)
    button.disabled = false
  }
}
