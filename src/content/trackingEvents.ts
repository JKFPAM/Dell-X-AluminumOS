import type { PresentationSectionId } from './presentationStructure'

export const TRACKING_EVENTS = {
  presentationUnlock: 'presentation_unlock',
  presentationLoad: 'presentation_load',
  sectionView: 'section_view',
  presentationExit: 'presentation_exit',
} as const

export type TrackingEventName = (typeof TRACKING_EVENTS)[keyof typeof TRACKING_EVENTS]

export type TrackingEventPayloadMap = {
  [TRACKING_EVENTS.presentationUnlock]: {
    email: string
  }
  [TRACKING_EVENTS.presentationLoad]: {
    email: string | null
    hash: string | null
  }
  [TRACKING_EVENTS.sectionView]: {
    email: string | null
    sectionId: PresentationSectionId
    sectionIndex: number
    totalSections: number
    sectionHash: string
  }
  [TRACKING_EVENTS.presentationExit]: {
    email: string | null
    durationMs: number
  }
}
