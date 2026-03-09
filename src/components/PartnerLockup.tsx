import { useEffect, useRef, useState } from 'react'
import './PartnerLockup.css'

type PartnerLockupProps = {
  className?: string
  nodeId?: string
  showPartnership?: boolean
}

function PartnerLockup({ className, nodeId, showPartnership = false }: PartnerLockupProps) {
  const lockupRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!showPartnership) {
      return
    }

    const node = lockupRef.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setIsInView(Boolean(entry?.isIntersecting))
      },
      { threshold: 0.6 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [showPartnership])

  const classes = [
    'partner-lockup',
    showPartnership ? 'is-partnership' : '',
    showPartnership && isInView ? 'is-in-view' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} data-node-id={nodeId} ref={lockupRef}>
      <img
        alt="Dell Technologies"
        className="partner-master-brand"
        decoding="async"
        loading="eager"
        src="/assets/dell-technologies.svg"
      />

      {showPartnership && (
        <>
          <img
            alt=""
            aria-hidden="true"
            className="partner-multiplication"
            decoding="async"
            loading="eager"
            src="/assets/multiplication.svg"
          />
          <img
            alt="Google"
            className="partner-google-wordmark"
            decoding="async"
            loading="eager"
            src="/assets/Google.svg"
          />
        </>
      )}
    </div>
  )
}

export default PartnerLockup
