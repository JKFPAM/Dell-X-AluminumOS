import { useEffect, useRef, useState } from 'react'
import './ProjectContextVisionSection.css'

function ProjectContextVisionSection() {
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
    <section className="project-context-vision" data-node-id="3435:10324">
      <div className={`project-context-vision-content ${isInView ? 'is-in-view' : ''}`} ref={contentRef}>
        <div className="project-context-vision-light-band" data-node-id="3435:10345" />
        <div className="project-context-vision-seam-glow" data-node-id="3435:10313" />

        <p className="project-context-vision-kicker" data-node-id="3435:10322">
          The Vision
        </p>

        <div className="project-context-vision-card" data-name="content" data-node-id="3435:10314">
          <p className="project-context-vision-headline" data-node-id="3435:10315">
            Position
            <span className="project-context-vision-pill" data-name="Dell Pill" data-node-id="3435:10316">
              <img alt="Dell" src="/assets/dell-logo.svg" />
            </span>
            as the premium
            <br />
            foundation behind the ultimate
            <br />
            AluminiumOS experience.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ProjectContextVisionSection
