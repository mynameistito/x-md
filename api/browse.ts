import type { VercelRequest, VercelResponse } from '@vercel/node'
import { browse, browseResponse } from '../lib/browse.js'
import { ConvertError } from '../lib/errors.js'
import { setCorsHeaders, wantsJson } from '../lib/http.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD, OPTIONS')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const value = (key: string): string | undefined => typeof req.query[key] === 'string' ? req.query[key] : undefined
  try {
    const result = await browse({ resource: value('resource'), handle: value('handle'), q: value('q'), feed: value('feed'), cursor: value('cursor'), page: value('page'), limit: value('limit'), full: value('full'), format: value('format'), nocache: value('nocache') })
    const response = browseResponse(result, wantsJson(value('format'), String(req.headers.accept ?? '')))
    for (const [key, header] of Object.entries(response.headers)) res.setHeader(key, header)
    return req.method === 'HEAD' ? res.status(response.status).end() : res.status(response.status).send(response.body)
  } catch (error) {
    if (error instanceof ConvertError) return res.status(error.status).json({ error: error.message, code: error.code })
    console.error(error)
    return res.status(500).json({ error: 'Internal browse error' })
  }
}
