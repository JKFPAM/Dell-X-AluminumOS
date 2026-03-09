import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './ExperienceEnablersSequencedMedia.css'

export type ExperienceEnablersSequencedClip = {
  caption: string
  id: string
  label: string
  videoSrc: string
}

type SequencePhase = 'idle' | 'playing' | 'transitioning'

type ExperienceEnablersSequencedMediaProps = {
  className?: string
  clips: ExperienceEnablersSequencedClip[]
  isActive: boolean
  isInView: boolean
  loadingTimeoutMs?: number
}

const DEFAULT_LOADING_TIMEOUT_MS = 5000
const PROGRESS_RING_RADIUS = 8
const PROGRESS_RING_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RING_RADIUS

function ExperienceEnablersSequencedMedia({
  className,
  clips,
  isActive,
  isInView,
  loadingTimeoutMs = DEFAULT_LOADING_TIMEOUT_MS,
}: ExperienceEnablersSequencedMediaProps) {
  const [phase, setPhase] = useState<SequencePhase>('idle')
  const [activeClipIndex, setActiveClipIndex] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [clipReadyState, setClipReadyState] = useState<boolean[]>(() => clips.map(() => false))
  const [clipProgressState, setClipProgressState] = useState<number[]>(() => clips.map(() => 0))

  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])
  const progressAnimationFrameRef = useRef(0)
  const transitionTimeoutRef = useRef(0)
  const loadingTimeoutRef = useRef(0)
  const phaseRef = useRef<SequencePhase>('idle')
  const activeClipIndexRef = useRef(0)
  const isActiveRef = useRef(isActive)
  const directionRef = useRef<1 | -1>(1)
  const advanceFromRef = useRef<(clipIndex: number) => void>(() => undefined)

  const clipCount = clips.length
  const hasTrack = clipCount > 0

  const sequencedSlides = useMemo(() => clips, [clips])

  const clearTransitionTimers = useCallback(() => {
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current)
      transitionTimeoutRef.current = 0
    }
  }, [])

  const clearLoadingTimeout = useCallback(() => {
    if (!loadingTimeoutRef.current) {
      return
    }

    window.clearTimeout(loadingTimeoutRef.current)
    loadingTimeoutRef.current = 0
  }, [])

  const stopProgressLoop = useCallback(() => {
    if (!progressAnimationFrameRef.current) {
      return
    }

    window.cancelAnimationFrame(progressAnimationFrameRef.current)
    progressAnimationFrameRef.current = 0
  }, [])

  const pauseAllVideos = useCallback(() => {
    videoRefs.current.forEach((video) => {
      if (!video) {
        return
      }

      video.pause()
    })
  }, [])

  const resetProgress = useCallback(() => {
    setClipProgressState(clips.map(() => 0))
  }, [clips])

  const resetSequence = useCallback(() => {
    clearTransitionTimers()
    clearLoadingTimeout()
    stopProgressLoop()
    pauseAllVideos()

    videoRefs.current.forEach((video) => {
      if (!video) {
        return
      }

      try {
        video.currentTime = 0
      } catch {
        // no-op
      }
    })

    setPhase('idle')
    phaseRef.current = 'idle'
    setActiveClipIndex(0)
    activeClipIndexRef.current = 0
    directionRef.current = 1
    resetProgress()
  }, [clearLoadingTimeout, clearTransitionTimers, pauseAllVideos, resetProgress, stopProgressLoop])

  const scheduleLoadFallback = useCallback(
    (clipIndex: number) => {
      clearLoadingTimeout()
      loadingTimeoutRef.current = window.setTimeout(() => {
        if (!isActiveRef.current || activeClipIndexRef.current !== clipIndex) {
          return
        }

        const video = videoRefs.current[clipIndex]
        if (video && video.readyState >= 2) {
          return
        }

        advanceFromRef.current(clipIndex)
      }, loadingTimeoutMs)
    },
    [clearLoadingTimeout, loadingTimeoutMs],
  )

  const startProgressLoop = useCallback(
    (clipIndex: number) => {
      stopProgressLoop()

      const updateProgress = () => {
        const video = videoRefs.current[clipIndex]

        if (!video || !isActiveRef.current || activeClipIndexRef.current !== clipIndex) {
          progressAnimationFrameRef.current = 0
          return
        }

        const duration = video.duration
        if (duration > 0 && Number.isFinite(duration)) {
          const nextProgress = Math.max(0, Math.min(1, video.currentTime / duration))
          setClipProgressState((current) => {
            if (Math.abs(current[clipIndex] - nextProgress) < 0.008) {
              return current
            }

            return current.map((value, index) => (index === clipIndex ? nextProgress : value))
          })
        }

        progressAnimationFrameRef.current = window.requestAnimationFrame(updateProgress)
      }

      progressAnimationFrameRef.current = window.requestAnimationFrame(updateProgress)
    },
    [stopProgressLoop],
  )

  const playClip = useCallback(
    (clipIndex: number) => {
      if (!isActiveRef.current || clipCount === 0) {
        return
      }

      const normalizedIndex = ((clipIndex % clipCount) + clipCount) % clipCount
      const video = videoRefs.current[normalizedIndex]

      if (!video) {
        return
      }

      pauseAllVideos()
      clearLoadingTimeout()

      try {
        video.currentTime = 0
      } catch {
        // no-op
      }

      video.muted = true
      video.defaultMuted = true
      video.playsInline = true

      setPhase('playing')
      phaseRef.current = 'playing'
      setActiveClipIndex(normalizedIndex)
      activeClipIndexRef.current = normalizedIndex
      setClipProgressState((current) => current.map((value, index) => (index === normalizedIndex ? 0 : value)))

      if (video.readyState < 2) {
        scheduleLoadFallback(normalizedIndex)
      }

      const playAttempt = video.play()
      if (playAttempt && typeof playAttempt.catch === 'function') {
        playAttempt.catch(() => {
          if (!isActiveRef.current || activeClipIndexRef.current !== normalizedIndex) {
            return
          }

          scheduleLoadFallback(normalizedIndex)
        })
      }

      startProgressLoop(normalizedIndex)
    },
    [clearLoadingTimeout, clipCount, pauseAllVideos, scheduleLoadFallback, startProgressLoop],
  )

  const advanceFrom = useCallback(
    (currentIndex: number) => {
      if (!isActiveRef.current || clipCount === 0) {
        return
      }

      let nextDirection = directionRef.current
      if (clipCount > 1) {
        if (currentIndex >= clipCount - 1) {
          nextDirection = -1
        } else if (currentIndex <= 0) {
          nextDirection = 1
        }
      }
      directionRef.current = nextDirection
      const nextClipIndex =
        clipCount <= 1
          ? 0
          : Math.max(0, Math.min(clipCount - 1, currentIndex + nextDirection))

      setPhase('transitioning')
      phaseRef.current = 'transitioning'
      stopProgressLoop()
      clearLoadingTimeout()

      setClipProgressState((current) =>
        current.map((value, index) => {
          if (index === currentIndex) {
            return 0
          }

          if (index === nextClipIndex) {
            return 0
          }

          return value
        }),
      )

      setActiveClipIndex(nextClipIndex)
      activeClipIndexRef.current = nextClipIndex
      playClip(nextClipIndex)
    },
    [clearLoadingTimeout, clipCount, playClip, stopProgressLoop],
  )

  useEffect(() => {
    advanceFromRef.current = advanceFrom
  }, [advanceFrom])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const applyPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    applyPreference()
    mediaQuery.addEventListener('change', applyPreference)

    return () => {
      mediaQuery.removeEventListener('change', applyPreference)
    }
  }, [])

  useEffect(() => {
    isActiveRef.current = isActive
  }, [isActive])

  useEffect(() => {
    const syncTimeout = window.setTimeout(() => {
      setClipReadyState(clips.map(() => false))
      setClipProgressState(clips.map(() => 0))
      setActiveClipIndex(0)
      activeClipIndexRef.current = 0
      directionRef.current = 1
      setPhase('idle')
      phaseRef.current = 'idle'
    }, 0)

    return () => {
      window.clearTimeout(syncTimeout)
    }
  }, [clips])

  useEffect(() => {
    if (!hasTrack || !isActive) {
      const resetTimeout = window.setTimeout(() => {
        resetSequence()
      }, 0)

      return () => {
        window.clearTimeout(resetTimeout)
      }
    }

    const kickoffTimeout = window.setTimeout(() => {
      setActiveClipIndex(0)
      activeClipIndexRef.current = 0
      directionRef.current = 1
      resetProgress()
      setPhase('idle')
      phaseRef.current = 'idle'
      playClip(0)
    }, 0)

    return () => {
      window.clearTimeout(kickoffTimeout)
      resetSequence()
    }
  }, [hasTrack, isActive, playClip, resetProgress, resetSequence])

  useEffect(() => {
    return () => {
      resetSequence()
    }
  }, [resetSequence])

  const handleVideoReady = useCallback(
    (clipIndex: number) => {
      setClipReadyState((current) => {
        if (current[clipIndex]) {
          return current
        }

        return current.map((value, index) => (index === clipIndex ? true : value))
      })

      if (clipIndex === activeClipIndexRef.current) {
        clearLoadingTimeout()
      }
    },
    [clearLoadingTimeout],
  )

  const handleVideoError = useCallback(
    (clipIndex: number) => {
      if (!isActiveRef.current || clipIndex !== activeClipIndexRef.current) {
        return
      }

      clearLoadingTimeout()
      setClipProgressState((current) => current.map((value, index) => (index === clipIndex ? 0 : value)))

      clearTransitionTimers()
      transitionTimeoutRef.current = window.setTimeout(() => {
        if (!isActiveRef.current || clipIndex !== activeClipIndexRef.current) {
          return
        }

        advanceFrom(clipIndex)
      }, prefersReducedMotion ? 0 : 160)
    },
    [advanceFrom, clearLoadingTimeout, clearTransitionTimers, prefersReducedMotion],
  )

  const sequencerClassName = [
    'experience-enabler-sequencer',
    className,
    isInView ? 'is-in-view' : '',
    isActive ? 'is-active' : '',
    `is-${phase}`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={sequencerClassName}>
      <div className="experience-enabler-sequencer-viewport">
        <div className="experience-enabler-sequencer-track">
          {sequencedSlides.map((clip, slideIndex) => {
            const sourceClipIndex = slideIndex % clipCount
            const isReady = clipReadyState[sourceClipIndex]
            const isActiveSlide = sourceClipIndex === activeClipIndex
            const isPlayingSlide = isActiveSlide && phase === 'playing'
            const progress = clipProgressState[sourceClipIndex] ?? 0
            const dashOffset = PROGRESS_RING_CIRCUMFERENCE * (1 - progress)

            return (
              <article
                className={`experience-enabler-sequencer-card ${isPlayingSlide ? 'is-playing' : ''}`}
                key={clip.id}
              >
                <div className="experience-enabler-sequencer-media">
                  <video
                    aria-hidden="true"
                    className={`experience-enabler-sequencer-video ${isReady ? 'is-ready' : ''}`}
                    data-managed-playback="sequenced"
                    loop={false}
                    muted
                    onCanPlay={() => handleVideoReady(sourceClipIndex)}
                    onEnded={() => {
                      if (!isActiveRef.current || sourceClipIndex !== activeClipIndexRef.current) {
                        return
                      }

                      advanceFrom(sourceClipIndex)
                    }}
                    onError={() => handleVideoError(sourceClipIndex)}
                    playsInline
                    preload="auto"
                    ref={(node) => {
                      videoRefs.current[sourceClipIndex] = node
                    }}
                  >
                    <source src={clip.videoSrc} type="video/mp4" />
                  </video>
                  <span
                    aria-hidden="true"
                    className={`experience-enabler-sequencer-fallback ${isReady ? 'is-hidden' : ''}`}
                  />
                </div>

                <div className={`experience-enabler-sequencer-caption-item ${isPlayingSlide ? 'is-active' : ''}`}>
                  <span aria-hidden="true" className="experience-enabler-sequencer-indicator">
                    <svg
                      className="experience-enabler-sequencer-indicator-svg"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className="experience-enabler-sequencer-indicator-track"
                        cx="10"
                        cy="10"
                        r={String(PROGRESS_RING_RADIUS)}
                      />
                      <circle
                        className="experience-enabler-sequencer-indicator-progress"
                        cx="10"
                        cy="10"
                        r={String(PROGRESS_RING_RADIUS)}
                        style={{ strokeDasharray: PROGRESS_RING_CIRCUMFERENCE, strokeDashoffset: dashOffset }}
                      />
                    </svg>
                  </span>

                  <div className="experience-enabler-sequencer-caption-copy">
                    <p className="experience-enabler-sequencer-caption-text">{clip.caption}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ExperienceEnablersSequencedMedia
