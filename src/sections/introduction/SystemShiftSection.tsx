import { useEffect, useRef, useState } from 'react'
import './SystemShiftSection.css'

const TOP_COPY =
  'The focus has shifted from product-level thinking to system-level thinking...'

const BOTTOM_COPY_LINE_ONE = '...where devices'
const BOTTOM_COPY_LINE_TWO = 'are only as good as the environments they live in.'

function SystemShiftSection() {
  const [isActive, setIsActive] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)
  const [backgroundOpacity, setBackgroundOpacity] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = contentRef.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        const isIntersecting = Boolean(entry?.isIntersecting)
        const ratio = entry?.intersectionRatio ?? 0

        setIsActive(isIntersecting)

        if (!isIntersecting) {
          setBackgroundOpacity(0)
          return
        }

        setBackgroundOpacity(Math.min(Math.max(ratio / 0.55, 0), 1) * 0.8)

        if (isIntersecting) {
          setHasEntered(true)
        }
      },
      { threshold: Array.from({ length: 56 }, (_, index) => index / 55) },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return (
    <section className="system-shift-section" data-node-id="2750:5737">
      <div
        className={`system-shift-content ${hasEntered ? 'is-in-view' : ''} ${isActive ? 'is-active' : ''}`}
        ref={contentRef}
      >
        <div
          aria-hidden="true"
          className="system-shift-bg-image"
          style={{ opacity: backgroundOpacity }}
        />

        <p className="system-shift-intro" data-node-id="2750:5741">
          {TOP_COPY}
        </p>

        <p className="system-shift-outro" data-node-id="2750:5742">
          {BOTTOM_COPY_LINE_ONE}
          <br />
          {BOTTOM_COPY_LINE_TWO}
        </p>
      </div>
    </section>
  )
}

export default SystemShiftSection
