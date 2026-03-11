import { getAirtableConfig } from './env.js'

const AIRTABLE_API_ROOT = 'https://api.airtable.com/v0'

const sanitizeFields = (fields) =>
  Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )

const OPTIONAL_RETURN_FIELDS = ['Visits', 'Returning', 'Reached Last Section']

const getEmail = (payload) => {
  const raw = typeof payload?.email === 'string' ? payload.email : payload?.Email

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

const findRecords = async (tableName, { formula, maxRecords = '1' }) => {
  const params = new URLSearchParams({
    maxRecords,
    filterByFormula: formula,
  })

  const data = await requestAirtable(`${encodeURIComponent(tableName)}?${params.toString()}`, {
    method: 'GET',
  })

  return data.records ?? []
}

const findRecordBySessionId = async (tableName, sessionId) => {
  const formula = `{Session ID}='${escapeFormulaValue(sessionId)}'`
  const records = await findRecords(tableName, { formula, maxRecords: '1' })
  return records[0] ?? null
}

const findRecordsByEmail = async (tableName, email) => {
  const formula = `LOWER({Email})='${escapeFormulaValue(email.toLowerCase())}'`
  return findRecords(tableName, { formula, maxRecords: '50' })
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

const deleteRecord = async (tableName, recordId) => {
  await requestAirtable(`${encodeURIComponent(tableName)}/${encodeURIComponent(recordId)}`, {
    method: 'DELETE',
  })
}

const getVisitCount = (fields) => {
  const primaryRaw = fields?.Visits
  if (typeof primaryRaw === 'number' && Number.isFinite(primaryRaw) && primaryRaw >= 0) {
    return primaryRaw
  }

  const legacyRaw = fields?.['Visit Count']
  return typeof legacyRaw === 'number' && Number.isFinite(legacyRaw) && legacyRaw >= 0
    ? legacyRaw
    : 0
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

const didRecordReachLastSection = (recordFields) =>
  recordFields?.['Reached Last Section'] === true || recordFields?.Completed === true

const getReachedLastSection = (existingRecords, eventName, payload) =>
  existingRecords.some((record) => didRecordReachLastSection(record?.fields)) ||
  didReachLastSectionOnEvent(eventName, payload)

const getExistingEmail = (records) => {
  for (const record of records) {
    const email = getEmail(record?.fields)
    if (email) {
      return email
    }
  }

  return null
}

const getTotalVisits = (records) =>
  records.reduce((total, record) => total + getVisitCount(record?.fields), 0)

const getRecordSessionId = (record) => getText(record?.fields?.['Session ID'])

const getPrimaryRecord = (records, normalizedSessionId) => {
  if (!records.length) {
    return null
  }

  if (normalizedSessionId) {
    const sessionMatch = records.find(
      (record) => getRecordSessionId(record) === normalizedSessionId,
    )

    if (sessionMatch) {
      return sessionMatch
    }
  }

  return records[0]
}

const removeDuplicateRecords = async (tableName, duplicateRecords) => {
  if (!duplicateRecords.length) {
    return
  }

  const results = await Promise.allSettled(
    duplicateRecords.map((record) => deleteRecord(tableName, record.id)),
  )

  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.error('Failed to delete duplicate visitor record', {
        code: 'AIRTABLE_DUPLICATE_DELETE_FAILED',
        error: result.reason instanceof Error ? result.reason.message : String(result.reason),
      })
    }
  })
}

const getUnknownFieldNameFromError = (message) => {
  const quotedMatch = message.match(/unknown field name:\s*"([^"]+)"/i)
  if (quotedMatch?.[1]) {
    return quotedMatch[1].trim()
  }

  const singleQuotedMatch = message.match(/unknown field name:\s*'([^']+)'/i)
  if (singleQuotedMatch?.[1]) {
    return singleQuotedMatch[1].trim()
  }

  return null
}

const getInvalidFieldNameFromError = (message) => {
  const cannotAcceptMatch = message.match(/field\s+"([^"]+)"\s+cannot accept/i)
  if (cannotAcceptMatch?.[1]) {
    return cannotAcceptMatch[1].trim()
  }

  const cannotAcceptSingleQuoteMatch = message.match(/field\s+'([^']+)'\s+cannot accept/i)
  if (cannotAcceptSingleQuoteMatch?.[1]) {
    return cannotAcceptSingleQuoteMatch[1].trim()
  }

  const invalidColumnMatch = message.match(/invalid_value_for_column.*field\s+"([^"]+)"/i)
  if (invalidColumnMatch?.[1]) {
    return invalidColumnMatch[1].trim()
  }

  return null
}

