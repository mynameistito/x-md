import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ConvertError, acceptPrefersHtml, convertTweet, markdownResponse } from '../lib/converter.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type')
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD, OPTIONS')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const accept = String(req.headers.accept ?? '')
  const requestedFormat = typeof req.query.format === 'string' ? req.query.format : undefined
  const asJson = requestedFormat === 'json' || accept.includes('application/json')
  const asHtml = !asJson && acceptPrefersHtml(accept)

  try {
    const result = await convertTweet({
      url: typeof req.query.url === 'string' ? req.query.url : undefined,
      handle: typeof req.query.handle === 'string' ? req.query.handle : undefined,
      id: typeof req.query.id === 'string' ? req.query.id : undefined,
      format: requestedFormat,
      thread: typeof req.query.thread === 'string' ? req.query.thread : undefined,
      userinfo: typeof req.query.userinfo === 'string' ? req.query.userinfo : undefined,
      nocache: typeof req.query.nocache === 'string' ? req.query.nocache : undefined,
      full: typeof req.query.full === 'string' ? req.query.full : undefined,
      context: typeof req.query.context === 'string' ? req.query.context : undefined,
      replies: typeof req.query.replies === 'string' ? req.query.replies : undefined,
    })

    const { status, headers, body } = markdownResponse(result, asJson, asHtml)
    for (const [key, value] of Object.entries(headers)) {
      res.setHeader(key, value)
    }

    if (req.method === 'HEAD') {
      return res.status(status).end()
    }

    return res.status(status).send(body)
  } catch (error) {
    if (error instanceof ConvertError) {
      return res.status(error.status).json({
        error: error.message,
        code: error.code,
      })
    }

    console.error(error)
    return res.status(500).json({ error: 'Internal converter error' })
  }
}
