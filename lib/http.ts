/** Minimal shape shared by Vercel's response object and Node's ServerResponse. */
export interface HeaderWriter {
  setHeader(name: string, value: string): void
}

export function setCorsHeaders(res: HeaderWriter, methods = 'GET, HEAD, OPTIONS'): void {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', methods)
  res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type')
}

export function wantsJson(format: string | null | undefined, accept: string): boolean {
  return format === 'json' || accept.includes('application/json')
}