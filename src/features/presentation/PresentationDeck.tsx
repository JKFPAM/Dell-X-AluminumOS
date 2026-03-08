import { useEffect, useRef, useState } from 'react'
import NarrativePersistentOverlay from './components/NarrativePersistentOverlay'
import { getSectionHash, parseSectionHash } from './hashNavigation'
import { PRESENTATION_ADVANCE_REQUEST_EVENT } from './navigationEvents'
import type { PresentationSectionId } from '@/content/presentationStructure'
import { presentationSectionConfigs } from '@/sections'

const forwardKeys = new Set(['ArrowDown', 'ArrowRight'])
const backwardKeys = new Set(['ArrowUp', 'ArrowLeft'])
const logoutHoldDurationMs = 2500
const chapterLabelSwapDurationMs = 420
const finalSectionLoopHoldMs = 320
const finalSectionLoopFadeMs = 900
const finalSectionLoopRevealMs = 320

type ChapterSegment = {
  key: string
  label: string
  startIndex: number
  endIndex: number
  sectionCount: number
}

const chapterSegments = presentationSectionConfigs.reduce<ChapterSegment[]>((segments, config, index) => {
  const label = config.chapterLabel?.trim() || `Section ${index + 1}`
  const previousSegment = segments[segments.length - 1]

  if (previousSegment && previousSegment.label === label) {
    previousSegment.endIndex = index
    previousSegment.sectionCount += 1
    return segments
  }

  segments.push({
    key: `${label}-${index}`,
    label,
    startIndex: index,
    endIndex: index,
    sectionCount: 1,
  })

  return segments
}, [])

const chapterBoundaryPercents = (() => {
  let cumulative = 0

  return chapterSegments.flatMap((segment, index) => {
    cumulative += segment.sectionCount

    if (index >= chapterSegments.length - 1) {
      return []
    }

    return [(cumulative / presentationSectionConfigs.length) * 100]
  })
})()

type PresentationDeckProps = {
  onSectionChange?: (
    sectionNumber: number,
    totalSections: number,
    sectionId: PresentationSectionId,
  ) => void
  onLogout?: () => void
}

const totalPresentationSections = presentationSectionConfigs.reduce((max, config, index) => {
  const hashGroup = config.hashGroup ?? index + 1
  return Math.max(max, hashGroup)
}, 0)

