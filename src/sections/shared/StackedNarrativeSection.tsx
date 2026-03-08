import { useEffect, useRef, useState, type CSSProperties } from 'react'
import './StackedNarrativeSection.css'

type StackedLine = {
  nodeId: string
  text: string
  row: number
}

type StackedNarrativeSectionProps = {
  pinnedLines?: StackedLine[]
  movingLine?: StackedLine
  focusLine: StackedLine
  revealOnSettle?: boolean
  sectionNodeId: string
}

function StackedNarrativeSection({
  pinnedLines = [],
  movingLine,
  focusLine,
  revealOnSettle = false,
  sectionNodeId,
}: StackedNarrativeSectionProps) {
  const [isActive, setIsActive] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)
  const [isSettled, setIsSettled] = useState(false)
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

        if (isIntersecting && !revealOnSettle) {
          setHasEntered(true)
        }
      },
      { threshold: 0.55 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [revealOnSettle])

  useEffect(() => {
    if (!revealOnSettle) {
      return
    }

    const node = contentRef.current

    if (!node) {
      return
    }

    const container = node.closest('.presentation-app') as HTMLElement | null

    if (!container) {
      return
    }

    const settleTolerancePx = 8
    let rafId = 0

    const updateSettleState = () => {
      const rect = node.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      const delta = rect.top - containerRect.top
      const settled = Math.abs(delta) <= settleTolerancePx

      setIsSettled(settled)

      if (settled) {
        setHasEntered(true)
      }
    }

    const scheduleUpdate = () => {
      if (rafId) {
        return
      }

      rafId = window.requestAnimationFrame(() => {
        rafId = 0
        updateSettleState()
      })
    }

    updateSettleState()
    container.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId)
      }
      container.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [revealOnSettle])

  return (
    <section className="stacked-narrative-section" data-node-id={sectionNodeId}>
      <div
        className={`stacked-narrative-content ${hasEntered ? 'is-in-view' : ''} ${isActive ? 'is-active' : ''} ${isSettled ? 'is-settled' : ''}`}
        ref={contentRef}
      >
        {pinnedLines.map((line) => (
          <p
            className="stacked-narrative-line stacked-narrative-line--pinned"
            data-node-id={line.nodeId}
            key={line.nodeId}
            style={{ ['--stack-line-index' as string]: line.row } as CSSProperties}
          >
            {line.text}
          </p>
        ))}

        {movingLine && (
          <p
            className="stacked-narrative-line stacked-narrative-line--moving"
            data-node-id={movingLine.nodeId}
            style={{ ['--stack-line-index' as string]: movingLine.row } as CSSProperties}
          >
            {movingLine.text}
          </p>
        )}

        <p
          className="stacked-narrative-line stacked-narrative-line--focus"
          data-node-id={focusLine.nodeId}
          style={{ ['--stack-focus-delay' as string]: movingLine ? '360ms' : '160ms' } as CSSProperties}
        >
          {focusLine.text}
        </p>
      </div>
    </section>
  )
}

export default StackedNarrativeSection
