type NavItem = { label: string; href: string }

const NAV_ITEMS: NavItem[] = [
  { label: 'Convert', href: '/#convert' },
  { label: 'Agents', href: '/#agents' },
  { label: 'Docs', href: '/docs' },
  { label: 'API', href: '/docs#routes' },
]

export function headerHtml(options: { page: 'landing' | 'docs' }) {
  const items = NAV_ITEMS.map((item) => {
    const current = options.page === 'docs' && item.href === '/docs'
    return `<a href="${item.href}" class="nav-link h-9 px-3"${current ? ' aria-current="page"' : ''}>${item.label}</a>`
  }).join('\n        ')

  const mobileItems = [...NAV_ITEMS, { label: 'GitHub', href: 'https://github.com/pc-style/x-md' }]
    .map((item) => `<a href="${item.href}">${item.label}</a>`)
    .join('\n      ')

  const cta =
    options.page === 'docs'
      ? `<a href="/#convert" class="btn-primary h-9 px-4 text-[13.5px]">Convert</a>`
      : `<a href="#convert" class="btn-primary h-9 px-4 text-[13.5px]">Convert</a>`

  return `
  <header class="site-header">
    <nav aria-label="Primary" class="site-header-inner">
      <a href="/" class="text-[17px] font-black tracking-tight text-ink">x.md</a>
      <div class="hidden items-center gap-1 md:flex">
        ${items}
      </div>
      <div class="flex items-center gap-2">
        <a href="https://github.com/pc-style/x-md" target="_blank" rel="noreferrer" class="nav-link hidden h-9 px-3 sm:flex">GitHub</a>
        ${cta}
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
  <footer class="site-footer">
    <div class="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-14 sm:px-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <a href="/" class="text-[17px] font-black tracking-tight text-ink">x.md</a>
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px]">
          <a href="/#convert" class="footer-link">Convert</a>
          <a href="/#agents" class="footer-link">Agents</a>
          <a href="/docs" class="footer-link">Docs</a>
          <a href="/docs#routes" class="footer-link">API</a>
          <a href="https://github.com/pc-style/x-md" target="_blank" rel="noreferrer" class="footer-link">GitHub</a>
        </div>
      </div>
      <p class="border-t border-line pt-6 text-[13.5px] text-ink-4">Open source, MIT. Not affiliated with X Corp.</p>
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
