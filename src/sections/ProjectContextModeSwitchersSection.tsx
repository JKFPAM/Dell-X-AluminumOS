import { useEffect, useRef, useState } from 'react'
import './ProjectContextModeSwitchersSection.css'

function ProjectContextModeSwitchersSection() {
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
    <section className="project-context-mode-switchers" data-node-id="4156:3461">
      <div className={`project-context-mode-switchers-content ${isInView ? 'is-in-view' : ''}`} ref={contentRef}>
        <p className="project-context-mode-switchers-kicker" data-node-id="4156:3721">
          They&apos;re mode-switchers:
        </p>

        <div className="project-context-mode-switchers-rows" data-node-id="4156:3750">
          <div className="project-context-mode-switchers-row project-context-mode-switchers-row--mail" data-node-id="4156:3745">
            <p data-node-id="4156:3741">closing deals on</p>
            <span className="project-context-mode-pill" data-node-id="4156:3602">
              <img alt="" src="/assets/Mail-Icon.svg" />
            </span>
          </div>

          <div className="project-context-mode-switchers-row project-context-mode-switchers-row--messages" data-node-id="4156:3746">
            <p data-node-id="4156:3742">making plans in</p>
            <span className="project-context-mode-pill" data-node-id="4156:3617">
              <img alt="" src="/assets/Messages-icon.svg" />
            </span>
          </div>

          <div className="project-context-mode-switchers-row project-context-mode-switchers-row--assistant" data-node-id="4156:3748">
            <p data-node-id="4156:3744">and restocking the fridge with</p>
            <span className="project-context-mode-pill" data-node-id="4156:3749">
              <img alt="" src="/assets/Assistant-icon.svg" />
            </span>
          </div>

          <div className="project-context-mode-switchers-row project-context-mode-switchers-row--sheets" data-node-id="4156:3747">
            <p data-node-id="4156:3743">tracking their budgets with</p>
            <span className="project-context-mode-pill" data-node-id="4156:3630">
              <img alt="" src="/assets/Sheets-icon.svg" />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectContextModeSwitchersSection
