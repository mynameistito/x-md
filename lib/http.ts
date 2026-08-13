/** Minimal shape shared by Vercel's response object and Node's ServerResponse. */
export interface HeaderWriter {
  setHeader(name: string, value: string): void
}

export interface OriginRequest {
  headers: {
    host?: string | string[]
    'x-forwarded-proto'?: string | string[]
    'x-forwarded-host'?: string | string[]
  }
}

function headerValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export function requestOrigin(req: OriginRequest, fallback = 'https://x.pcstyle.dev'): string {
  const proto = headerValue(req.headers['x-forwarded-proto']) ?? 'https'
  const host = headerValue(req.headers['x-forwarded-host']) ?? headerValue(req.headers.host)
  return host ? `${proto}://${host}` : fallback
}

export function setCorsHeaders(res: HeaderWriter, methods = 'GET, HEAD, OPTIONS'): void {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', methods)
  res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type')
}

export function wantsJson(format: string | null | undefined, accept: string): boolean {
  if (format) return format === 'json'
  return accept.includes('application/json')
}
