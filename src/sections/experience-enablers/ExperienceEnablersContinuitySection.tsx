import { useEffect, useRef, useState } from 'react'
import ExperienceEnablersSequencedMedia, {
  type ExperienceEnablersSequencedClip,
} from './ExperienceEnablersSequencedMedia'
import './ExperienceEnablersDeviceConnectivitySection.css'

const ACTIVE_VISIBILITY_THRESHOLD = 0.55

const CONTINUITY_CLIPS: ExperienceEnablersSequencedClip[] = [
  {
    caption: 'Your flow of work travels with you, whether you’re at home or riding a Waymo.',
    id: 'continuity-01',
    label: '01',
    videoSrc: '/assets/experience-enablers-reencoded/Scene02_1.mp4',
  },
  {
    caption:
      'Platforms built on Google automatically recognize your activity and leverage the ecosystem to assist you.',
    id: 'continuity-02',
    label: '02',
    videoSrc: '/assets/experience-enablers-reencoded/Scene02_2.mp4',
  },
]

function ExperienceEnablersContinuitySection() {
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
    <section className="experience-enabler-connectivity experience-enabler-continuity" data-node-id="experience-enablers-02">
      <div
        className={`experience-enabler-connectivity-content ${hasEntered ? 'is-in-view' : ''} ${isActive ? 'is-active' : ''}`}
        ref={sectionRef}
      >
        <div className="experience-enabler-connectivity-layout">
          <div className="experience-enabler-connectivity-sub">
            <p>2/5</p>
            <p>Continuity On The Move</p>
          </div>

          <h2 className="experience-enabler-connectivity-headline">
            Your work doesn’t stop at your laptop.
            <br />
            It picks up wherever you left it.
          </h2>

          <ExperienceEnablersSequencedMedia
            className="experience-enabler-connectivity-sequencer"
            clips={CONTINUITY_CLIPS}
            isActive={isActive}
            isInView={hasEntered}
          />
        </div>
      </div>
    </section>
  )
}

export default ExperienceEnablersContinuitySection
