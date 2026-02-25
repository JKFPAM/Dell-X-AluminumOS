import './NarrativeStageSection.css'
import { useEffect, useRef, useState } from 'react'

type NarrativeStageSectionProps = {
  nodeId: string
  showRingBackground?: boolean
}

function NarrativeStageSection({ nodeId, showRingBackground = false }: NarrativeStageSectionProps) {
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = sectionRef.current

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
      { threshold: 0.32 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [isInView])

  return (
    <section
      className={`narrative-stage-section ${showRingBackground ? 'has-ring-background' : ''} ${isInView ? 'is-in-view' : ''}`}
      data-node-id={nodeId}
      ref={sectionRef}
    >
      {showRingBackground && (
        <>
          <span aria-hidden="true" className="narrative-stage-ring narrative-stage-ring--1" />
          <span aria-hidden="true" className="narrative-stage-ring narrative-stage-ring--2" />
          <span aria-hidden="true" className="narrative-stage-ring narrative-stage-ring--3" />
        </>
      )}
    </section>
  )
}

export default NarrativeStageSection
