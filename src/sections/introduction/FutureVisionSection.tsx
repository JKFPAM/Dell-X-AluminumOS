import { useEffect, useRef, useState } from 'react'
import './FutureVisionSection.css'

const HEADLINE = 'Today, the boundaries within innovation are far less siloed.'
const CORNER_MEDIA_CLASSES = [
  'future-vision-media--top-left',
  'future-vision-media--top-right',
  'future-vision-media--bottom-left',
  'future-vision-media--bottom-right',
]
const CORNER_MEDIA_SOURCES = [
  '/assets/section-three/gem-listening.mp4',
  '/assets/section-three/gem-search.mp4',
  '/assets/section-three/gem-ams.mp4',
  '/assets/section-three/gem-gems.mp4',
]

function FutureVisionSection() {
  const [isInView, setIsInView] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState<boolean[]>(() =>
    CORNER_MEDIA_CLASSES.map(() => false),
  )
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = contentRef.current

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
      { threshold: 0.28 },
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
    <section className="future-vision-section" data-node-id="2735:5668">
      <div
        className={`future-vision-content ${isInView ? 'is-in-view' : ''}`}
        data-node-id="2735:5669"
        ref={contentRef}
      >
        {CORNER_MEDIA_CLASSES.map((className, index) => (
          <div className={`future-vision-media ${className}`} key={className}>
            <video
              aria-hidden="true"
              autoPlay
              className={`future-vision-media-video ${isVideoReady[index] ? 'is-ready' : ''}`}
              loop
              muted
              onCanPlay={() => markVideoReady(index)}
              onError={() => markVideoReady(index)}
              playsInline
              preload="auto"
            >
              <source src={CORNER_MEDIA_SOURCES[index]} type="video/mp4" />
            </video>
            <span
              aria-hidden="true"
              className={`future-vision-media-fallback ${isVideoReady[index] ? 'is-hidden' : ''}`}
            />
          </div>
        ))}

        <p className="future-vision-headline" data-node-id="2735:5722">
          {HEADLINE}
        </p>
      </div>
    </section>
  )
}

export default FutureVisionSection
