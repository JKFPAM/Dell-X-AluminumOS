import { useEffect, useRef, useState } from 'react'
import './ProjectContextLensSection.css'

function ProjectContextLensSection() {
  const [isInView, setIsInView] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = contentRef.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (entry?.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.55 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return (
    <section className="project-context-lens" data-node-id="3285:10099">
      <div className={`project-context-lens-content ${isInView ? 'is-in-view' : ''}`} ref={contentRef}>
        <div aria-hidden="true" className="project-context-lens-background">
          <span className="project-context-lens-shape project-context-lens-shape--top" />
          <span className="project-context-lens-shape project-context-lens-shape--left" />
          <span className="project-context-lens-shape project-context-lens-shape--right" />
        </div>

        <p className="project-context-lens-kicker" data-node-id="3285:10148">
          It&apos;s the best of all worlds.
        </p>

        <div className="project-context-lens-copy project-context-lens-copy--left" data-node-id="3285:10193">
          <p>Google&apos;s intelligence</p>
          <span>AI and cloud services</span>
        </div>

        <div className="project-context-lens-copy project-context-lens-copy--right" data-node-id="3285:10205">
          <p>Android&apos;s breadth</p>
          <span>expansive, customizable platform</span>
        </div>

        <div className="project-context-lens-copy project-context-lens-copy--bottom" data-node-id="3285:10210">
          <p>Dell&apos;s Hardware</p>
          <span>premium consumer foundation</span>
        </div>

        <div aria-hidden="true" className="project-context-lens-pills">
          <span className="project-context-pill-item project-context-pill-item--gemini">
            <img alt="" src="/assets/Gemini.svg" />
          </span>

          <span className="project-context-pill-item project-context-pill-item--material">
            <img alt="" src="/assets/Material-pill.svg" />
          </span>

          <span className="project-context-pill-item project-context-pill-item--google-cloud">
            <img alt="" src="/assets/GoogleCloud-pill.svg" />
          </span>

          <span className="project-context-pill-item project-context-pill-item--android">
            <img alt="" src="/assets/android-pill.svg" />
          </span>

          <span className="project-context-pill-item project-context-pill-item--dell">
            <img alt="" src="/assets/Dell-pill.svg" />
          </span>

          <span className="project-context-pill-item project-context-pill-item--xps">
            <img alt="" src="/assets/xps-pill.svg" />
          </span>
        </div>
      </div>
    </section>
  )
}

export default ProjectContextLensSection
