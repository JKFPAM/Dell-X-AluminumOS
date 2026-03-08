export const SERVER_ENV_KEYS: readonly string[]

export const getPasscode: () => string

export const getAirtableConfig: () => {
  token: string
  baseId: string
  visitorsTable: string
}

export const isTrackingStrictMode: () => boolean

export const applyServerEnvFrom: (source: Record<string, string | undefined>) => void
