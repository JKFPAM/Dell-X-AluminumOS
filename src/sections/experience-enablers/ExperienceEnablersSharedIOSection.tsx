import { useEffect, useRef, useState } from 'react'
import ExperienceEnablersSequencedMedia, {
  type ExperienceEnablersSequencedClip,
} from './ExperienceEnablersSequencedMedia'
import './ExperienceEnablersDeviceConnectivitySection.css'
import './ExperienceEnablersSharedIOSection.css'

const ACTIVE_VISIBILITY_THRESHOLD = 0.55

const SHARED_IO_SEQUENCED_CLIPS: ExperienceEnablersSequencedClip[] = [
  {
    caption:
      'Activate Dynamic Mic and merge every active mic in the room into a single unified audio mesh, from your Dell XPS to your colleague\'s Pixel phone.',
    id: 'shared-io-02',
    label: '02',
    videoSrc: '/assets/experience-enablers/Scene03_2.mp4',
  },
  {
    caption: 'Gemini still recognises individual speakers. No more echo and awkward mic juggling.',
    id: 'shared-io-03',
    label: '03',
    videoSrc: '/assets/experience-enablers/Scene03_3.mp4',
  },
]

function ExperienceEnablersSharedIOSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [hasEntered, setHasEntered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [isLoopCardReady, setIsLoopCardReady] = useState(false)

  useEffect(() => {
    const node = sectionRef.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (!entry) {
          return
        }

        if (entry.isIntersecting && entry.intersectionRatio >= 0.28) {
          setHasEntered(true)
        }

        const nextIsActive = entry.isIntersecting && entry.intersectionRatio >= ACTIVE_VISIBILITY_THRESHOLD
        setIsActive(nextIsActive)
      },
      {
        threshold: [0, 0.28, ACTIVE_VISIBILITY_THRESHOLD, 0.75],
      },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return (
    <section className="experience-enabler-connectivity experience-enabler-shared-io-section" data-node-id="experience-enablers-03">
      <div
        className={`experience-enabler-connectivity-content ${hasEntered ? 'is-in-view' : ''} ${isActive ? 'is-active' : ''}`}
        ref={sectionRef}
      >
        <div className="experience-enabler-connectivity-layout">
          <div className="experience-enabler-connectivity-sub">
            <p>3/5</p>
            <p>Shared I/O</p>
          </div>

          <h2 className="experience-enabler-connectivity-headline">
            Your meeting is not a room with four walls.
            <br />
            It’s an active participant in the conversation.
          </h2>

          <div className="experience-enabler-connectivity-sequencer experience-enabler-shared-io-row">
            <article className="experience-enabler-sequencer-card experience-enabler-shared-io-loop-card">
              <div className="experience-enabler-sequencer-media">
                <video
                  aria-hidden="true"
                  autoPlay
                  className={`experience-enabler-sequencer-video ${isLoopCardReady ? 'is-ready' : ''}`}
                  loop
                  muted
                  onCanPlay={() => setIsLoopCardReady(true)}
                  onError={() => setIsLoopCardReady(true)}
                  playsInline
                  preload="auto"
                >
                  <source src="/assets/experience-enablers/Scene03_1.mp4" type="video/mp4" />
                </video>
                <span
                  aria-hidden="true"
                  className={`experience-enabler-sequencer-fallback ${isLoopCardReady ? 'is-hidden' : ''}`}
                />
              </div>

              <div className="experience-enabler-sequencer-caption-item is-active">
                <div className="experience-enabler-sequencer-caption-copy">
                  <p className="experience-enabler-sequencer-caption-text">
                    On a crowded Google Meet, it&apos;s hard to detect voices, and clarity suffers.
                  </p>
                </div>
              </div>
            </article>

            <ExperienceEnablersSequencedMedia
              className="experience-enabler-shared-io-sequencer"
              clips={SHARED_IO_SEQUENCED_CLIPS}
              isActive={isActive}
              isInView={hasEntered}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExperienceEnablersSharedIOSection
