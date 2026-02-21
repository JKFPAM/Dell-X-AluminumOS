const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/

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
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const passcode = typeof body.passcode === 'string' ? body.passcode.trim() : ''
  const expectedPasscode = typeof process.env.PASSCODE === 'string' ? process.env.PASSCODE.trim() : ''

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Invalid email' })
  }

  if (!expectedPasscode) {
    return res.status(500).json({ error: 'PASSCODE is not configured on the server' })
  }

  if (passcode !== expectedPasscode) {
    return res.status(401).json({ error: 'Invalid passcode' })
  }

  // Email capture placeholder for Sprint 2 Airtable integration.
  // Keep request shape stable so persistence can be added without frontend changes.
  console.log('Access granted to:', email)

  return res.status(200).json({ success: true })
}
