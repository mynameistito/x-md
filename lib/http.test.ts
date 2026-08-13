import { describe, expect, test } from 'vitest'
import { requestOrigin, wantsJson, wantsMarkdown } from './http.js'

describe('requestOrigin', () => {
  test('prefers forwarded host and proto', () => {
    expect(
      requestOrigin({
        headers: { 'x-forwarded-proto': 'https', 'x-forwarded-host': 'x.pcstyle.dev', host: 'localhost:3000' },
      }),
    ).toBe('https://x.pcstyle.dev')
  })

  test('falls back to the hosted origin', () => {
    expect(requestOrigin({ headers: {} })).toBe('https://x.pcstyle.dev')
  })
})

describe('wantsMarkdown', () => {
  test('gives an explicit format precedence over Accept', () => {
    expect(wantsMarkdown('json', 'text/markdown')).toBe(false)
    expect(wantsMarkdown('markdown', 'application/json')).toBe(true)
  })

  test('uses Accept when no format is explicit', () => {
    expect(wantsMarkdown(undefined, 'text/markdown')).toBe(true)
    expect(wantsMarkdown(undefined, 'text/html')).toBe(false)
  })
})

describe('wantsJson', () => {
  test('gives an explicit format precedence over Accept', () => {
    expect(wantsJson('markdown', 'application/json')).toBe(false)
    expect(wantsJson('json', 'text/markdown')).toBe(true)
  })

  test('uses Accept when no format is explicit', () => {
    expect(wantsJson(undefined, 'application/json')).toBe(true)
    expect(wantsJson(undefined, 'text/markdown')).toBe(false)
  })
})
