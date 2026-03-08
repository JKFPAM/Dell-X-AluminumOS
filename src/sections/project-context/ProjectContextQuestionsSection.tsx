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
        <p className="project-context-question-row project-context-question-row--line-01" data-node-id="3285:8683">
          With Google launching a
          <span className="project-context-pill project-context-pill--gemini" data-node-id="3285:8685">
            <img alt="Gemini" src="/assets/Gemini.svg" />
          </span>
          desktop...
        </p>

        <p className="project-context-question-row project-context-question-row--line-02" data-node-id="3285:8688">
          What kind of experience does
          <br />
          <span className="project-context-pill project-context-pill--brand" data-node-id="3285:8690">
            <img alt="Dell" src="/assets/Dell-pill.svg" />
          </span>
          want to build with AluminumOS?
        </p>

        <p className="project-context-question-row project-context-question-row--line-03" data-node-id="3285:8696">
          Why is Dell uniquely equipped to be the
          <br />
          best hardware partner for
          <span className="project-context-pill project-context-pill--brand" data-node-id="3285:8698">
            <img alt="Google" src="/assets/Google-pill.svg" />
          </span>
          ?
        </p>
      </div>
    </section>
  )
}

export default ProjectContextQuestionsSection
