import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./_lib/airtable.js', () => ({
  isAirtableConfigured: vi.fn(),
  writeVisitorEvent: vi.fn(),
}))

vi.mock('./_lib/env.js', () => ({
  isTrackingStrictMode: vi.fn(),
}))

import handler from './track.js'
import { isAirtableConfigured, writeVisitorEvent } from './_lib/airtable.js'
import { isTrackingStrictMode } from './_lib/env.js'

const createRequest = (overrides = {}) => ({
  method: 'POST',
  body: {},
  headers: {},
  url: '/api/track',
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

describe('POST /api/track', () => {
  const consoleErrorSpy = vi.spyOn(console, 'error')

  beforeAll(() => {
    consoleErrorSpy.mockImplementation(() => {})
  })

  beforeEach(() => {
    vi.clearAllMocks()
    isTrackingStrictMode.mockReturnValue(false)
    isAirtableConfigured.mockReturnValue(true)
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

  it('returns success when write succeeds', async () => {
    const req = createRequest({
      body: {
        sessionId: 'session-1',
        eventName: 'presentation_load',
        payload: { email: 'person@example.com' },
      },
    })
    const res = createResponse()

    await handler(req, res)

    expect(writeVisitorEvent).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(202)
    expect(res.body).toEqual({ ok: true, stored: true })
  })

  it('skips writes for Netlify host requests', async () => {
    const req = createRequest({
      body: {
        sessionId: 'session-1',
        eventName: 'section_view',
        originHost: 'preview-123.netlify.app',
      },
    })
    const res = createResponse()

    await handler(req, res)

    expect(writeVisitorEvent).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(202)
    expect(res.body).toEqual({ ok: true, stored: false, code: 'TRACKING_DISABLED_FOR_HOST' })
  })

  it('returns SESSION_ID_MISSING when sessionId is absent', async () => {
    writeVisitorEvent.mockResolvedValue(false)
    isAirtableConfigured.mockReturnValue(true)

    const req = createRequest({
      body: {
        eventName: 'section_view',
        payload: { sectionIndex: 1, totalSections: 2 },
      },
    })
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(202)
    expect(res.body).toEqual({ ok: false, stored: false, code: 'SESSION_ID_MISSING' })
  })

  it('returns AIRTABLE_NOT_CONFIGURED when store is skipped without config', async () => {
    writeVisitorEvent.mockResolvedValue(false)
    isAirtableConfigured.mockReturnValue(false)

    const req = createRequest({
      body: {
        sessionId: 'session-2',
        eventName: 'section_view',
      },
    })
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(202)
    expect(res.body).toEqual({ ok: false, stored: false, code: 'AIRTABLE_NOT_CONFIGURED' })
  })

  it('returns 503 on write failure in strict mode', async () => {
    isTrackingStrictMode.mockReturnValue(true)
    writeVisitorEvent.mockRejectedValue(new Error('boom'))

    const req = createRequest({
      body: {
        sessionId: 'session-3',
        eventName: 'section_view',
      },
    })
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(503)
    expect(res.body).toEqual({ ok: false, stored: false, code: 'AIRTABLE_WRITE_FAILED' })
  })

  it('returns 202 on write failure in non-strict mode', async () => {
    isTrackingStrictMode.mockReturnValue(false)
    writeVisitorEvent.mockRejectedValue(new Error('boom'))

    const req = createRequest({
      body: {
        sessionId: 'session-4',
        eventName: 'section_view',
      },
    })
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(202)
    expect(res.body).toEqual({ ok: false, stored: false, code: 'AIRTABLE_WRITE_FAILED' })
  })

  afterAll(() => {
    consoleErrorSpy.mockRestore()
  })
})
