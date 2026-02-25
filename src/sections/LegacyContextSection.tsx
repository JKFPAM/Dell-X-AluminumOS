import { useEffect, useRef, useState } from 'react'
import './LegacyContextSection.css'

function LegacyContextSection() {
  const [isAndroidVideoReady, setIsAndroidVideoReady] = useState(false)
  const [isContentInView, setIsContentInView] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = contentRef.current

    if (!node || isContentInView) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (!entry?.isIntersecting) {
          return
        }

        setIsContentInView(true)
        observer.disconnect()
      },
      { threshold: 0.28 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [isContentInView])

  return (
    <section className="legacy-section" data-node-id="2701:5572">
      <div
        className={`legacy-content ${isContentInView ? 'is-in-view' : ''}`}
        data-node-id="2735:5657"
        ref={contentRef}
      >
        <p className="legacy-intro" data-node-id="2735:5604">
          For the last two decades,
        </p>

        <div className="legacy-row" data-node-id="2735:5605">
          <img
            alt=""
            aria-hidden="true"
            className="legacy-badge legacy-badge-apple"
            src="/assets/section-two/apple-logo-container.svg"
          />
          <p className="legacy-copy" data-node-id="2735:5646">
            <span>made the iPhone</span>
            <span className="legacy-orb legacy-orb-iphone" data-node-id="2735:5608">
              <img
                alt=""
                aria-hidden="true"
                className="legacy-iphone-image"
                src="/assets/section-two/iphone-image.png"
              />
            </span>
            <span>most people wanted.</span>
          </p>
        </div>

        <div className="legacy-row" data-node-id="2735:5656">
          <img
            alt=""
            aria-hidden="true"
            className="legacy-badge legacy-badge-android"
            src="/assets/section-two/android-wordmark.svg"
          />
          <p className="legacy-copy" data-node-id="2735:5654">
            <span>built the platform</span>
            <span className="legacy-orb legacy-orb-android" data-node-id="2735:5615">
              <video
                aria-hidden="true"
                autoPlay
                className={`legacy-android-video ${isAndroidVideoReady ? 'is-visible' : ''}`}
                loop
                muted
                onCanPlay={() => setIsAndroidVideoReady(true)}
                onError={() => setIsAndroidVideoReady(false)}
                playsInline
                preload="auto"
              >
                <source src="/assets/section-two/videos/android.mp4" type="video/mp4" />
              </video>
              <span className={`legacy-android-mark ${isAndroidVideoReady ? 'is-hidden' : ''}`} />
            </span>
            <span>most people used.</span>
          </p>
        </div>

        <div className="legacy-row legacy-row-google" data-node-id="2735:5618">
          <span aria-hidden="true" className="legacy-google-pill" data-node-id="2735:5653">
            <span aria-hidden="true" className="legacy-google-wordmark" />
          </span>
          <p className="legacy-copy" data-node-id="2735:5650">
            <span>offered the services most people needed.</span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default LegacyContextSection
