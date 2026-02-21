const parseBody = (body) => {
  if (!body) {
    return {}
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      return {}
    }
  }

  return body
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = parseBody(req.body)

  // Phase 2 placeholder for analytics persistence.
  // Keeping the endpoint active now allows frontend tracking hooks to ship immediately.
  console.log('presentation-event', {
    eventName: body.eventName ?? null,
    payload: body.payload ?? {},
    timestamp: body.timestamp ?? new Date().toISOString(),
    userAgent: req.headers['user-agent'] ?? null,
    forwardedFor: req.headers['x-forwarded-for'] ?? null,
  })

  return res.status(202).json({ ok: true })
}
