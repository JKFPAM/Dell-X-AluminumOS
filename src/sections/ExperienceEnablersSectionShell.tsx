import type { ReactNode } from 'react'
import './ExperienceEnablersSharedSections.css'

type ExperienceEnablersSectionShellProps = {
  className?: string
  children?: ReactNode
  nodeId: string
  stepLabel: string
  title: string
  headline: string
}

function ExperienceEnablersSectionShell({
  className,
  children,
  nodeId,
  stepLabel,
  title,
  headline,
}: ExperienceEnablersSectionShellProps) {
  return (
    <section className={`experience-enabler-shared-section ${className ?? ''}`.trim()} data-node-id={nodeId}>
      <div className="experience-enabler-shared-content">
        <div className="experience-enabler-shared-sub">
          <p>{stepLabel}</p>
          <p>{title}</p>
        </div>
        <h2 className="experience-enabler-shared-headline">{headline}</h2>
        {children}
      </div>
    </section>
  )
}

export default ExperienceEnablersSectionShell
