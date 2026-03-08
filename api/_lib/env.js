const trimEnvValue = (value) => (typeof value === 'string' ? value.trim() : '')

export const SERVER_ENV_KEYS = [
  'PASSCODE',
  'AIRTABLE_API_TOKEN',
  'AIRTABLE_BASE_ID',
  'AIRTABLE_VISITORS_TABLE',
  // Legacy alias maintained for backward compatibility.
  'AIRTABLE_EVENTS_TABLE',
  'TRACKING_STRICT',
]

export const getPasscode = () => trimEnvValue(process.env.PASSCODE)

export const getAirtableConfig = () => ({
  token: trimEnvValue(process.env.AIRTABLE_API_TOKEN),
  baseId: trimEnvValue(process.env.AIRTABLE_BASE_ID),
  visitorsTable:
    trimEnvValue(process.env.AIRTABLE_VISITORS_TABLE) ||
    trimEnvValue(process.env.AIRTABLE_EVENTS_TABLE) ||
    'Visitors',
})

export const isTrackingStrictMode = () => {
  const normalized = trimEnvValue(process.env.TRACKING_STRICT).toLowerCase()
  return normalized === '1' || normalized === 'true' || normalized === 'yes'
}

export const applyServerEnvFrom = (source) => {
  SERVER_ENV_KEYS.forEach((key) => {
    const value = trimEnvValue(source[key])

    if (value) {
      process.env[key] = value
    }
  })
}
