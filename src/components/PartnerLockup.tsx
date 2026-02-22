import { useState } from 'react'
import DellLogo from './DellLogo'
import './PartnerLockup.css'

type PartnerLockupProps = {
  className?: string
  nodeId?: string
}

function PartnerLockup({ className, nodeId }: PartnerLockupProps) {
  const [isSparkVideoReady, setIsSparkVideoReady] = useState(false)
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  const isSafari =
    /safari/i.test(userAgent) &&
    !/chrome|chromium|android|crios|fxios|edgios|opr\//i.test(userAgent)

  const classes = ['partner-lockup', className].filter(Boolean).join(' ')

  return (
    <div className={classes} data-node-id={nodeId}>
      <DellLogo className="partner-dell-logo" />
      <span aria-hidden="true" className="partner-spark">
        <video
          autoPlay
          className={`partner-spark-video ${isSparkVideoReady ? 'is-visible' : ''}`}
          loop
          muted
          onCanPlay={() => setIsSparkVideoReady(true)}
          onError={() => setIsSparkVideoReady(false)}
          playsInline
          preload="auto"
        >
          {isSafari && <source src="/videos/gem-loop-alpha.mov" type="video/quicktime" />}
          <source src="/videos/gem-loop-alpha.webm" type="video/webm" />
          <source src="/videos/gem-loop-alpha.mp4" type="video/mp4" />
        </video>
        <span className={`partner-spark-fallback ${isSparkVideoReady ? 'is-hidden' : ''}`} />
      </span>
      <img
        alt="Google"
        className="partner-google-wordmark"
        decoding="async"
        loading="eager"
        src="/assets/section-two/google-wordmark.svg"
      />
    </div>
  )
}

export default PartnerLockup