function PresentationDeck({ onSectionChange, onLogout }: PresentationDeckProps) {
  const appRef = useRef<HTMLElement | null>(null)
  const scrollPreviewRef = useRef<HTMLDivElement | null>(null)
  const logoutHoldRef = useRef<HTMLDivElement | null>(null)
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([])
  const logoutHoldStartRef = useRef<number | null>(null)
  const logoutHoldRafRef = useRef(0)
  const isLogoutHoldActiveRef = useRef(false)
  const hasTriggeredLogoutRef = useRef(false)
  const isLoopFadeVisibleRef = useRef(false)
  const [isLogoutHoldVisible, setIsLogoutHoldVisible] = useState(false)
  const [isLoopFadeVisible, setIsLoopFadeVisible] = useState(false)
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [isActiveSectionSettled, setIsActiveSectionSettled] = useState(false)
  const [hoveredChapterLabel, setHoveredChapterLabel] = useState<string | null>(null)
  const chapterLabelSwapTimeoutRef = useRef(0)
  const activeChapterLabel = presentationSectionConfigs[activeSectionIndex]?.chapterLabel ?? ''
  const visibleChapterLabel = hoveredChapterLabel || activeChapterLabel
  const [displayChapterLabel, setDisplayChapterLabel] = useState(visibleChapterLabel)
  const [incomingChapterLabel, setIncomingChapterLabel] = useState<string | null>(null)
  const setLoopFadeVisibility = (visible: boolean) => {
    if (isLoopFadeVisibleRef.current === visible) {
      return
    }

    isLoopFadeVisibleRef.current = visible
    setIsLoopFadeVisible(visible)
  }

  useEffect(() => {
    if (!visibleChapterLabel || visibleChapterLabel === displayChapterLabel) {
      return
    }

    if (chapterLabelSwapTimeoutRef.current) {
      window.clearTimeout(chapterLabelSwapTimeoutRef.current)
    }

    const incomingLabelRaf = window.requestAnimationFrame(() => {
      setIncomingChapterLabel(visibleChapterLabel)
    })

    chapterLabelSwapTimeoutRef.current = window.setTimeout(() => {
      setDisplayChapterLabel(visibleChapterLabel)
      setIncomingChapterLabel(null)
      chapterLabelSwapTimeoutRef.current = 0
    }, chapterLabelSwapDurationMs + 20)

    return () => {
      window.cancelAnimationFrame(incomingLabelRaf)
    }
  }, [displayChapterLabel, visibleChapterLabel])

  useEffect(() => {
    return () => {
      if (!chapterLabelSwapTimeoutRef.current) {
        return
      }

      window.clearTimeout(chapterLabelSwapTimeoutRef.current)
      chapterLabelSwapTimeoutRef.current = 0
    }
  }, [])

  const jumpToSection = (index: number) => {
    const targetSection = sectionRefs.current[index]

    if (!targetSection) {
      return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    targetSection.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  useEffect(() => {
    const container = appRef.current

    if (!container) {
      return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let scrollRaf = 0
    let initRaf = 0
    let loopResetRaf = 0
    let activeSectionIndex = -1
    let isScrollPreviewVisible = false
    let hasInitializedHash = false
    let finalSectionLoopHoldTimeout = 0
    let finalSectionLoopFadeTimeout = 0
    let finalSectionLoopRevealTimeout = 0
    let hasQueuedFinalSectionLoop = false
    const finalSectionIndex = presentationSectionConfigs.length - 1

    const getSections = () => sectionRefs.current.filter(Boolean) as HTMLDivElement[]

    const syncHashToIndex = (index: number) => {
      const nextHash = getSectionHash(index, presentationSectionConfigs)

      if (window.location.hash === nextHash) {
        return
      }

      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}${nextHash}`,
      )
    }

    const getActiveSectionIndex = () => {
      const sections = getSections()

      if (!sections.length) {
        return 0
      }

      const scrollTop = container.scrollTop
      let bestIndex = 0
      let bestDistance = Number.POSITIVE_INFINITY

      sections.forEach((section, index) => {
        const distance = Math.abs(section.offsetTop - scrollTop)

        if (distance < bestDistance) {
          bestDistance = distance
          bestIndex = index
        }
      })

      return bestIndex
    }

    const scrollToSection = (index: number, behavior: ScrollBehavior) => {
      const sections = getSections()

      if (!sections.length || index < 0 || index >= sections.length) {
        return
      }

      sections[index].scrollIntoView({
        behavior,
        block: 'start',
      })
    }

    const jumpToFirstSectionInstant = () => {
      container.style.setProperty('scroll-behavior', 'auto')
      container.style.setProperty('scroll-snap-type', 'none')
      container.scrollTop = 0

      if (loopResetRaf) {
        window.cancelAnimationFrame(loopResetRaf)
      }

      loopResetRaf = window.requestAnimationFrame(() => {
        loopResetRaf = 0
        container.style.removeProperty('scroll-behavior')
        container.style.removeProperty('scroll-snap-type')
      })
    }

    const clearFinalSectionLoopTimers = () => {
      hasQueuedFinalSectionLoop = false

      if (finalSectionLoopHoldTimeout) {
        window.clearTimeout(finalSectionLoopHoldTimeout)
        finalSectionLoopHoldTimeout = 0
      }

      if (finalSectionLoopFadeTimeout) {
        window.clearTimeout(finalSectionLoopFadeTimeout)
        finalSectionLoopFadeTimeout = 0
      }

      if (finalSectionLoopRevealTimeout) {
        window.clearTimeout(finalSectionLoopRevealTimeout)
        finalSectionLoopRevealTimeout = 0
      }
    }

    const queueFinalSectionLoop = () => {
      if (hasQueuedFinalSectionLoop) {
        return
      }

      hasQueuedFinalSectionLoop = true
      finalSectionLoopHoldTimeout = window.setTimeout(() => {
        setLoopFadeVisibility(true)

        finalSectionLoopFadeTimeout = window.setTimeout(() => {
          jumpToFirstSectionInstant()
          container.style.setProperty('--scroll-progress', '0')
          setScrollPreviewVisibility(false)
          setIsActiveSectionSettled(true)
          setHoveredChapterLabel(null)

          if (activeSectionIndex !== 0) {
            activeSectionIndex = 0
            setActiveSectionIndex(0)

            if (hasInitializedHash) {
              syncHashToIndex(0)
            }

            notifySectionChange(0)
          }

          finalSectionLoopRevealTimeout = window.setTimeout(() => {
            setLoopFadeVisibility(false)
          }, finalSectionLoopRevealMs)
        }, prefersReducedMotion ? 0 : finalSectionLoopFadeMs)
      }, prefersReducedMotion ? 0 : finalSectionLoopHoldMs)
    }

    const isAtFinalSection = () => {
      const sections = getSections()

      if (!sections.length) {
        return false
      }

      return getActiveSectionIndex() === finalSectionIndex
    }

    const moveSection = (direction: 1 | -1) => {
      const sections = getSections()

      if (!sections.length) {
        return
      }

      const currentIndex = getActiveSectionIndex()
      const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction))

      if (nextIndex === currentIndex) {
        if (direction === 1 && currentIndex === finalSectionIndex) {
          queueFinalSectionLoop()
        }
        return
      }

      scrollToSection(nextIndex, prefersReducedMotion ? 'auto' : 'smooth')
    }

    const notifySectionChange = (index: number) => {
      const sectionNumber = presentationSectionConfigs[index]?.hashGroup ?? index + 1
      const sectionId = presentationSectionConfigs[index]?.sectionId

      if (!sectionId) {
        return
      }

      onSectionChange?.(sectionNumber, totalPresentationSections, sectionId)
    }

    const setLogoutProgress = (progress: number) => {
      logoutHoldRef.current?.style.setProperty('--logout-hold-progress', progress.toFixed(4))
    }

    const stopLogoutHold = () => {
      isLogoutHoldActiveRef.current = false
      logoutHoldStartRef.current = null

      if (logoutHoldRafRef.current) {
        window.cancelAnimationFrame(logoutHoldRafRef.current)
        logoutHoldRafRef.current = 0
      }

      setLogoutProgress(0)
      setIsLogoutHoldVisible(false)
    }

    const tickLogoutHold = (now: number) => {
      if (!isLogoutHoldActiveRef.current || logoutHoldStartRef.current === null) {
        return
      }

      const elapsed = now - logoutHoldStartRef.current
      const progress = Math.min(1, elapsed / logoutHoldDurationMs)

      setLogoutProgress(progress)

      if (progress >= 1 && !hasTriggeredLogoutRef.current) {
        hasTriggeredLogoutRef.current = true
        stopLogoutHold()
        onLogout?.()
        return
      }

      logoutHoldRafRef.current = window.requestAnimationFrame(tickLogoutHold)
    }

    const startLogoutHold = () => {
      if (isLogoutHoldActiveRef.current) {
        return
      }

      hasTriggeredLogoutRef.current = false
      isLogoutHoldActiveRef.current = true
      logoutHoldStartRef.current = performance.now()
      setLogoutProgress(0)
      setIsLogoutHoldVisible(true)
      logoutHoldRafRef.current = window.requestAnimationFrame(tickLogoutHold)
    }

    const setScrollPreviewVisibility = (visible: boolean) => {
      if (visible === isScrollPreviewVisible) {
        return
      }

      isScrollPreviewVisible = visible
      scrollPreviewRef.current?.classList.toggle('is-visible', visible)
    }

    const updateSectionMotion = () => {
      const viewportHeight = container.clientHeight || 1
      const viewportCenter = viewportHeight * 0.5
      const sections = getSections()

      const lastRealSection = sections[sections.length - 1] ?? null
      const maxScroll = lastRealSection?.offsetTop ?? container.scrollHeight - container.clientHeight
      const scrollProgress = maxScroll > 0 ? Math.min(1, container.scrollTop / maxScroll) : 0
      const currentIndex = getActiveSectionIndex()
      const currentSection = sections[currentIndex] ?? null
      const settleTolerancePx = 8
      const isSettled = currentSection
        ? Math.abs(container.scrollTop - currentSection.offsetTop) <= settleTolerancePx
        : false
      const shouldShowScrollPreview = currentIndex > 0

      container.style.setProperty('--scroll-progress', scrollProgress.toFixed(4))
      setScrollPreviewVisibility(shouldShowScrollPreview)
      setIsActiveSectionSettled(isSettled)

      if (!isLoopFadeVisibleRef.current) {
        clearFinalSectionLoopTimers()
      }

      sectionRefs.current.forEach((section, index) => {
        if (!section) {
          return
        }

        const rect = section.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const sectionCenter = rect.top - containerRect.top + rect.height * 0.5
        const offset = (sectionCenter - viewportCenter) / viewportHeight
        const isParallaxDisabled = Boolean(presentationSectionConfigs[index]?.disableParallax)
        const parallaxY = prefersReducedMotion || isParallaxDisabled ? 0 : -offset * 16

        section.style.setProperty('--section-parallax-y', `${parallaxY.toFixed(2)}px`)
      })

      if (currentIndex !== activeSectionIndex) {
        activeSectionIndex = currentIndex
        setActiveSectionIndex(currentIndex)

        if (hasInitializedHash) {
          syncHashToIndex(currentIndex)
        }

        notifySectionChange(currentIndex)
      }
    }

    const scheduleSectionMotion = () => {
      if (scrollRaf) {
        return
      }

      scrollRaf = window.requestAnimationFrame(() => {
        scrollRaf = 0
        updateSectionMotion()
      })
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
        return
      }

      const target = event.target as HTMLElement | null
      const tagName = target?.tagName ?? ''
      const isEditing =
        target?.isContentEditable ||
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        tagName === 'SELECT'

      if (isEditing) {
        return
      }

      if (event.key.toLowerCase() === 'q') {
        if (!event.repeat) {
          startLogoutHold()
        }
        return
      }

      if (forwardKeys.has(event.key)) {
        event.preventDefault()
        moveSection(1)
        return
      }

      if (backwardKeys.has(event.key)) {
        event.preventDefault()
        moveSection(-1)
      }
    }

    const handleKeyup = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'q') {
        return
      }

      stopLogoutHold()
    }

    const handleWindowBlur = () => {
      stopLogoutHold()
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        return
      }

      stopLogoutHold()
    }

    const handleHashChange = () => {
      const targetIndex = parseSectionHash(
        window.location.hash,
        getSections().length,
        presentationSectionConfigs,
      )

      if (targetIndex === null) {
        return
      }

      scrollToSection(targetIndex, prefersReducedMotion ? 'auto' : 'smooth')
    }

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY <= 0) {
        return
      }

      if (isAtFinalSection()) {
        queueFinalSectionLoop()
      }
    }

    const handleAdvanceRequest = () => {
      moveSection(1)
    }

    const initializeSectionHash = () => {
      const targetIndex = parseSectionHash(
        window.location.hash,
        getSections().length,
        presentationSectionConfigs,
      )

      if (targetIndex !== null) {
        scrollToSection(targetIndex, 'auto')
        activeSectionIndex = targetIndex
      } else {
        activeSectionIndex = getActiveSectionIndex()
        syncHashToIndex(activeSectionIndex)
      }

      hasInitializedHash = true
      const initialSection = getSections()[activeSectionIndex] ?? null
      setActiveSectionIndex(activeSectionIndex)
      setIsActiveSectionSettled(
        initialSection ? Math.abs(container.scrollTop - initialSection.offsetTop) <= 8 : false,
      )
      setScrollPreviewVisibility(activeSectionIndex > 0)
      notifySectionChange(activeSectionIndex)
      scheduleSectionMotion()
    }

    container.addEventListener('scroll', scheduleSectionMotion, { passive: true })
    window.addEventListener('resize', scheduleSectionMotion)
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('keyup', handleKeyup)
    window.addEventListener('blur', handleWindowBlur)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('hashchange', handleHashChange)
    window.addEventListener(PRESENTATION_ADVANCE_REQUEST_EVENT, handleAdvanceRequest)
    container.addEventListener('wheel', handleWheel, { passive: true })
    initRaf = window.requestAnimationFrame(initializeSectionHash)

    return () => {
      stopLogoutHold()
      clearFinalSectionLoopTimers()
      setLoopFadeVisibility(false)
      if (scrollRaf) {
        window.cancelAnimationFrame(scrollRaf)
      }
      if (initRaf) {
        window.cancelAnimationFrame(initRaf)
      }
      if (loopResetRaf) {
        window.cancelAnimationFrame(loopResetRaf)
      }
      container.style.removeProperty('scroll-behavior')
      container.style.removeProperty('scroll-snap-type')
      container.removeEventListener('scroll', scheduleSectionMotion)
      window.removeEventListener('resize', scheduleSectionMotion)
      window.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('keyup', handleKeyup)
      window.removeEventListener('blur', handleWindowBlur)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener(PRESENTATION_ADVANCE_REQUEST_EVENT, handleAdvanceRequest)
      container.removeEventListener('wheel', handleWheel)
    }
  }, [onLogout, onSectionChange])

  return (
    <main className="presentation-app" ref={appRef}>
      <div aria-hidden="true" className={`presentation-loop-fade ${isLoopFadeVisible ? 'is-visible' : ''}`} />
      <div
        aria-hidden="true"
        className={`logout-hold-indicator ${isLogoutHoldVisible ? 'is-visible' : ''}`}
        ref={logoutHoldRef}
      >
        <span className="logout-hold-fill" />
        <span className="logout-hold-label">Hold Q to log out</span>
      </div>
      <nav aria-label="Presentation chapter navigation" className="scroll-preview" ref={scrollPreviewRef}>
        {displayChapterLabel && (
          <span aria-live="polite" className="scroll-preview-chapter">
            <span className={`scroll-preview-chapter-text ${incomingChapterLabel ? 'is-out' : ''}`}>
              {displayChapterLabel}
            </span>
            {incomingChapterLabel && (
              <span className="scroll-preview-chapter-text is-in">{incomingChapterLabel}</span>
            )}
          </span>
        )}
        <div className="scroll-preview-track">
          <span className="scroll-preview-fill" />
          <div aria-hidden="true" className="scroll-preview-dividers">
            {chapterBoundaryPercents.map((percent) => (
              <span className="scroll-preview-divider" key={`scroll-preview-divider-${percent}`} style={{ left: `${percent}%` }} />
            ))}
          </div>
          <div className="scroll-preview-segments">
            {chapterSegments.map((segment) => {
              const isActive =
                activeSectionIndex >= segment.startIndex && activeSectionIndex <= segment.endIndex

              return (
                <button
                  aria-label={`Jump to ${segment.label}`}
                  className={`scroll-preview-segment ${isActive ? 'is-active' : ''}`}
                  key={segment.key}
                  onBlur={() => setHoveredChapterLabel(null)}
                  onClick={() => jumpToSection(segment.startIndex)}
                  onFocus={() => setHoveredChapterLabel(segment.label)}
                  onMouseEnter={() => setHoveredChapterLabel(segment.label)}
                  onMouseLeave={() => setHoveredChapterLabel(null)}
                  style={{ flexGrow: segment.sectionCount }}
                  type="button"
                >
                  <span aria-hidden="true" className="scroll-preview-segment-hit" />
                </button>
              )
            })}
          </div>
        </div>
      </nav>
      <NarrativePersistentOverlay
        activeSectionIndex={activeSectionIndex}
        isActiveSectionSettled={isActiveSectionSettled}
      />
      <div className="presentation-track">
        {presentationSectionConfigs.map(({ Component, disableParallax }, index) => (
          <div
            className={`presentation-section ${disableParallax ? 'is-parallax-disabled' : ''}`}
            key={`presentation-section-${index}`}
            ref={(node) => {
              sectionRefs.current[index] = node
            }}
          >
            <div className="presentation-section-content">
              <Component />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default PresentationDeck
