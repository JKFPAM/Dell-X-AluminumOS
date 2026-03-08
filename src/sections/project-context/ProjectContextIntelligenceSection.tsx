import { useEffect, useRef, useState } from 'react'
import './ProjectContextIntelligenceSection.css'

function ProjectContextIntelligenceSection() {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const node = contentRef.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setIsInView(Boolean(entry?.isIntersecting))
      },
      { threshold: 0.55 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return (
    <section className="project-context-intelligence" data-node-id="section-13-intelligence">
      <div className={`project-context-intelligence-content ${isInView ? 'is-in-view' : ''}`} ref={contentRef}>
        <div className="project-context-intelligence-main">
          <p>What you get is intelligence</p>
          <p>that feels premium, reliable, and powerful.</p>
          <p>powered by Dell</p>
        </div>

        <p className="project-context-intelligence-kicker">And that can unfold in many ways…</p>
      </div>
    </section>
  )
}

export default ProjectContextIntelligenceSection
