import { getAirtableConfig } from './env.js'

const AIRTABLE_API_ROOT = 'https://api.airtable.com/v0'

const sanitizeFields = (fields) =>
  Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )

const OPTIONAL_RETURN_FIELDS = ['Visit Count', 'Returning', 'Reached Last Section', 'Completed']

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
  const { token, baseId } = getAirtableConfig()
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

const findRecordBySessionId = async (tableName, sessionId) => {
  const formula = `{Session ID}='${escapeFormulaValue(sessionId)}'`
  const params = new URLSearchParams({
    maxRecords: '1',
    filterByFormula: formula,
  })

  const data = await requestAirtable(`${encodeURIComponent(tableName)}?${params.toString()}`, {
    method: 'GET',
  })

  return data.records?.[0] ?? null
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

const getVisitCount = (fields) => {
  const raw = fields?.['Visit Count']
  return typeof raw === 'number' && Number.isFinite(raw) && raw >= 0 ? raw : 0
}

const getNumber = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

const didReachLastSectionOnEvent = (eventName, payload) => {
  if (eventName !== 'section_view') {
    return false
  }

  const sectionId = getText(payload?.sectionId)
  if (sectionId === 'outro' || sectionId === 'outro-final') {
    return true
  }

  const sectionIndex = getNumber(payload?.sectionIndex)
  const totalSections = getNumber(payload?.totalSections)

  if (!sectionIndex || !totalSections || totalSections <= 0) {
    return false
  }

  return sectionIndex >= totalSections
}

const getReachedLastSection = (existingFields, eventName, payload) => {
  const alreadyReached =
    existingFields?.['Reached Last Section'] === true || existingFields?.Completed === true
  return alreadyReached || didReachLastSectionOnEvent(eventName, payload)
}

const writeWithOptionalFallback = async (writeFn, fields) => {
  try {
    await writeFn(fields)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    const normalizedMessage = message.toLowerCase()

    if (
      !normalizedMessage.includes('unknown field') &&
      !normalizedMessage.includes('unknown_field_name')
    ) {
      throw error
    }

    const fallbackFields = { ...fields }
    OPTIONAL_RETURN_FIELDS.forEach((fieldName) => {
      delete fallbackFields[fieldName]
    })

    await writeFn(fallbackFields)
  }
}

export const isAirtableConfigured = () => {
  const { token, baseId, visitorsTable } = getAirtableConfig()
  return Boolean(token && baseId && visitorsTable)
}

export const writeVisitorEvent = async ({
  eventName,
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
  const isPresentationLoad = eventName === 'presentation_load'

  const { visitorsTable } = getAirtableConfig()
  const existingRecord = await findRecordBySessionId(visitorsTable, normalizedSessionId)
  const existingVisitCount = getVisitCount(existingRecord?.fields)
  const nextVisitCount = isPresentationLoad ? existingVisitCount + 1 : existingVisitCount
  const reachedLastSection = getReachedLastSection(existingRecord?.fields, eventName, payload)

  const fields = sanitizeFields({
    Email: email,
    Browser: browser,
    Country: country,
    Date: date,
    Time: time,
    'Visit Count': nextVisitCount > 0 ? nextVisitCount : undefined,
    Returning: nextVisitCount > 1,
    'Reached Last Section': reachedLastSection,
    Completed: reachedLastSection,
  })

  if (existingRecord?.id) {
    await writeWithOptionalFallback(
      (nextFields) => updateRecord(visitorsTable, existingRecord.id, nextFields),
      fields,
    )
    return true
  }

  const createFields = {
    'Session ID': normalizedSessionId,
    ...fields,
  }

  await writeWithOptionalFallback(
    (nextFields) => createRecord(visitorsTable, nextFields),
    createFields,
  )

  return true
}
