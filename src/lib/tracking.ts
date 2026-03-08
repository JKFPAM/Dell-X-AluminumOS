import type { TrackingEventName, TrackingEventPayloadMap } from '@/content/trackingEvents'

import { getVisitorSessionId } from './visitorSession'

export const trackPresentationEvent = <TEventName extends TrackingEventName>(
  eventName: TEventName,
  payload: TrackingEventPayloadMap[TEventName],
) => {
  if (typeof window === 'undefined') {
    return
  }

  const body = JSON.stringify({
    sessionId: getVisitorSessionId(),
    eventName,
    payload,
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
    hash: window.location.hash || null,
  })

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' })
    navigator.sendBeacon('/api/track', blob)
    return
  }

  void fetch('/api/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
    keepalive: true,
  }).catch(() => undefined)
}
