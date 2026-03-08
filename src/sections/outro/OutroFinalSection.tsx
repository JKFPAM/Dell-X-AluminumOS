import { useState } from 'react'
import PartnerLockup from '../../components/PartnerLockup'
import './OutroFinalSection.css'

const OUTRO_TAGLINE = 'Defining a future vision for AluminumOS on Dell'
const OUTRO_HEADLINE = 'And we’re just getting started.'
const OUTRO_CREDIT = 'Dell Technologies, Experience Design Group – March 2026'

function OutroFinalSection() {
  const [isBackgroundReady, setIsBackgroundReady] = useState(false)

  return (
    <section className="outro-final-section" data-node-id="5972:18255">
      <video
        aria-hidden="true"
        autoPlay
        className={`outro-final-video ${isBackgroundReady ? 'is-visible' : ''}`}
        loop
        muted
        onCanPlay={() => setIsBackgroundReady(true)}
        onError={() => setIsBackgroundReady(false)}
        playsInline
        preload="auto"
      >
        <source src="/assets/section-one/videos/gemini-animation.mp4" type="video/mp4" />
      </video>

      <div className={`outro-final-fallback ${isBackgroundReady ? 'is-hidden' : ''}`} />
      <div aria-hidden="true" className="outro-final-vignette" />

      <div className="outro-final-content" data-node-id="5972:18256">
        <p className="outro-final-tagline" data-node-id="5982:19866">
          {OUTRO_TAGLINE}
        </p>

        <h2 className="outro-final-headline" data-node-id="5972:18258">
          {OUTRO_HEADLINE}
        </h2>

        <PartnerLockup className="outro-final-lockup" nodeId="5982:19870" />

        <p className="outro-final-credit" data-node-id="5972:18259">
          {OUTRO_CREDIT}
        </p>
      </div>
    </section>
  )
}

export default OutroFinalSection
