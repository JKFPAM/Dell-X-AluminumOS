const AIRTABLE_API_ROOT = 'https://api.airtable.com/v0'

const getConfig = () => ({
  token: (process.env.AIRTABLE_API_TOKEN || '').trim(),
  baseId: (process.env.AIRTABLE_BASE_ID || '').trim(),
  visitorsTable: (
    process.env.AIRTABLE_VISITORS_TABLE ||
    process.env.AIRTABLE_EVENTS_TABLE ||
    'Visitors'
  ).trim(),
})

const sanitizeFields = (fields) =>
  Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )

const getEmail = (payload) => {
  const raw = payload?.email

  if (typeof raw !== 'string') {
    return null
  }

  const trimmed = raw.trim()
  return trimmed || null
}

const getText = (value) => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed || null
}

const getDateAndTime = (timestamp) => {
  const safeTimestamp = getText(timestamp) || new Date().toISOString()
  const parsedDate = new Date(safeTimestamp)

  if (Number.isNaN(parsedDate.getTime())) {
    return { date: null, time: null }
  }

  const date = parsedDate.toISOString().slice(0, 10)
  const time = parsedDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  })

  return { date, time }
}

const escapeFormulaValue = (value) =>
  value
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'")

const requestAirtable = async (path, init) => {
  const { token, baseId } = getConfig()
  const response = await fetch(`${AIRTABLE_API_ROOT}/${baseId}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  })

  if (response.ok) {
    return response.json()
  }

  const errorText = await response.text()
  throw new Error(`Airtable request failed (${response.status}): ${errorText}`)
}

const findRecordIdBySessionId = async (tableName, sessionId) => {
  const formula = `{Session ID}='${escapeFormulaValue(sessionId)}'`
  const params = new URLSearchParams({
    maxRecords: '1',
    filterByFormula: formula,
  })

  const data = await requestAirtable(`${encodeURIComponent(tableName)}?${params.toString()}`, {
    method: 'GET',
  })

  return data.records?.[0]?.id || null
}

const createRecord = async (tableName, fields) => {
  await requestAirtable(encodeURIComponent(tableName), {
    method: 'POST',
    body: JSON.stringify({
      records: [{ fields: sanitizeFields(fields) }],
      typecast: true,
    }),
  })
}

const updateRecord = async (tableName, recordId, fields) => {
  await requestAirtable(encodeURIComponent(tableName), {
    method: 'PATCH',
    body: JSON.stringify({
      records: [{ id: recordId, fields: sanitizeFields(fields) }],
      typecast: true,
    }),
  })
}

export const isAirtableConfigured = () => {
  const { token, baseId, visitorsTable } = getConfig()
  return Boolean(token && baseId && visitorsTable)
}

export const writeVisitorEvent = async ({
  timestamp,
  payload = {},
  sessionId = null,
  requestMeta = {},
}) => {
  if (!isAirtableConfigured()) {
    return false
  }

  const normalizedSessionId = getText(sessionId)

  if (!normalizedSessionId) {
    return false
  }

  const browser = getText(requestMeta.browser)
  const country = getText(requestMeta.country)
  const email = getEmail(payload)
  const { date, time } = getDateAndTime(timestamp)

  const fields = sanitizeFields({
    Email: email,
    Browser: browser,
    Country: country,
    Date: date,
    Time: time,
  })

  const { visitorsTable } = getConfig()
  const existingRecordId = await findRecordIdBySessionId(visitorsTable, normalizedSessionId)

  if (existingRecordId) {
    await updateRecord(visitorsTable, existingRecordId, fields)
    return true
  }

  await createRecord(visitorsTable, {
    'Session ID': normalizedSessionId,
    ...fields,
  })

  return true
}
