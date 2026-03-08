import { useEffect, useRef, useState } from 'react'
import ExperienceEnablersSectionShell from './ExperienceEnablersSectionShell'

function ExperienceEnablersSharedIOMedia() {
  const [isInView, setIsInView] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState<boolean[]>([false, false, false])
  const mediaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = mediaRef.current

    if (!node || isInView) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (!entry?.isIntersecting) {
          return
        }

        setIsInView(true)
        observer.disconnect()
      },
      { threshold: 0.3 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [isInView])

  const markVideoReady = (index: number) => {
    setIsVideoReady((current) => {
      if (current[index]) {
        return current
      }

      const next = [...current]
      next[index] = true
      return next
    })
  }

  return (
    <div className={`experience-enabler-shared-io-media ${isInView ? 'is-in-view' : ''}`} ref={mediaRef}>
      <article className="experience-enabler-shared-io-scene experience-enabler-shared-io-scene--top">
        <div className="experience-enabler-shared-io-scene-media">
          <video
            aria-hidden="true"
            autoPlay
            className={`experience-enabler-shared-io-video ${isVideoReady[1] ? 'is-ready' : ''}`}
            loop
            muted
            onCanPlay={() => markVideoReady(1)}
            onError={() => markVideoReady(1)}
            playsInline
            preload="auto"
          >
            <source src="/assets/experience-enablers/Scene03_2.mp4" type="video/mp4" />
          </video>
          <span
            aria-hidden="true"
            className={`experience-enabler-shared-io-fallback ${isVideoReady[1] ? 'is-hidden' : ''}`}
          />
        </div>
        <div className="experience-enabler-shared-io-copy">
          <p>02—</p>
          <p>
            Activate Dynamic Mic and merge every active mic in the room into a single unified audio mesh,
            from your Dell XPS to your colleague&apos;s Pixel phone.
          </p>
        </div>
      </article>

      <div className="experience-enabler-shared-io-bottom-row">
        <article className="experience-enabler-shared-io-scene experience-enabler-shared-io-scene--bottom-left">
          <div className="experience-enabler-shared-io-scene-media">
            <video
              aria-hidden="true"
              autoPlay
              className={`experience-enabler-shared-io-video ${isVideoReady[0] ? 'is-ready' : ''}`}
              loop
              muted
              onCanPlay={() => markVideoReady(0)}
              onError={() => markVideoReady(0)}
              playsInline
              preload="auto"
            >
              <source src="/assets/experience-enablers/Scene03_1.mp4" type="video/mp4" />
            </video>
            <span
              aria-hidden="true"
              className={`experience-enabler-shared-io-fallback ${isVideoReady[0] ? 'is-hidden' : ''}`}
            />
          </div>
          <div className="experience-enabler-shared-io-copy">
            <p>01—</p>
            <p>On a crowded Google Meet, it&apos;s hard to detect voices, and clarity suffers.</p>
          </div>
        </article>

        <article className="experience-enabler-shared-io-scene experience-enabler-shared-io-scene--bottom-right">
          <div className="experience-enabler-shared-io-scene-media">
            <video
              aria-hidden="true"
              autoPlay
              className={`experience-enabler-shared-io-video ${isVideoReady[2] ? 'is-ready' : ''}`}
              loop
              muted
              onCanPlay={() => markVideoReady(2)}
              onError={() => markVideoReady(2)}
              playsInline
              preload="auto"
            >
              <source src="/assets/experience-enablers/Scene03_3.mp4" type="video/mp4" />
            </video>
            <span
              aria-hidden="true"
              className={`experience-enabler-shared-io-fallback ${isVideoReady[2] ? 'is-hidden' : ''}`}
            />
          </div>
          <div className="experience-enabler-shared-io-copy">
            <p>03—</p>
            <p>Gemini still recognises individual speakers. No more echo and awkward mic juggling.</p>
          </div>
        </article>
      </div>
    </div>
  )
}

function ExperienceEnablersSharedIOSection() {
  return (
    <ExperienceEnablersSectionShell
      className="experience-enabler-shared-section--shared-io"
      headline={
        'Your meeting is not\na room with four walls.\nIt’s an active participant in the conversation.'
      }
      nodeId="experience-enablers-03"
      stepLabel="03/05"
      title="SHARED I/O"
    >
      <ExperienceEnablersSharedIOMedia />
    </ExperienceEnablersSectionShell>
  )
}

export default ExperienceEnablersSharedIOSection
