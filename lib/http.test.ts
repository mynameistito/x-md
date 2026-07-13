import { describe, expect, test } from 'vitest'
import { wantsJson } from './http.js'

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
