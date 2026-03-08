import { useEffect, useRef, useState } from 'react'
import './ProjectContextCommandSection.css'

function ProjectContextCommandSection() {
  const [isInView, setIsInView] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const backgroundVideoRef = useRef<HTMLVideoElement>(null)

  const restartBackgroundVideo = () => {
    const video = backgroundVideoRef.current

    if (!video) {
      return
    }

    video.currentTime = 0
    void video.play().catch(() => undefined)
  }

  useEffect(() => {
    const node = contentRef.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (!entry) {
          return
        }

        setIsInView(entry.isIntersecting)

        if (entry.isIntersecting) {
          restartBackgroundVideo()
          return
        }

        backgroundVideoRef.current?.pause()
      },
      { threshold: 0.55 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return (
    <section className="project-context-command" data-node-id="3435:10359" onClick={restartBackgroundVideo}>
      <video
        aria-hidden="true"
        autoPlay
        className="project-context-command-background-video"
        muted
        playsInline
        preload="auto"
        ref={backgroundVideoRef}
      >
        <source src="/assets/XPS-Reveal.mp4" type="video/mp4" />
      </video>

      <div className={`project-context-command-content ${isInView ? 'is-in-view' : ''}`} ref={contentRef}>
        <p className="project-context-command-kicker" data-node-id="3435:10371">
          With AluminumOS, we can redefine what it means to own a Dell.
        </p>

        <div className="project-context-command-main" data-name="content" data-node-id="4156:1765">
          <p className="project-context-command-copy project-context-command-copy--line-one" data-node-id="3435:10406">
            From a place where work happens...
          </p>

          <p className="project-context-command-copy project-context-command-copy--line-two" data-node-id="3435:10407">
            to the command center for an ambitious life.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ProjectContextCommandSection
