const VISITOR_SESSION_KEY = 'visitor_session_id'

const createSessionId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  const randomPart = Math.random().toString(36).slice(2, 12)
  return `vs_${Date.now().toString(36)}_${randomPart}`
}

export const getVisitorSessionId = () => {
  if (typeof window === 'undefined') {
    return 'server'
  }

  const existingValue = window.localStorage.getItem(VISITOR_SESSION_KEY)

  if (existingValue && existingValue.trim()) {
    return existingValue
  }

  const nextValue = createSessionId()
  window.localStorage.setItem(VISITOR_SESSION_KEY, nextValue)
  return nextValue
}
