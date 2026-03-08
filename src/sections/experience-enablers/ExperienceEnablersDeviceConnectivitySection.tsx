import { useEffect, useRef, useState } from 'react'
import './ExperienceEnablersDeviceConnectivitySection.css'

const VIDEO_SOURCES = [
  '/assets/experience-enablers/Scene01_1.mp4',
  '/assets/experience-enablers/Scene01_2.mp4',
]

function ExperienceEnablersDeviceConnectivitySection() {
  const [isInView, setIsInView] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState<boolean[]>([false, false])
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
      { threshold: 0.38 },
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
    <section className="experience-enabler-connectivity" data-node-id="5764:13794">
      <div
        className={`experience-enabler-connectivity-content ${isInView ? 'is-in-view' : ''}`}
        ref={contentRef}
      >
        <div className="experience-enabler-connectivity-layout">
          <div className="experience-enabler-connectivity-left">
            <div className="experience-enabler-connectivity-sub" data-name="sub" data-node-id="5764:13796">
              <p data-node-id="5764:13797">01/05</p>
              <p data-node-id="5764:13798">DEVICE CONNECTIVITY</p>
            </div>

            <h2 className="experience-enabler-connectivity-headline" data-node-id="5764:13795">
              Your laptop is no longer
              <br />
              an isolated machine.
              <br />
              It&apos;s one point in a much
              <br />
              larger ecosystem.
            </h2>
          </div>

          <div className="experience-enabler-connectivity-right">
            <div className="experience-enabler-scene-stack">
              <article className="experience-enabler-scene experience-enabler-scene--one" data-node-id="5764:13799">
                <div className="experience-enabler-scene-media" data-node-id="5764:13800">
                  <video
                    aria-hidden="true"
                    autoPlay
                    className={`experience-enabler-scene-video ${isVideoReady[0] ? 'is-ready' : ''}`}
                    loop
                    muted
                    onCanPlay={() => markVideoReady(0)}
                    onError={() => markVideoReady(0)}
                    playsInline
                    preload="auto"
                  >
                    <source src={VIDEO_SOURCES[0]} type="video/mp4" />
                  </video>
                  <span
                    aria-hidden="true"
                    className={`experience-enabler-scene-fallback ${isVideoReady[0] ? 'is-hidden' : ''}`}
                  />
                </div>
                <div className="experience-enabler-scene-copy experience-enabler-scene-copy--one" data-node-id="5764:13801">
                  <p data-node-id="5764:13802">01—</p>
                  <p data-node-id="5764:13803">
                    Seamlessly connect your new Dell XPS to your Google ecosystem.
                  </p>
                </div>
              </article>

              <article className="experience-enabler-scene experience-enabler-scene--two" data-node-id="5764:13804">
                <div className="experience-enabler-scene-media" data-node-id="5764:13805">
                  <video
                    aria-hidden="true"
                    autoPlay
                    className={`experience-enabler-scene-video ${isVideoReady[1] ? 'is-ready' : ''}`}
                    loop
                    muted
                    onCanPlay={() => markVideoReady(1)}
                    onError={() => markVideoReady(1)}
                    playsInline
                    preload="auto"
                  >
                    <source src={VIDEO_SOURCES[1]} type="video/mp4" />
                  </video>
                  <span
                    aria-hidden="true"
                    className={`experience-enabler-scene-fallback ${isVideoReady[1] ? 'is-hidden' : ''}`}
                  />
                </div>
                <div className="experience-enabler-scene-copy experience-enabler-scene-copy--two" data-node-id="5764:13806">
                  <p data-node-id="5764:13807">02—</p>
                  <p data-node-id="5764:13808">
                    Once connected, your XPS is part of the entire ecosystem: apps, I/O, and every other
                    Google enabled device.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExperienceEnablersDeviceConnectivitySection
