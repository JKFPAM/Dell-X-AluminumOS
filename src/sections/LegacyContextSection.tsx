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
          For the last twenty years, the winners in
          <br />
          technology were the ones who...
        </p>

        <div className="legacy-row" data-node-id="2735:5605">
          <p className="legacy-copy" data-node-id="2735:5646">
            <span>made the </span>
            <span className="legacy-orb legacy-orb-iphone" data-node-id="2735:5608">
              <img
                alt=""
                aria-hidden="true"
                className="legacy-iphone-image"
                src="/assets/section-two/iphone-image.png"
              />
            </span>
            <span>devices most people wanted,</span>
          </p>
        </div>

        <div className="legacy-row" data-node-id="2735:5656">
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
            <span>most people used,</span>
          </p>
        </div>

        <div className="legacy-row legacy-row-google" data-node-id="2735:5618">
          <p className="legacy-copy" data-node-id="2735:5650">
            <span>and delivered the services</span>
            <span className="legacy-orb legacy-orb-google" data-node-id="2735:5651">
              <img
                alt=""
                aria-hidden="true"
                className="legacy-google-image"
                src="/assets/section-two/G-icon.svg"
              />
            </span>
            <span>most people needed.</span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default LegacyContextSection
