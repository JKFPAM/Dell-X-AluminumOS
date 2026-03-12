import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./_lib/airtable.js', () => ({
  writeVisitorEvent: vi.fn(),
}))

vi.mock('./_lib/env.js', () => ({
  getPasscode: vi.fn(),
}))

import handler from './unlock.js'
import { writeVisitorEvent } from './_lib/airtable.js'
import { getPasscode } from './_lib/env.js'

const createRequest = (overrides = {}) => ({
  method: 'POST',
  body: {},
  headers: {},
  url: '/api/unlock',
  ...overrides,
})

const createResponse = () => {
  const res = {
    headers: {},
    statusCode: 200,
    body: null,
    setHeader: vi.fn((key, value) => {
      res.headers[key] = value
      return res
    }),
    status: vi.fn((code) => {
      res.statusCode = code
      return res
    }),
    json: vi.fn((payload) => {
      res.body = payload
      return res
    }),
  }

  return res
}

describe('POST /api/unlock', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getPasscode.mockReturnValue('test-passcode')
    writeVisitorEvent.mockResolvedValue(true)
  })

  it('rejects non-POST methods', async () => {
    const req = createRequest({ method: 'GET' })
    const res = createResponse()

    await handler(req, res)

    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST')
    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.body).toEqual({ error: 'Method not allowed' })
  })

  it('returns 400 when email is invalid', async () => {
    const req = createRequest({ body: { email: 'invalid', passcode: 'test-passcode' } })
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.body).toEqual({ error: 'Invalid email' })
  })

  it('returns 500 when PASSCODE is not configured', async () => {
    getPasscode.mockReturnValue('')
    const req = createRequest({
      body: { email: 'person@example.com', passcode: 'test-passcode' },
    })
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.body).toEqual({ error: 'PASSCODE is not configured on the server' })
  })

  it('returns 401 when passcode does not match', async () => {
    const req = createRequest({
      body: { email: 'person@example.com', passcode: 'wrong-passcode' },
    })
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.body).toEqual({ error: 'Invalid passcode' })
  })

  it('returns 200 and writes unlock event when credentials are valid', async () => {
    const req = createRequest({
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36',
        'x-vercel-ip-country': 'nl',
      },
      body: {
        email: 'person@example.com',
        passcode: 'test-passcode',
        sessionId: '  session-123  ',
      },
    })
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.body).toEqual({ success: true })
    expect(writeVisitorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'unlock_verified',
        sessionId: 'session-123',
        payload: { email: 'person@example.com' },
      }),
    )
  })

  it('returns 200 and skips Airtable writes for Netlify host requests', async () => {
    const req = createRequest({
      body: {
        email: 'person@example.com',
        passcode: 'test-passcode',
        sessionId: 'session-123',
        originHost: 'my-preview-site.netlify.app',
      },
    })
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.body).toEqual({ success: true })
    expect(writeVisitorEvent).not.toHaveBeenCalled()
  })
})
