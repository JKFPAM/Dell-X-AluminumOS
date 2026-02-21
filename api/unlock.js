import { writeVisitorEvent } from './_lib/airtable.js'
import { getRequestMeta, parseBody } from './_lib/request.js'

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/

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
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const passcode = typeof body.passcode === 'string' ? body.passcode.trim() : ''
  const sessionId = getSessionId(body.sessionId)
  const expectedPasscode = typeof process.env.PASSCODE === 'string' ? process.env.PASSCODE.trim() : ''
  const requestMeta = getRequestMeta(req)

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Invalid email' })
  }

  if (!expectedPasscode) {
    return res.status(500).json({ error: 'PASSCODE is not configured on the server' })
  }

  if (passcode !== expectedPasscode) {
    return res.status(401).json({ error: 'Invalid passcode' })
  }

  try {
    await writeVisitorEvent({
      eventName: 'unlock_verified',
      timestamp: new Date().toISOString(),
      path: req.url || '/',
      hash: null,
      sessionId,
      payload: { email },
      requestMeta,
    })
  } catch (error) {
    console.error('Failed to write unlock event', error)
  }

  return res.status(200).json({ success: true })
}
