import { useEffect, useRef, useState } from 'react'
import './ProjectContextIntelligencePoweredSection.css'

function ProjectContextIntelligencePoweredSection() {
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
    <section className="project-context-intelligence-powered" data-node-id="6151:16807">
      <div
        className={`project-context-intelligence-powered-content ${isInView ? 'is-in-view' : ''}`}
        ref={contentRef}
      >
        <div className="project-context-intelligence-powered-main">
          <p className="project-context-intelligence-powered-row">
            <span>powered by</span>
            <span className="project-context-intelligence-powered-pill" data-name="Dell Pill" data-node-id="6151:16809">
              <img alt="Dell" src="/assets/dell-logo.svg" />
            </span>
          </p>
        </div>
        <p className="project-context-intelligence-powered-footer">And that can unfold in many ways…</p>
      </div>
    </section>
  )
}

export default ProjectContextIntelligencePoweredSection
