import { isAirtableConfigured, writeVisitorEvent } from './_lib/airtable.js'
import { getRequestMeta, parseBody } from './_lib/request.js'

const getSessionId = (value) => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed ? trimmed.slice(0, 120) : null
}

const getEventName = (value) => {
  if (typeof value !== 'string') {
    return 'unknown'
  }

  const trimmed = value.trim()
  return trimmed || 'unknown'
}

const isTrackingStrictMode = () => {
  const value = (process.env.TRACKING_STRICT || '').trim().toLowerCase()
  return value === '1' || value === 'true' || value === 'yes'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = parseBody(req.body)
  const requestMeta = getRequestMeta(req)
  const sessionId = getSessionId(body.sessionId)
  const eventName = getEventName(body.eventName)

  try {
    const stored = await writeVisitorEvent({
      sessionId,
      eventName,
      payload: body.payload ?? {},
      timestamp: body.timestamp ?? new Date().toISOString(),
      path: typeof body.path === 'string' ? body.path : req.url || '/',
      hash: typeof body.hash === 'string' ? body.hash : null,
      requestMeta,
    })

    if (stored) {
      return res.status(202).json({ ok: true, stored: true })
    }

    const code = !sessionId
      ? 'SESSION_ID_MISSING'
      : isAirtableConfigured()
        ? 'TRACKING_SKIPPED'
        : 'AIRTABLE_NOT_CONFIGURED'

    if (isTrackingStrictMode()) {
      return res.status(503).json({
        ok: false,
        stored: false,
        code,
      })
    }

    return res.status(202).json({
      ok: false,
      stored: false,
      code,
    })
  } catch (error) {
    console.error('Failed to write tracking event', {
      code: 'AIRTABLE_WRITE_FAILED',
      eventName,
      sessionId,
      error: error instanceof Error ? error.message : String(error),
    })

    if (isTrackingStrictMode()) {
      return res.status(503).json({
        ok: false,
        stored: false,
        code: 'AIRTABLE_WRITE_FAILED',
      })
    }

    return res.status(202).json({
      ok: false,
      stored: false,
      code: 'AIRTABLE_WRITE_FAILED',
    })
  }
}
