import { useEffect, useRef, useState } from 'react'
import './ProjectContextAudienceSection.css'

function ProjectContextAudienceSection() {
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
    <section className="project-context-audience" data-node-id="4156:1769">
      <div className={`project-context-audience-content ${isInView ? 'is-in-view' : ''}`} ref={contentRef}>
        <p className="project-context-audience-headline" data-node-id="4156:1775">
          For the entrepreneurs,
          <br />
          the independents,
          <br />
          the side-project obsessives.
        </p>

        <div className="project-context-audience-cards" data-node-id="4156:2360">
          <article className="project-context-audience-card project-context-audience-card--one" data-node-id="4156:2357">
            <img alt="" className="project-context-audience-card-image" src="/assets/01-day-night.jpg" />
            <div className="project-context-audience-card-caption" data-node-id="4156:2358">
              <p data-node-id="4156:2359">Those running homes by day and careers by night.</p>
            </div>
          </article>

          <article className="project-context-audience-card project-context-audience-card--two" data-node-id="4156:2354">
            <img alt="" className="project-context-audience-card-image" src="/assets/02-reinventing.jpg" />
            <div className="project-context-audience-card-caption" data-node-id="4156:2372">
              <p data-node-id="4156:2373">
                Those reinventing themselves from wherever they can get wi-fi.
              </p>
            </div>
          </article>

          <article className="project-context-audience-card project-context-audience-card--three" data-node-id="4156:1814">
            <img alt="" className="project-context-audience-card-image" src="/assets/03-safejobs.jpg" />
            <div className="project-context-audience-card-caption" data-node-id="4156:1823">
              <p data-node-id="4156:1818">Those who quit safe jobs to start something of their own.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default ProjectContextAudienceSection
