import type { IncomingMessage, ServerResponse } from 'node:http'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/

const sendJson = (res: ServerResponse, statusCode: number, body: object) => {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

const readJsonBody = async (req: IncomingMessage): Promise<Record<string, unknown>> => {
  const chunks: Uint8Array[] = []

  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  if (!chunks.length) {
    return {}
  }

  try {
    const raw = Buffer.concat(chunks).toString('utf8')
    const parsed = JSON.parse(raw) as unknown
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

const createLocalApiPlugin = (passcode: string): Plugin => ({
  name: 'local-api-unlock',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/api/unlock', (req, res, next) => {
      void (async () => {
        if (req.method !== 'POST') {
          res.setHeader('Allow', 'POST')
          sendJson(res, 405, { error: 'Method not allowed' })
          return
        }

        const body = await readJsonBody(req)
        const email = typeof body.email === 'string' ? body.email.trim() : ''
        const suppliedPasscode = typeof body.passcode === 'string' ? body.passcode.trim() : ''

        if (!email || !EMAIL_REGEX.test(email)) {
          sendJson(res, 400, { error: 'Invalid email' })
          return
        }

        if (!passcode) {
          sendJson(res, 500, { error: 'PASSCODE is not configured on the server' })
          return
        }

        if (suppliedPasscode !== passcode) {
          sendJson(res, 401, { error: 'Invalid passcode' })
          return
        }

        sendJson(res, 200, { success: true })
      })().catch(next)
    })

    server.middlewares.use('/api/track', (req, res, next) => {
      if (req.method !== 'POST') {
        return next()
      }

      sendJson(res, 202, { ok: true })
    })
  },
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const passcode = typeof env.PASSCODE === 'string' ? env.PASSCODE.trim() : ''

  return {
    plugins: [react(), createLocalApiPlugin(passcode)],
  }
})
