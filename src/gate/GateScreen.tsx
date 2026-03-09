import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { PartnerLockup } from '@/components'
import { INTRO_HERO_SYNC_EVENT, getVisitorSessionId, type IntroHeroSyncDetail } from '@/lib'
import './GateScreen.css'

type GateScreenProps = {
  isUnlocking: boolean
  onUnlocked: (email: string, introHeroTime: number) => void
}

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/

const INTRO_TAGLINE = 'Defining a future vision for AluminumOS on Dell'

function GateScreen({ isUnlocking, onUnlocked }: GateScreenProps) {
  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const syncRafRef = useRef(0)
  const [email, setEmail] = useState('')
  const [passcode, setPasscode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isHeroVideoReady, setIsHeroVideoReady] = useState(false)

  const trimmedEmail = useMemo(() => email.trim(), [email])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting || isUnlocking) {
      return
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/unlock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
          passcode,
          sessionId: getVisitorSessionId(),
        }),
      })

      if (response.status === 401) {
        setErrorMessage('Invalid passcode. Please check and try again.')
        return
      }

      if (!response.ok) {
        setErrorMessage('Unable to verify passcode right now. Please try again.')
        return
      }

      onUnlocked(trimmedEmail, heroVideoRef.current?.currentTime ?? 0)
    } catch {
      setErrorMessage('Unable to verify passcode right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const emitHeroSync = (active: boolean) => {
      const video = heroVideoRef.current

      if (!video) {
        return
      }

      const detail: IntroHeroSyncDetail = {
        active,
        duration: Number.isFinite(video.duration) && video.duration > 0 ? video.duration : null,
        time: Number.isFinite(video.currentTime) ? video.currentTime : 0,
      }

      window.dispatchEvent(new CustomEvent<IntroHeroSyncDetail>(INTRO_HERO_SYNC_EVENT, { detail }))
    }

    if (!isUnlocking) {
      emitHeroSync(false)
      return
    }

    const tick = () => {
      emitHeroSync(true)
      syncRafRef.current = window.requestAnimationFrame(tick)
    }

    syncRafRef.current = window.requestAnimationFrame(tick)

    return () => {
      if (syncRafRef.current) {
        window.cancelAnimationFrame(syncRafRef.current)
        syncRafRef.current = 0
      }
      emitHeroSync(false)
    }
  }, [isUnlocking])

  return (
    <main className={`gate-screen ${isUnlocking ? 'is-unlocking' : ''}`} data-node-id="2776:5767">
      <section className="gate-shell">
        <header className="gate-hero" data-node-id="2776:5770">
          <video
            aria-hidden="true"
            autoPlay
            className={`gate-hero-video ${isHeroVideoReady ? 'is-visible' : ''}`}
            loop
            muted
            ref={heroVideoRef}
            onCanPlay={() => setIsHeroVideoReady(true)}
            onError={() => setIsHeroVideoReady(false)}
            playsInline
            preload="auto"
          >
            <source src="/assets/section-one/videos/gemini-animation.mp4" type="video/mp4" />
          </video>
          <div className={`gate-hero-fallback ${isHeroVideoReady ? 'is-hidden' : ''}`} />

          <PartnerLockup nodeId="2776:5772" />
        </header>

        <section className="gate-form-wrap" data-node-id="2784:5790">
          <div className="gate-copy">
            <h1 className="gate-title">
              This presentation requires entering your email and a password to open.
            </h1>
            <p className="gate-subtitle">
              Your email will be shared with the owner of this presentation and with their
              collaborators.
            </p>
          </div>

          <form className="gate-form" onSubmit={handleSubmit}>
            <label className="gate-field">
              <span className="gate-sr-only">Email</span>
              <input
                autoComplete="email"
                className="gate-input"
                inputMode="email"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email"
                required
                type="email"
                value={email}
              />
            </label>

            <label className="gate-field">
              <span className="gate-sr-only">Password</span>
              <input
                autoComplete="current-password"
                className="gate-input"
                name="passcode"
                onChange={(event) => setPasscode(event.target.value)}
                placeholder="Password"
                required
                type="password"
                value={passcode}
              />
            </label>

            <button className="gate-submit" disabled={isSubmitting || isUnlocking} type="submit">
              {isUnlocking ? 'Opening…' : isSubmitting ? 'Checking…' : 'Agree & continue'}
            </button>
          </form>

          {errorMessage && (
            <p aria-live="polite" className="gate-error" role="alert">
              {errorMessage}
            </p>
          )}
        </section>

        <p aria-hidden="true" className="gate-transition-tagline">
          {INTRO_TAGLINE}
        </p>

        <footer className="gate-footer" data-node-id="2784:5791">
          This presentation is strictly confidential and intended solely for authorized recipients
          at Dell Technologies and their Partners. By continuing, you confirm you are an
          authorized recipient. Your email, device information, and viewing activity will be
          captured and shared with Dell Technologies.
        </footer>
      </section>
    </main>
  )
}

export default GateScreen
