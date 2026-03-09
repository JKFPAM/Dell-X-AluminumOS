import { useEffect, useRef, useState } from 'react'
import ExperienceEnablersSequencedMedia, {
  type ExperienceEnablersSequencedClip,
} from './ExperienceEnablersSequencedMedia'
import './ExperienceEnablersDeviceConnectivitySection.css'

const ACTIVE_VISIBILITY_THRESHOLD = 0.55

const DEVICE_CONNECTIVITY_CLIPS: ExperienceEnablersSequencedClip[] = [
  {
    caption: 'Seamlessly connect your new Dell XPS to your Google ecosystem.',
    id: 'device-connectivity-01',
    label: '01',
    videoSrc: '/assets/experience-enablers/Scene01_1.mp4',
  },
  {
    caption:
      'Once connected, your XPS is part of the entire ecosystem: apps, I/O, and every other Google enabled device.',
    id: 'device-connectivity-02',
    label: '02',
    videoSrc: '/assets/experience-enablers/Scene01_2.mp4',
  },
]

function ExperienceEnablersDeviceConnectivitySection() {
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
    <section className="experience-enabler-connectivity" data-node-id="5764:13794">
      <div
        className={`experience-enabler-connectivity-content ${hasEntered ? 'is-in-view' : ''} ${isActive ? 'is-active' : ''}`}
        ref={sectionRef}
      >
        <div className="experience-enabler-connectivity-layout">
          <div className="experience-enabler-connectivity-sub" data-name="sub" data-node-id="5764:13796">
            <p data-node-id="5764:13797">1/5</p>
            <p data-node-id="5764:13798">Device Connectivity</p>
          </div>

          <h2 className="experience-enabler-connectivity-headline" data-node-id="5764:13795">
            Your laptop is no longer an isolated machine.
            <br />
            It&apos;s one point in a much larger ecosystem.
          </h2>

          <ExperienceEnablersSequencedMedia
            className="experience-enabler-connectivity-sequencer"
            clips={DEVICE_CONNECTIVITY_CLIPS}
            isActive={isActive}
            isInView={hasEntered}
          />
        </div>
      </div>
    </section>
  )
}

export default ExperienceEnablersDeviceConnectivitySection
