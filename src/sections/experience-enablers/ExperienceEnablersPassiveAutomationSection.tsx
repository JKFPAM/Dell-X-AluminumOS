import { useEffect, useRef, useState } from 'react'
import ExperienceEnablersSequencedMedia, {
  type ExperienceEnablersSequencedClip,
} from './ExperienceEnablersSequencedMedia'
import './ExperienceEnablersDeviceConnectivitySection.css'

const ACTIVE_VISIBILITY_THRESHOLD = 0.55

const PASSIVE_AUTOMATION_CLIPS: ExperienceEnablersSequencedClip[] = [
  {
    caption: 'Press the Google button on your Dell XPS keyboard to summon Gemini. Use voice or text to prompt.',
    id: 'passive-automation-01',
    label: '01',
    videoSrc: '/assets/experience-enablers-reencoded/Scene04_1.mp4',
  },
  {
    caption:
      'Ask from one device, execute on another. Gemini works in the background and lets you know when it is ready on any connected device.',
    id: 'passive-automation-02',
    label: '02',
    videoSrc: '/assets/experience-enablers-reencoded/Scene04_2.mp4',
  },
]

function ExperienceEnablersPassiveAutomationSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [hasEntered, setHasEntered] = useState(false)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const node = sectionRef.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (!entry) {
          return
        }

        if (entry.isIntersecting && entry.intersectionRatio >= 0.28) {
          setHasEntered(true)
        }

        const nextIsActive = entry.isIntersecting && entry.intersectionRatio >= ACTIVE_VISIBILITY_THRESHOLD
        setIsActive(nextIsActive)
      },
      {
        threshold: [0, 0.28, ACTIVE_VISIBILITY_THRESHOLD, 0.75],
      },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return (
    <section className="experience-enabler-connectivity experience-enabler-passive-automation" data-node-id="experience-enablers-04">
      <div
        className={`experience-enabler-connectivity-content ${hasEntered ? 'is-in-view' : ''} ${isActive ? 'is-active' : ''}`}
        ref={sectionRef}
      >
        <div className="experience-enabler-connectivity-layout">
          <div className="experience-enabler-connectivity-sub">
            <p>4/5</p>
            <p>Passive Mode Automation</p>
          </div>

          <h2 className="experience-enabler-connectivity-headline">
            Focus on what matters to you.
            <br />
            Let Gemini handle the rest.
          </h2>

          <ExperienceEnablersSequencedMedia
            className="experience-enabler-connectivity-sequencer"
            clips={PASSIVE_AUTOMATION_CLIPS}
            isActive={isActive}
            isInView={hasEntered}
          />
        </div>
      </div>
    </section>
  )
}

export default ExperienceEnablersPassiveAutomationSection
