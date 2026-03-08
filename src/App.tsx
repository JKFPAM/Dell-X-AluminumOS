import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import GateScreen from './gate/GateScreen'
import PresentationDeck from './features/presentation/PresentationDeck'
import LegalPage from './legal/LegalPage'
import { TRACKING_EVENTS } from './content/trackingEvents'
import { INTRO_HERO_SYNC_KEY } from './lib/heroSync'
import { trackPresentationEvent } from './lib/tracking'

const GATE_UNLOCK_KEY = 'gate_unlocked'
const GATE_EMAIL_KEY = 'gate_email'
const LEGAL_PATH = '/legal'
const UNLOCK_TRANSITION_MS = 1450

const getCurrentPath = () => {
  const trimmed = window.location.pathname.replace(/\/+$/, '')
  return trimmed || '/'
}

const isLegalPath = (path: string) => path === LEGAL_PATH

type GatePhase = 'locked' | 'unlocking' | 'unlocked'

const isGateUnlocked = () => window.localStorage.getItem(GATE_UNLOCK_KEY) === 'true'
const getStoredEmail = () => window.localStorage.getItem(GATE_EMAIL_KEY) ?? ''

function App() {
  const [currentPath, setCurrentPath] = useState(() => getCurrentPath())
  const [gatePhase, setGatePhase] = useState<GatePhase>(() =>
    isGateUnlocked() ? 'unlocked' : 'locked',
  )
  const [viewerEmail, setViewerEmail] = useState(() => getStoredEmail())
  const enteredPresentationAtRef = useRef<number | null>(null)
  const isUnlocked = gatePhase === 'unlocked'
  const isUnlocking = gatePhase === 'unlocking'
  const shouldRenderDeck = gatePhase !== 'locked'

  useEffect(() => {
    const syncPath = () => {
      setCurrentPath(getCurrentPath())
    }

    window.addEventListener('popstate', syncPath)

    return () => {
      window.removeEventListener('popstate', syncPath)
    }
  }, [])

  useEffect(() => {
    if (gatePhase !== 'unlocking') {
      return
    }

    const timeout = window.setTimeout(() => {
      setGatePhase('unlocked')
    }, UNLOCK_TRANSITION_MS)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [gatePhase])

  useEffect(() => {
    if (!isUnlocked || isLegalPath(currentPath)) {
      enteredPresentationAtRef.current = null
      return
    }

    enteredPresentationAtRef.current = Date.now()
    trackPresentationEvent(TRACKING_EVENTS.presentationLoad, {
      email: viewerEmail || null,
      hash: window.location.hash || null,
    })

    const handleBeforeUnload = () => {
      const enteredAt = enteredPresentationAtRef.current
      const elapsedMs = enteredAt ? Date.now() - enteredAt : 0

      trackPresentationEvent(TRACKING_EVENTS.presentationExit, {
        email: viewerEmail || null,
        durationMs: elapsedMs,
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      handleBeforeUnload()
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [currentPath, isUnlocked, viewerEmail])

  const goToPath = useCallback((nextPath: string) => {
    const normalizedNextPath = nextPath.startsWith('/') ? nextPath : `/${nextPath}`
    const normalizedCurrentPath = getCurrentPath()

    if (normalizedCurrentPath === normalizedNextPath) {
      return
    }

    window.history.pushState(null, '', normalizedNextPath)
    setCurrentPath(normalizedNextPath)
  }, [])

  const handleUnlock = useCallback((email: string, introHeroTime: number) => {
    window.localStorage.setItem(GATE_UNLOCK_KEY, 'true')
    window.localStorage.setItem(GATE_EMAIL_KEY, email)
    window.sessionStorage.setItem(INTRO_HERO_SYNC_KEY, String(Math.max(0, introHeroTime)))

    setViewerEmail(email)
    setGatePhase('unlocking')

    trackPresentationEvent(TRACKING_EVENTS.presentationUnlock, { email })
  }, [])

  const handleLogout = useCallback(() => {
    window.localStorage.removeItem(GATE_UNLOCK_KEY)
    window.localStorage.removeItem(GATE_EMAIL_KEY)
    window.sessionStorage.removeItem(INTRO_HERO_SYNC_KEY)

    window.history.replaceState(null, '', '/')
    setCurrentPath('/')
    setViewerEmail('')
    setGatePhase('locked')
  }, [])

  const handleSectionChange = useCallback(
    (index: number, totalSections: number) => {
      if (!isUnlocked) {
        return
      }

      trackPresentationEvent(TRACKING_EVENTS.sectionView, {
        email: viewerEmail || null,
        sectionIndex: index + 1,
        totalSections,
        sectionHash: window.location.hash || `#${String(index + 1).padStart(2, '0')}`,
      })
    },
    [isUnlocked, viewerEmail],
  )

  if (isLegalPath(currentPath)) {
    return <LegalPage onBack={() => goToPath('/')} />
  }

  return (
    <div className={`app-root ${isUnlocking ? 'is-unlocking' : ''}`}>
      {shouldRenderDeck && (
        <PresentationDeck onLogout={handleLogout} onSectionChange={handleSectionChange} />
      )}

      {!isUnlocked && (
        <div className="gate-overlay">
          <GateScreen isUnlocking={isUnlocking} onUnlocked={handleUnlock} />
        </div>
      )}
    </div>
  )
}

export default App
