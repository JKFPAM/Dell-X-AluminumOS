import { useEffect, useRef, useState } from 'react'
import './ProjectContextQuestionsSection.css'

function ProjectContextQuestionsSection() {
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
    <section className="project-context-questions" data-node-id="3285:8702">
      <div className={`project-context-questions-content ${isInView ? 'is-in-view' : ''}`} ref={contentRef}>
        <p className="project-context-question-kicker" data-node-id="6288:13489">
          With Google launching a desktop operating system...
        </p>

        <div className="project-context-question-block" data-node-id="6288:13498">
          <p className="project-context-question-row project-context-question-row--line-01" data-node-id="6288:13475">
            Why is
            <span className="project-context-pill project-context-pill--dell" data-node-id="6288:13483">
              <img alt="Dell" src="/assets/dell-logo.svg" />
            </span>
            uniquely equipped to be
            <br />
            the best hardware partner for Google?
          </p>
        </div>

        <div className="project-context-question-block" data-node-id="6288:13499">
          <p className="project-context-question-row project-context-question-row--line-02" data-node-id="6288:13477">
            What kind of experience does
            <br />
            Dell want to build with
            <span className="project-context-pill project-context-pill--alos" data-node-id="6288:13491">
              <span className="project-context-pill-label">AluminumOS</span>
            </span>
            ?
          </p>
        </div>
      </div>
    </section>
  )
}

export default ProjectContextQuestionsSection
