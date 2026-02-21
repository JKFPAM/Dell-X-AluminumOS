export const INTRO_HERO_SYNC_KEY = 'intro_hero_sync_time'
export const INTRO_HERO_SYNC_EVENT = 'intro-hero-sync'

export type IntroHeroSyncDetail = {
  active: boolean
  duration: number | null
  time: number
}
