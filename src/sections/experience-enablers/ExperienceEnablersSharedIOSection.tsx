import { useEffect, useRef, useState } from 'react'
import './ExperienceEnablersDeviceConnectivitySection.css'
import './ExperienceEnablersSharedIOSection.css'

const ACTIVE_VISIBILITY_THRESHOLD = 0.55

type SharedIOClip = {
  caption: string
  id: string
  videoSrc: string
}

const SHARED_IO_CLIPS: SharedIOClip[] = [
  {
    caption: 'On a crowded Google Meet, it\'s hard to detect voices, and clarity suffers.',
    id: 'shared-io-01',
    videoSrc: '/assets/experience-enablers-reencoded/Scene03_1.mp4',
  },
  {
    caption:
      'Activate Dynamic Mic and connect every active mic in the room into a single unified audio mesh, from your Dell XPS to your colleague\'s Pixel phone.',
    id: 'shared-io-02',
    videoSrc: '/assets/experience-enablers-reencoded/Scene03_2.mp4',
  },
  {
    caption: 'Gemini still recognises individual speakers. No more echo and awkward mic juggling.',
    id: 'shared-io-03',
    videoSrc: '/assets/experience-enablers-reencoded/Scene03_3.mp4',
  },
]

function ExperienceEnablersSharedIOSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [hasEntered, setHasEntered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [readyByClipId, setReadyByClipId] = useState<Record<string, boolean>>({})

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

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (!video) {
        return
      }

      if (isActive) {
        void video.play().catch(() => undefined)
        return
      }

      video.pause()
    })
  }, [isActive])

  const setClipReady = (id: string) => {
    setReadyByClipId((prev) => {
      if (prev[id]) {
        return prev
      }

      return { ...prev, [id]: true }
    })
  }

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

          <div className="experience-enabler-sequencer experience-enabler-connectivity-sequencer experience-enabler-shared-io-row is-in-view">
            {SHARED_IO_CLIPS.map((clip, index) => (
              <article
                className={`experience-enabler-sequencer-card ${index === 0 ? 'experience-enabler-shared-io-loop-card' : ''}`}
                key={clip.id}
              >
                <div className="experience-enabler-sequencer-media">
                  <video
                    aria-hidden="true"
                    autoPlay
                    className={`experience-enabler-sequencer-video ${readyByClipId[clip.id] ? 'is-ready' : ''}`}
                    loop
                    muted
                    onCanPlay={() => setClipReady(clip.id)}
                    onError={() => setClipReady(clip.id)}
                    playsInline
                    preload="auto"
                    ref={(node) => {
                      videoRefs.current[index] = node
                    }}
                  >
                    <source src={clip.videoSrc} type="video/mp4" />
                  </video>
                  <span
                    aria-hidden="true"
                    className={`experience-enabler-sequencer-fallback ${readyByClipId[clip.id] ? 'is-hidden' : ''}`}
                  />
                </div>

                <div className="experience-enabler-sequencer-caption-item is-active">
                  <div className="experience-enabler-sequencer-caption-copy">
                    <p className="experience-enabler-sequencer-caption-text">{clip.caption}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExperienceEnablersSharedIOSection
