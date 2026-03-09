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
    <section className="project-context-intelligence" data-node-id="6151:16792">
      <div className={`project-context-intelligence-content ${isInView ? 'is-in-view' : ''}`} ref={contentRef}>
        <div className="project-context-intelligence-main">
          <p className="project-context-intelligence-detail">that feels premium, reliable, and powerful.</p>
        </div>
      </div>
    </section>
  )
}

export default ProjectContextIntelligenceSection
