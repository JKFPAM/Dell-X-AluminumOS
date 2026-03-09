import { useEffect, useRef, useState } from 'react'
import ExperienceEnablersSequencedMedia, {
  type ExperienceEnablersSequencedClip,
} from './ExperienceEnablersSequencedMedia'
import './ExperienceEnablersDeviceConnectivitySection.css'

const ACTIVE_VISIBILITY_THRESHOLD = 0.55

const CONTEXTUAL_SWITCHING_CLIPS: ExperienceEnablersSequencedClip[] = [
  {
    caption:
      'When you dock your Dell XPS at home, your Dell peripherals automatically wake. Your system automatically switches to Home Mode.',
    id: 'contextual-switching-01',
    label: '01',
    videoSrc: '/assets/experience-enablers/Scene05_1.mp4',
  },
  {
    caption: 'With Chromecast built into Dell XPS, your Android TV becomes an extended display for your laptop.',
    id: 'contextual-switching-02',
    label: '02',
    videoSrc: '/assets/experience-enablers/Scene05_2.mp4',
  },
]

function ExperienceEnablersContextualSwitchingSection() {
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
    <section className="experience-enabler-connectivity experience-enabler-contextual-switching" data-node-id="experience-enablers-05">
      <div
        className={`experience-enabler-connectivity-content ${hasEntered ? 'is-in-view' : ''} ${isActive ? 'is-active' : ''}`}
        ref={sectionRef}
      >
        <div className="experience-enabler-connectivity-layout">
          <div className="experience-enabler-connectivity-sub">
            <p>5/5</p>
            <p>Contextual Mode Switching</p>
          </div>

          <h2 className="experience-enabler-connectivity-headline">
            Work is work, though.
            <br />
            And it doesn’t follow you home if you don’t want it to.
          </h2>

          <ExperienceEnablersSequencedMedia
            className="experience-enabler-connectivity-sequencer"
            clips={CONTEXTUAL_SWITCHING_CLIPS}
            isActive={isActive}
            isInView={hasEntered}
          />
        </div>
      </div>
    </section>
  )
}

export default ExperienceEnablersContextualSwitchingSection
