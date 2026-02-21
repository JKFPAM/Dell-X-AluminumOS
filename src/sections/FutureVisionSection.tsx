import { useEffect, useRef, useState } from 'react'
import './FutureVisionSection.css'

const HEADLINE = 'Today, the boundaries within innovation are far less siloed.'

function FutureVisionSection() {
  const [isInView, setIsInView] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = contentRef.current

    if (!node || isInView) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (!entry?.isIntersecting) {
          return
        }

        setIsInView(true)
        observer.disconnect()
      },
      { threshold: 0.28 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [isInView])

  return (
    <section className="future-vision-section" data-node-id="2735:5668">
      <div
        className={`future-vision-content ${isInView ? 'is-in-view' : ''}`}
        data-node-id="2735:5669"
        ref={contentRef}
      >
        <p className="future-vision-headline" data-node-id="2735:5722">
          {HEADLINE}
        </p>
      </div>
    </section>
  )
}

export default FutureVisionSection
