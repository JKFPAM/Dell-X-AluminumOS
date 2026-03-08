import { useEffect, useRef, useState } from 'react'
import NarrativePersistentOverlay from './components/NarrativePersistentOverlay'
import { presentationSectionConfigs } from '../../sections'

const forwardKeys = new Set(['ArrowDown', 'ArrowRight'])
const backwardKeys = new Set(['ArrowUp', 'ArrowLeft'])
const logoutHoldDurationMs = 2500
const chapterLabelSwapDurationMs = 420
const ROMAN_STEPS = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'] as const

const formatHashValue = (value: number) => `#${String(value).padStart(2, '0')}`

const getHashGroupForIndex = (index: number) => presentationSectionConfigs[index]?.hashGroup ?? index + 1

const getSectionFiveIndices = () =>
  presentationSectionConfigs.reduce<number[]>((indices, config, index) => {
    if ((config.hashGroup ?? index + 1) === 5) {
      indices.push(index)
    }

    return indices
  }, [])

const getSectionHash = (index: number) => {
  const hashGroup = getHashGroupForIndex(index)

  if (hashGroup !== 5) {
    return formatHashValue(hashGroup)
  }

  const sectionFiveIndices = getSectionFiveIndices()
  const sectionFiveStepIndex = sectionFiveIndices.indexOf(index)

  if (sectionFiveStepIndex < 0) {
    return formatHashValue(hashGroup)
  }

  const romanStep = ROMAN_STEPS[sectionFiveStepIndex] ?? String(sectionFiveStepIndex + 1)
  return `${formatHashValue(hashGroup)}-${romanStep}`
}

const getIndexForHashGroup = (hashGroup: number, sectionCount: number) => {
  for (let index = 0; index < sectionCount; index += 1) {
    const configHashGroup = presentationSectionConfigs[index]?.hashGroup ?? index + 1

    if (configHashGroup === hashGroup) {
      return index
    }
  }

  return null
}

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
  onSectionChange?: (index: number, totalSections: number) => void
  onLogout?: () => void
}

function PresentationDeck({ onSectionChange, onLogout }: PresentationDeckProps) {
  const appRef = useRef<HTMLElement | null>(null)
  const scrollPreviewRef = useRef<HTMLDivElement | null>(null)
  const logoutHoldRef = useRef<HTMLDivElement | null>(null)
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([])
  const loopCloneRef = useRef<HTMLDivElement | null>(null)
  const isLoopTransitionActiveRef = useRef(false)
  const logoutHoldStartRef = useRef<number | null>(null)
  const logoutHoldRafRef = useRef(0)
  const isLogoutHoldActiveRef = useRef(false)
  const hasTriggeredLogoutRef = useRef(false)
  const [isLogoutHoldVisible, setIsLogoutHoldVisible] = useState(false)
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [isActiveSectionSettled, setIsActiveSectionSettled] = useState(false)
  const [hoveredChapterLabel, setHoveredChapterLabel] = useState<string | null>(null)
  const chapterLabelSwapTimeoutRef = useRef(0)
  const activeChapterLabel = presentationSectionConfigs[activeSectionIndex]?.chapterLabel ?? ''
  const visibleChapterLabel = hoveredChapterLabel || activeChapterLabel
  const [displayChapterLabel, setDisplayChapterLabel] = useState(visibleChapterLabel)
  const [incomingChapterLabel, setIncomingChapterLabel] = useState<string | null>(null)

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

    const getSections = () => sectionRefs.current.filter(Boolean) as HTMLDivElement[]

    const parseSectionHash = (hashValue: string) => {
      const match = hashValue.trim().toLowerCase().match(/^#?(\d{1,2})(?:-([ivxlcdm]+))?$/)

      if (!match) {
        return null
      }

      const number = Number(match[1])
      const subStep = match[2]

      if (!Number.isInteger(number) || number < 1) {
        return null
      }

      if (number === 5 && subStep) {
        const sectionFiveIndices = getSectionFiveIndices()
        const subStepIndex = ROMAN_STEPS.findIndex((step) => step === subStep)

        if (subStepIndex >= 0) {
          return sectionFiveIndices[subStepIndex] ?? sectionFiveIndices[0] ?? null
        }
      }

      return getIndexForHashGroup(number, getSections().length)
    }

    const syncHashToIndex = (index: number) => {
      const nextHash = getSectionHash(index)

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

    const moveSection = (direction: 1 | -1) => {
      const sections = getSections()

      if (!sections.length) {
        return
      }

      const currentIndex = getActiveSectionIndex()
      const isAtLastSection = currentIndex === sections.length - 1

      if (direction === 1 && isAtLastSection) {
        const loopCloneSection = loopCloneRef.current

        if (loopCloneSection) {
          isLoopTransitionActiveRef.current = true
          loopCloneSection.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start',
          })
          return
        }
      }

      isLoopTransitionActiveRef.current = false

      const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction))

      if (nextIndex === currentIndex) {
        return
      }

      scrollToSection(nextIndex, prefersReducedMotion ? 'auto' : 'smooth')
    }

    const notifySectionChange = (index: number) => {
      const sectionCount = getSections().length
      onSectionChange?.(index, sectionCount)
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
      const loopCloneSection = loopCloneRef.current

      if (
        isLoopTransitionActiveRef.current &&
        loopCloneSection &&
        Math.abs(container.scrollTop - loopCloneSection.offsetTop) <= 2
      ) {
        isLoopTransitionActiveRef.current = false
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

        return
      }

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
      const targetIndex = parseSectionHash(window.location.hash)

      if (targetIndex === null) {
        return
      }

      scrollToSection(targetIndex, prefersReducedMotion ? 'auto' : 'smooth')
    }

    const initializeSectionHash = () => {
      const targetIndex = parseSectionHash(window.location.hash)

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
    initRaf = window.requestAnimationFrame(initializeSectionHash)

    return () => {
      stopLogoutHold()
      isLoopTransitionActiveRef.current = false
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
    }
  }, [onLogout, onSectionChange])

  return (
    <main className="presentation-app" ref={appRef}>
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
        {presentationSectionConfigs[0]?.Component && (
          <div
            aria-hidden="true"
            className="presentation-section is-parallax-disabled presentation-section--loop-clone"
            ref={loopCloneRef}
          >
            <div className="presentation-section-content">
              <LoopCloneSection />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function LoopCloneSection() {
  const FirstSectionComponent = presentationSectionConfigs[0]?.Component

  if (!FirstSectionComponent) {
    return null
  }

  return <FirstSectionComponent />
}

export default PresentationDeck
