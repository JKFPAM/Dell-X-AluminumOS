import { useEffect, useRef, useState } from 'react'
import './ExperienceEnablersSharedSections.css'

type ExperienceEnablersSharedMediaProps = {
  sceneOneCopy: string
  sceneOneVideo: string
  sceneTwoCopy: string
  sceneTwoVideo: string
}

function ExperienceEnablersSharedMedia({
  sceneOneCopy,
  sceneOneVideo,
  sceneTwoCopy,
  sceneTwoVideo,
}: ExperienceEnablersSharedMediaProps) {
  const [isInView, setIsInView] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState<boolean[]>([false, false])
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
    <div className={`experience-enabler-shared-media ${isInView ? 'is-in-view' : ''}`} ref={mediaRef}>
      <article className="experience-enabler-shared-scene experience-enabler-shared-scene--one">
        <div className="experience-enabler-shared-scene-media">
          <video
            aria-hidden="true"
            autoPlay
            className={`experience-enabler-shared-video ${isVideoReady[0] ? 'is-ready' : ''}`}
            loop
            muted
            onCanPlay={() => markVideoReady(0)}
            onError={() => markVideoReady(0)}
            playsInline
            preload="auto"
          >
            <source src={sceneOneVideo} type="video/mp4" />
          </video>
          <span
            aria-hidden="true"
            className={`experience-enabler-shared-fallback ${isVideoReady[0] ? 'is-hidden' : ''}`}
          />
        </div>
        <div className="experience-enabler-shared-copy">
          <p>01—</p>
          <p>{sceneOneCopy}</p>
        </div>
      </article>

      <article className="experience-enabler-shared-scene experience-enabler-shared-scene--two">
        <div className="experience-enabler-shared-scene-media">
          <video
            aria-hidden="true"
            autoPlay
            className={`experience-enabler-shared-video ${isVideoReady[1] ? 'is-ready' : ''}`}
            loop
            muted
            onCanPlay={() => markVideoReady(1)}
            onError={() => markVideoReady(1)}
            playsInline
            preload="auto"
          >
            <source src={sceneTwoVideo} type="video/mp4" />
          </video>
          <span
            aria-hidden="true"
            className={`experience-enabler-shared-fallback ${isVideoReady[1] ? 'is-hidden' : ''}`}
          />
        </div>
        <div className="experience-enabler-shared-copy">
          <p>02—</p>
          <p>{sceneTwoCopy}</p>
        </div>
      </article>
    </div>
  )
}

export default ExperienceEnablersSharedMedia
