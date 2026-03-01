import { useEffect, useRef, useState } from 'react'
import './ProjectContextCommandSection.css'

function ProjectContextCommandSection() {
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
    <section className="project-context-command" data-node-id="3435:10359">
      <div className={`project-context-command-content ${isInView ? 'is-in-view' : ''}`} ref={contentRef}>
        <p className="project-context-command-kicker" data-node-id="3435:10371">
          With AluminumOS, we can redefine what it means to own a Dell.
        </p>

        <div className="project-context-command-main" data-name="content" data-node-id="4156:1765">
          <p className="project-context-command-copy project-context-command-copy--left" data-node-id="3435:10406">
            From a place
            <br />
            where work
            <br />
            happens
          </p>

          <span aria-hidden="true" className="project-context-command-arrow" data-node-id="3435:10409" />

          <p className="project-context-command-copy project-context-command-copy--right" data-node-id="3435:10407">
            to the command
            <br />
            center for an
            <br />
            ambitious life.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ProjectContextCommandSection