const writeWithOptionalFallback = async (writeFn, fields) => {
  const candidateFields = { ...fields }
  const attemptedUnknowns = new Set()
  const attemptedInvalids = new Set()

  while (true) {
    try {
      await writeFn(candidateFields)
      return
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const normalizedMessage = message.toLowerCase()

      if (
        !normalizedMessage.includes('unknown field') &&
        !normalizedMessage.includes('unknown_field_name') &&
        !normalizedMessage.includes('cannot accept') &&
        !normalizedMessage.includes('invalid_value_for_column')
      ) {
        throw error
      }

      const unknownFieldName = getUnknownFieldNameFromError(message)
      const invalidFieldName = getInvalidFieldNameFromError(message)

      if (invalidFieldName) {
        if (!Object.prototype.hasOwnProperty.call(candidateFields, invalidFieldName)) {
          throw error
        }

        if (attemptedInvalids.has(invalidFieldName)) {
          throw error
        }

        attemptedInvalids.add(invalidFieldName)
        delete candidateFields[invalidFieldName]
        continue
      }

      if (!unknownFieldName) {
        const fallbackFields = { ...candidateFields }
        OPTIONAL_RETURN_FIELDS.forEach((fieldName) => {
          delete fallbackFields[fieldName]
        })
        if (Object.prototype.hasOwnProperty.call(fields, 'Completed')) {
          fallbackFields.Completed = fields.Completed
        }
        await writeFn(fallbackFields)
        return
      }

      if (!Object.prototype.hasOwnProperty.call(candidateFields, unknownFieldName)) {
        throw error
      }

      if (attemptedUnknowns.has(unknownFieldName)) {
        throw error
      }

      attemptedUnknowns.add(unknownFieldName)
      delete candidateFields[unknownFieldName]
    }
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

  const email = getEmail(payload)
  const normalizedSessionId = getText(sessionId)

  if (!normalizedSessionId && !email) {
    return false
  }

  const browser = getText(requestMeta.browser)
  const country = getText(requestMeta.country)
  const { date, time } = getDateAndTime(timestamp)
  const isPresentationLoad = eventName === 'presentation_load'

  const { visitorsTable } = getAirtableConfig()
  let matchingRecords = []

  if (email) {
    matchingRecords = await findRecordsByEmail(visitorsTable, email)
  }

  if (!matchingRecords.length && normalizedSessionId) {
    const existingRecordBySession = await findRecordBySessionId(visitorsTable, normalizedSessionId)
    if (existingRecordBySession) {
      matchingRecords = [existingRecordBySession]
    }
  }

  const primaryRecord = getPrimaryRecord(matchingRecords, normalizedSessionId)
  const duplicateRecords = primaryRecord
    ? matchingRecords.filter((record) => record.id !== primaryRecord.id)
    : []
  const existingVisitCount = getTotalVisits(matchingRecords)
  const nextVisitCount = isPresentationLoad ? existingVisitCount + 1 : existingVisitCount
  const reachedLastSection = getReachedLastSection(matchingRecords, eventName, payload)
  const normalizedEmail = email ?? getExistingEmail(matchingRecords)
  const storedSessionId = normalizedSessionId ?? getRecordSessionId(primaryRecord)
  const canCreateRecord =
    eventName === 'unlock_verified' ||
    eventName === 'presentation_load' ||
    eventName === 'presentation_unlock'

  if (!primaryRecord?.id && !canCreateRecord) {
    return false
  }

  const fields = sanitizeFields({
    Email: normalizedEmail,
    'Session ID': storedSessionId,
    Browser: browser,
    Country: country,
    Date: date,
    Time: time,
    Visits: nextVisitCount > 0 ? nextVisitCount : undefined,
    Returning: nextVisitCount > 1,
    'Reached Last Section': reachedLastSection,
    Completed: reachedLastSection,
  })

  if (primaryRecord?.id) {
    await writeWithOptionalFallback(
      (nextFields) => updateRecord(visitorsTable, primaryRecord.id, nextFields),
      fields,
    )
    await removeDuplicateRecords(visitorsTable, duplicateRecords)
    return true
  }

  await writeWithOptionalFallback(
    (nextFields) => createRecord(visitorsTable, nextFields),
    fields,
  )

  return true
}
