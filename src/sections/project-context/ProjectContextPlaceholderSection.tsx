import { useEffect, useRef, useState } from 'react'
import './ProjectContextPlaceholderSection.css'

type AmplifyCardIcon = 'scale' | 'shield' | 'bolt'

type AmplifyCard = {
  id: string
  copy: string
  icon: AmplifyCardIcon
}

const amplifyCards: AmplifyCard[] = [
  {
    id: 'scale',
    icon: 'scale',
    copy: "Scale it across a whole new range of devices and PC's",
  },
  {
    id: 'security',
    icon: 'shield',
    copy: 'Embed it with airtight security, from chip to cloud',
  },
  {
    id: 'performance',
    icon: 'bolt',
    copy: 'Drive it with high-performance computing muscle',
  },
]

function AmplifyCardIconSvg({ icon }: { icon: AmplifyCardIcon }) {
  if (icon === 'scale') {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 45 45">
        <path
          d="M15.8778 17.9376C16.4647 18.5223 17.4162 18.5223 18.003 17.9376C18.5899 17.3529 18.5899 16.4049 18.003 15.8202L16.9404 16.8789L15.8778 17.9376ZM1.50253 8.05781e-05C0.672587 8.02836e-05 -0.000212437 0.670424 -0.000212142 1.49734L-0.000212986 14.9726C-0.000212986 15.7995 0.672586 16.4699 1.50253 16.4699C2.33247 16.4699 3.00527 15.7995 3.00527 14.9726V2.99459H15.0272C15.8571 2.99459 16.5299 2.32425 16.5299 1.49734C16.5299 0.670424 15.8571 7.97367e-05 15.0272 7.97367e-05L1.50253 8.05781e-05ZM16.9404 16.8789L18.003 15.8202L2.56512 0.438616L1.50253 1.49734L0.439929 2.55606L15.8778 17.9376L16.9404 16.8789Z"
          fill="currentColor"
        />
        <path
          d="M29.1212 27.055C28.5343 26.4703 27.5829 26.4703 26.996 27.055C26.4091 27.6398 26.4091 28.5878 26.996 29.1725L28.0586 28.1138L29.1212 27.055ZM43.4965 44.9926C44.3264 44.9926 44.9992 44.3223 44.9992 43.4953L44.9992 30.02C44.9992 29.1931 44.3264 28.5228 43.4965 28.5228C42.6666 28.5228 41.9938 29.1931 41.9938 30.02L41.9938 41.9981L29.9718 41.9981C29.1419 41.9981 28.4691 42.6684 28.4691 43.4953C28.4691 44.3223 29.1419 44.9926 29.9718 44.9926L43.4965 44.9926ZM28.0586 28.1138L26.996 29.1725L42.4339 44.5541L43.4965 43.4953L44.5591 42.4366L29.1212 27.055L28.0586 28.1138Z"
          fill="currentColor"
        />
        <path
          d="M26.996 15.8202C26.4091 16.4049 26.4091 17.3529 26.996 17.9376C27.5829 18.5223 28.5343 18.5223 29.1212 17.9376L28.0586 16.8789L26.996 15.8202ZM44.9992 1.49734C44.9992 0.670424 44.3264 8.02836e-05 43.4965 8.05781e-05L29.9718 7.97367e-05C29.1419 7.97367e-05 28.4691 0.670424 28.4691 1.49734C28.4691 2.32425 29.1419 2.99459 29.9718 2.99459H41.9938V14.9726C41.9938 15.7995 42.6666 16.4699 43.4965 16.4699C44.3264 16.4699 44.9992 15.7995 44.9992 14.9726L44.9992 1.49734ZM28.0586 16.8789L29.1212 17.9376L44.5591 2.55606L43.4965 1.49734L42.4339 0.438616L26.996 15.8202L28.0586 16.8789Z"
          fill="currentColor"
        />
        <path
          d="M18.003 29.174C18.5899 28.5892 18.5899 27.6412 18.003 27.0565C17.4162 26.4718 16.4647 26.4718 15.8778 27.0565L16.9404 28.1152L18.003 29.174ZM-0.000213441 43.4968C-0.000213806 44.3237 0.672585 44.9941 1.50253 44.9941L15.0272 44.9941C15.8571 44.9941 16.5299 44.3237 16.5299 43.4968C16.5299 42.6699 15.8571 41.9995 15.0272 41.9995L3.00526 41.9995L3.00527 30.0215C3.00527 29.1946 2.33247 28.5242 1.50253 28.5242C0.672586 28.5242 -0.000213077 29.1946 -0.000213147 30.0215L-0.000213441 43.4968ZM16.9404 28.1152L15.8778 27.0565L0.439928 42.4381L1.50253 43.4968L2.56512 44.5555L18.003 29.174L16.9404 28.1152Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (icon === 'shield') {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 56 50">
        <path
          d="M44.8714 8.64326C37.8196 7.80211 30.3542 3.73865 27.505 1.81104C24.6558 3.73865 17.1945 7.80418 10.1428 8.64532C8.98531 12.3253 7.15115 21.4202 9.07435 28.3596C10.9975 35.299 22.146 44.2187 27.4883 47.811C32.8305 44.2187 44.0166 35.297 45.9398 28.3575C47.863 21.4181 46.0288 12.3233 44.8714 8.64326Z"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          d="M51.5929 8.02734C53.1985 13.2484 55.4199 26.3652 50.5885 35.9974"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <path
          d="M3.43247 8.02734C1.82693 13.2484 -0.394533 26.3652 4.43692 35.9974"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 36 54">
      <path
        d="M22.2891 2.19922C23.7796 0.60028 26.5361 1.97982 26.042 4.20312L22.1719 21.6162H31.6494C33.4525 21.6164 34.4948 23.661 33.4355 25.1201L14.8164 50.7598C13.3901 52.7237 10.3 51.2816 10.8887 48.9268L15.1982 31.6904H3.71484C1.87449 31.6904 0.841864 29.571 1.97656 28.1221L22.1494 2.36328L22.2891 2.19922Z"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  )
}

function ProjectContextPlaceholderSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const section = sectionRef.current

    if (!section) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setIsInView(Boolean(entry?.isIntersecting))
      },
      { threshold: 0.55 },
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      className={`project-context-placeholder ${isInView ? 'is-in-view' : ''}`}
      data-node-id="section-12-placeholder"
      ref={sectionRef}
    >
      <div className="project-context-placeholder-content">
        <video
          aria-hidden="true"
          autoPlay
          className="project-context-placeholder-video"
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/assets/amplify.mp4" type="video/mp4" />
        </video>

        <div className="project-context-placeholder-overlay">
          <p className="project-context-placeholder-kicker">Now take that experience and</p>

          <h2 aria-label="amplify it" className="project-context-placeholder-headline">
            amplify it
          </h2>

          <ul className="project-context-placeholder-points" data-node-id="6068:24062">
            {amplifyCards.map((card) => (
              <li className="project-context-placeholder-point" key={card.id}>
                <span aria-hidden="true" className="project-context-placeholder-point-icon">
                  <AmplifyCardIconSvg icon={card.icon} />
                </span>
                <p>{card.copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default ProjectContextPlaceholderSection
