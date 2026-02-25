import { useEffect, useRef, useState } from 'react'
import './SystemShiftSection.css'

const TOP_COPY =
  'Today, the focus is shifting from product-level thinking to system-level thinking...'

const BOTTOM_COPY_LINE_ONE = '...where devices'
const BOTTOM_COPY_LINE_TWO = 'are only as good as the environments they live in.'

function SystemShiftSection() {
  const [isActive, setIsActive] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)
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

        setIsActive(isIntersecting)

        if (isIntersecting) {
          setHasEntered(true)
        }
      },
      { threshold: 0.55 },
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
