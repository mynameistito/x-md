type NavItem = { label: string; href: string; current?: boolean }

const NAV_ITEMS: NavItem[] = [
  { label: 'Convert', href: '/#convert' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Docs', href: '/docs' },
  { label: 'API', href: '/docs#routes' },
]

export function headerHtml(options: { page: 'landing' | 'docs'; withAuth?: boolean }) {
  const items = NAV_ITEMS.map((item) => {
    const current = options.page === 'docs' && item.href === '/docs'
    return `<a href="${item.href}" class="nav-link h-8 px-3"${current ? ' aria-current="page"' : ''}>${item.label}</a>`
  }).join('\n        ')

  const mobileItems = [...NAV_ITEMS, { label: 'GitHub', href: 'https://github.com/pc-style/x-md' }]
    .map((item) => `<a href="${item.href}">${item.label}</a>`)
    .join('\n      ')

  const authControls = options.withAuth
    ? `
        <a href="/dashboard" data-dashboard-link class="nav-link hidden h-8 px-3">Dashboard</a>
        <div data-user-button class="hidden h-8 w-8"></div>
        <button type="button" data-auth-action="sign-in" class="nav-link hidden h-8 px-3 sm:flex">Sign in</button>
        <button type="button" data-auth-action="sign-up" class="btn-primary flex h-8 items-center rounded-full px-3.5 text-[13px]">Sign up free</button>`
    : `
        <a href="/dashboard" class="nav-link hidden h-8 px-3 sm:flex">Dashboard</a>
        <a href="/#account" class="btn-primary flex h-8 items-center rounded-full px-3.5 text-[13px]">Sign up free</a>`

  return `
  <header class="site-header">
    <nav aria-label="Primary" class="mx-auto flex h-[64px] max-w-[1200px] items-center justify-between px-6 sm:px-8">
      <a href="/" class="flex items-center gap-2.5 font-mono text-[16px] font-medium tracking-tight text-ink">
        <img src="/logo.svg" alt="" width="22" height="22" class="rounded-[6px]" />
        x.md
      </a>
      <div class="hidden items-center gap-1 md:flex">
        ${items}
      </div>
      <div class="flex items-center gap-3">
        <a href="https://github.com/pc-style/x-md" target="_blank" rel="noreferrer" class="nav-link hidden h-8 px-3 sm:flex">GitHub</a>${authControls}
        <button type="button" class="menu-toggle" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 4.5h12M2 8h12M2 11.5h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </nav>
    <div id="mobile-menu" class="mobile-menu">
      ${mobileItems}
    </div>
  </header>`
}

export function footerHtml() {
  return `
  <footer class="border-t border-line bg-surface">
    <div class="mx-auto flex max-w-[1200px] flex-col gap-4 px-6 py-10 text-[14px] text-ink-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
        <a href="/" class="footer-link font-mono text-ink">x.md</a>
        <a href="/#convert" class="footer-link">Convert</a>
        <a href="/#pricing" class="footer-link">Pricing</a>
        <a href="/docs" class="footer-link">Docs</a>
        <a href="/docs#routes" class="footer-link">API</a>
        <a href="https://github.com/pc-style/x-md" target="_blank" rel="noreferrer" class="footer-link">GitHub</a>
      </div>
      <p class="text-ink-4">Open source, MIT. Not affiliated with X Corp.</p>
    </div>
  </footer>`
}

export function setupMobileMenu(root: HTMLElement) {
  const toggle = root.querySelector<HTMLButtonElement>('[data-menu-toggle]')
  const menu = root.querySelector<HTMLElement>('#mobile-menu')
  if (!toggle || !menu) return

  const close = () => {
    delete menu.dataset.open
    toggle.setAttribute('aria-expanded', 'false')
    toggle.setAttribute('aria-label', 'Open menu')
  }

  toggle.addEventListener('click', () => {
    const open = menu.dataset.open !== undefined
    if (open) {
      close()
    } else {
      menu.dataset.open = ''
      toggle.setAttribute('aria-expanded', 'true')
      toggle.setAttribute('aria-label', 'Close menu')
    }
  })

  menu.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) close()
  })
}
