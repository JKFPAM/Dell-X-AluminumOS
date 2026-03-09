import { useEffect, useRef, useState, type CSSProperties } from 'react'
import './OutroSection.css'

const OUTRO_LINES = [
  { label: 'phone', icon: '/assets/section-five/ecosystem-icon-phone-ecosystem-icon.svg' },
  { label: 'car', icon: '/assets/section-five/ecosystem-icon-car-ecosystem-icon.svg' },
  { label: 'laptop', icon: '/assets/section-five/ecosystem-icon-laptop-ecosystem-icon.svg' },
  { label: 'room', icon: '/assets/section-five/ecosystem-icon-lamps-ecosystem-icon.svg' },
]

function OutroSection() {
  const [isInView, setIsInView] = useState(false)
  const [lineStepIndex, setLineStepIndex] = useState(0)
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
      { threshold: 0.18 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [isInView])

  useEffect(() => {
    if (!isInView) {
      return
    }

    const stepOneTimeout = window.setTimeout(() => setLineStepIndex(1), 900)
    const stepTwoTimeout = window.setTimeout(() => setLineStepIndex(2), 1800)
    const stepThreeTimeout = window.setTimeout(() => setLineStepIndex(3), 2700)

    return () => {
      window.clearTimeout(stepOneTimeout)
      window.clearTimeout(stepTwoTimeout)
      window.clearTimeout(stepThreeTimeout)
    }
  }, [isInView])

  return (
    <section className="outro-section" data-node-id="outro-section">
      <div className={`outro-content ${isInView ? 'is-in-view' : ''}`} ref={contentRef}>
        <div className="outro-hero" role="presentation">
          <p className="outro-prefix">Your</p>

          <div
            className="outro-lines"
            style={{ '--outro-line-index': lineStepIndex } as CSSProperties}
          >
            {OUTRO_LINES.map((line) => (
              <p className="outro-line" key={line.label}>
                <span>{line.label}</span>
                <span aria-hidden="true" className="outro-line-icon">
                  <img alt="" src={line.icon} />
                </span>
              </p>
            ))}
          </div>
        </div>

        <p className="outro-closing">They are all part of your lifespace.</p>
      </div>
    </section>
  )
}

export default OutroSection
