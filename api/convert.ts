import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ConvertError, acceptPrefersHtml, convertTweet, markdownResponse } from '../lib/converter.js'
import { setCorsHeaders, wantsJson } from '../lib/http.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD, OPTIONS')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const param = (key: string): string | undefined => (typeof req.query[key] === 'string' ? req.query[key] : undefined)
  const accept = String(req.headers.accept ?? '')
  const requestedFormat = param('format')
  const asJson = wantsJson(requestedFormat, accept)
  const asHtml = !requestedFormat && !asJson && acceptPrefersHtml(accept)

  try {
    const result = await convertTweet({
      url: param('url'),
      handle: param('handle'),
      id: param('id'),
      format: requestedFormat,
      thread: param('thread'),
      userinfo: param('userinfo'),
      nocache: param('nocache'),
      full: param('full'),
      context: param('context'),
      replies: param('replies'),
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
