import { useCallback, useEffect, useRef, useState } from 'react'
import { IntroScrollHint, PartnerLockup } from '@/components'
import {
  INTRO_HERO_SYNC_EVENT,
  INTRO_HERO_SYNC_KEY,
  type IntroHeroSyncDetail,
} from '@/lib'
import './IntroSection.css'

const TAGLINE = 'Defining a future vision for AluminumOS on Dell'
const DESCRIPTOR =
  'This initial vision, created jointly by EDG and CSG Strategy, highlights the emerging opportunity with Google’s AluminumOS and serves as a call to action for the continued work needed to bring it to life.'

function IntroSection() {
  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const sparkVideoRef = useRef<HTMLVideoElement>(null)
  const hasAppliedSyncRef = useRef(false)
  const isLiveSyncActiveRef = useRef(false)
  const [isHeroVideoReady, setIsHeroVideoReady] = useState(false)
  const [isSparkVideoReady, setIsSparkVideoReady] = useState(false)
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  const isSafari =
    /safari/i.test(userAgent) &&
    !/chrome|chromium|android|crios|fxios|edgios|opr\//i.test(userAgent)

  const syncHeroToTime = useCallback((time: number, duration: number | null) => {
    const video = heroVideoRef.current

    if (!video || !Number.isFinite(time) || time < 0) {
      return
    }

    let targetTime = time

    if (duration && duration > 0) {
      targetTime = time % duration
    } else if (Number.isFinite(video.duration) && video.duration > 0) {
      targetTime = time % video.duration
    }

    const delta = Math.abs((Number.isFinite(video.currentTime) ? video.currentTime : 0) - targetTime)

    if (delta > 1 / 40) {
      try {
        video.currentTime = targetTime
      } catch {
        // no-op: if seek fails browser will continue normal playback
      }
    }
  }, [])

  const applyHeroSyncTime = useCallback(() => {
    if (hasAppliedSyncRef.current || typeof window === 'undefined') {
      return
    }

    const rawSyncTime = window.sessionStorage.getItem(INTRO_HERO_SYNC_KEY)

    if (!rawSyncTime) {
      return
    }

    const syncTime = Number(rawSyncTime)
    const video = heroVideoRef.current

    if (!video || !Number.isFinite(syncTime) || syncTime < 0) {
      window.sessionStorage.removeItem(INTRO_HERO_SYNC_KEY)
      hasAppliedSyncRef.current = true
      return
    }

    syncHeroToTime(syncTime, null)

    window.sessionStorage.removeItem(INTRO_HERO_SYNC_KEY)
    hasAppliedSyncRef.current = true
  }, [syncHeroToTime])

  useEffect(() => {
    applyHeroSyncTime()
  }, [applyHeroSyncTime])

  useEffect(() => {
    const handleLiveSync = (event: Event) => {
      const customEvent = event as CustomEvent<IntroHeroSyncDetail>
      const detail = customEvent.detail

      if (!detail) {
        return
      }

      isLiveSyncActiveRef.current = detail.active

      if (detail.active) {
        syncHeroToTime(detail.time, detail.duration)
      } else {
        hasAppliedSyncRef.current = true
      }
    }

    window.addEventListener(INTRO_HERO_SYNC_EVENT, handleLiveSync as EventListener)

    return () => {
      window.removeEventListener(INTRO_HERO_SYNC_EVENT, handleLiveSync as EventListener)
    }
  }, [syncHeroToTime])

  return (
    <section className="intro-slide" data-node-id="2735:5629">
      <div
        aria-label="Dell and Google partnership presentation"
        className="intro-shell"
      >
        <div className="intro-hero">
          <video
            aria-hidden="true"
            autoPlay
            className={`intro-hero-video ${isHeroVideoReady ? 'is-visible' : ''}`}
            loop
            muted
            onCanPlay={() => {
              if (!isLiveSyncActiveRef.current) {
                applyHeroSyncTime()
              }
              setIsHeroVideoReady(true)
            }}
            onError={() => setIsHeroVideoReady(false)}
            playsInline
            preload="auto"
            ref={heroVideoRef}
          >
            <source src="/assets/section-one/videos/gemini-animation.mp4" type="video/mp4" />
          </video>
          <div className={`intro-hero-fallback ${isHeroVideoReady ? 'is-hidden' : ''}`} />

          <PartnerLockup className="intro-partner-lockup" nodeId="2735:5634" showPartnership />
        </div>

        <p className="intro-tagline" data-node-id="2735:5631">
          <span>{TAGLINE}</span>
          <span aria-hidden="true" className="intro-tagline-spark">
            <video
              autoPlay
              className={`intro-tagline-spark-video ${isSparkVideoReady ? 'is-visible' : ''}`}
              loop
              muted
              onCanPlay={() => setIsSparkVideoReady(true)}
              onError={() => setIsSparkVideoReady(false)}
              playsInline
              preload="auto"
              ref={sparkVideoRef}
            >
              {isSafari && (
                <source src="/assets/section-one/videos/gem-loop-alpha.mov" type="video/quicktime" />
              )}
              <source src="/assets/section-one/videos/gem-loop-alpha.webm" type="video/webm" />
              <source src="/assets/section-one/videos/gem-loop-alpha.mp4" type="video/mp4" />
            </video>
            <span className={`intro-tagline-spark-fallback ${isSparkVideoReady ? 'is-hidden' : ''}`} />
          </span>
        </p>

        <p className="intro-descriptor">
          {DESCRIPTOR}
        </p>
      </div>

      <div className="intro-sr-only" data-node-id="2735:5630">
        Partnership presentation frame
      </div>
      <IntroScrollHint />
    </section>
  )
}

export default IntroSection
