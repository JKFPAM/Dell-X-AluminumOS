import { writeVisitorEvent } from './_lib/airtable.js'
import { getRequestMeta, parseBody } from './_lib/request.js'

const getSessionId = (value) => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed ? trimmed.slice(0, 120) : null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = parseBody(req.body)
  const requestMeta = getRequestMeta(req)

  try {
    await writeVisitorEvent({
      sessionId: getSessionId(body.sessionId),
      eventName: body.eventName ?? 'unknown',
      payload: body.payload ?? {},
      timestamp: body.timestamp ?? new Date().toISOString(),
      path: typeof body.path === 'string' ? body.path : req.url || '/',
      hash: typeof body.hash === 'string' ? body.hash : null,
      requestMeta,
    })
  } catch (error) {
    console.error('Failed to write tracking event', error)
  }

  return res.status(202).json({ ok: true })
}
