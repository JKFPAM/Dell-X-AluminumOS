const getHeader = (req, name) => {
  const value = req.headers?.[name]

  if (Array.isArray(value)) {
    return value[0] ?? ''
  }

  return typeof value === 'string' ? value : ''
}

const normalizeHost = (value) => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  try {
    return new URL(trimmed).hostname.toLowerCase()
  } catch {
    const first = trimmed.split(',')[0]?.trim() ?? trimmed
    const withoutPort = first.split(':')[0]?.trim() ?? first
    return withoutPort ? withoutPort.toLowerCase() : null
  }
}

const isNetlifyHost = (host) => {
  if (!host) {
    return false
  }

  return host === 'netlify.app' || host.endsWith('.netlify.app')
}

export const parseBody = (body) => {
  if (!body) {
    return {}
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      return {}
    }
  }

  return typeof body === 'object' ? body : {}
}

const toCountryName = (countryCode) => {
  if (!countryCode) {
    return null
  }

  try {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
    return regionNames.of(countryCode) ?? countryCode
  } catch {
    return countryCode
  }
}

const getBrowserName = (userAgent) => {
  const ua = userAgent || ''

  if (!ua) {
    return null
  }

  if (/Edg\//.test(ua)) {
    return 'Edge'
  }
  if (/OPR\//.test(ua)) {
    return 'Opera'
  }
  if (/CriOS/.test(ua)) {
    return 'Chrome'
  }
  if (/FxiOS/.test(ua)) {
    return 'Firefox'
  }
  if (/Firefox\//.test(ua)) {
    return 'Firefox'
  }
  if (/Chrome\//.test(ua)) {
    return 'Chrome'
  }
  if (/Safari\//.test(ua) && /Mobile\//.test(ua) && !/Chrome\//.test(ua)) {
    return 'Mobile Safari'
  }
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) {
    return 'Safari'
  }
  if (/MSIE|Trident/.test(ua)) {
    return 'Internet Explorer'
  }

  return 'Other'
}

export const getRequestMeta = (req) => {
  const userAgent = getHeader(req, 'user-agent') || null
  const countryCode = (getHeader(req, 'x-vercel-ip-country') || '').toUpperCase() || null

  return {
    browser: getBrowserName(userAgent),
    country: toCountryName(countryCode),
  }
}

export const shouldSkipTracking = (req, body = {}) => {
  const bodyOriginHost = normalizeHost(body?.originHost)
  const forwardedHost = normalizeHost(getHeader(req, 'x-forwarded-host'))
  const originHost = normalizeHost(getHeader(req, 'origin'))
  const refererHost = normalizeHost(getHeader(req, 'referer'))

  return [bodyOriginHost, forwardedHost, originHost, refererHost].some(isNetlifyHost)
}
