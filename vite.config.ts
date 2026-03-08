import type { IncomingMessage, ServerResponse } from 'node:http'
import { createRequire } from 'node:module'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { applyServerEnvFrom } from './api/_lib/env.js'

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

type DevApiRequest = IncomingMessage & { body?: unknown }
type DevApiResponse = ServerResponse & {
  status: (statusCode: number) => DevApiResponse
  json: (body: object) => DevApiResponse
}
type DevApiHandler = (req: DevApiRequest, res: DevApiResponse) => Promise<unknown>

const require = createRequire(import.meta.url)
const trackHandler = require('./api/track.js').default as DevApiHandler
const unlockHandler = require('./api/unlock.js').default as DevApiHandler

const toDevApiResponse = (res: ServerResponse): DevApiResponse => {
  const response = res as DevApiResponse

  response.status = (statusCode: number) => {
    res.statusCode = statusCode
    return response
  }

  response.json = (body: object) => {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json')
    }

    res.end(JSON.stringify(body))
    return response
  }

  return response
}

const runDevApiHandler = async (
  handler: DevApiHandler,
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const body = await readJsonBody(req)
  const request = req as DevApiRequest
  request.body = body
  await handler(request, toDevApiResponse(res))
}

const createLocalApiPlugin = (): Plugin => ({
  name: 'local-api-handlers',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url?.startsWith('/api/unlock')) {
        void runDevApiHandler(unlockHandler, req, res).catch(next)
        return
      }

      if (req.url?.startsWith('/api/track')) {
        void runDevApiHandler(trackHandler, req, res).catch(next)
        return
      }

      next()
    })
  },
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  applyServerEnvFrom(env)

  return {
    plugins: [react(), createLocalApiPlugin()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
