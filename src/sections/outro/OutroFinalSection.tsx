import { useState } from 'react'
import './OutroFinalSection.css'

const OUTRO_HEADLINE = 'And we’re just getting started.'
const OUTRO_LEAD_HEADLINE = 'This is AluminumOS on Dell.'
const OUTRO_CREDIT = 'Dell Technologies, Experience Design Group – March 2026'
const OUTRO_CONTACT_LABEL = 'For more information contact:'
const OUTRO_PARTNERSHIP_PREFIX = 'Vision developed in partnership with'
const OUTRO_CONTACTS = [
  { name: 'Drew Tosh', email: 'drew.tosh@dell.com' },
  { name: 'Banu Waldman', email: 'banu.waldman@dell.com' },
  { name: 'Mark Ligameri', email: 'mark.ligameri@dell.com' },
]

function OutroFinalSection() {
  const [isBackgroundReady, setIsBackgroundReady] = useState(false)

  return (
    <section className="outro-final-section" data-node-id="5972:18255">
      <video
        aria-hidden="true"
        autoPlay
        className={`outro-final-video ${isBackgroundReady ? 'is-visible' : ''}`}
        loop
        muted
        onCanPlay={() => setIsBackgroundReady(true)}
        onError={() => setIsBackgroundReady(false)}
        playsInline
        preload="auto"
      >
        <source src="/assets/section-one/videos/gemini-animation.mp4" type="video/mp4" />
      </video>

      <div className={`outro-final-fallback ${isBackgroundReady ? 'is-hidden' : ''}`} />
      <div aria-hidden="true" className="outro-final-vignette" />

      <div className="outro-final-content" data-node-id="5972:18256">
        <h2 className="outro-final-headline outro-final-headline--lead">
          {OUTRO_LEAD_HEADLINE}
        </h2>

        <h2 className="outro-final-headline" data-node-id="5972:18258">
          {OUTRO_HEADLINE}
        </h2>

        <p className="outro-final-credit" data-node-id="5972:18259">
          {OUTRO_CREDIT}
        </p>

        <div className="outro-final-contacts" data-node-id="5972:18260">
          <p className="outro-final-contacts-label">{OUTRO_CONTACT_LABEL}</p>
          <ul className="outro-final-contacts-list">
            {OUTRO_CONTACTS.map((contact) => (
              <li key={contact.email}>
                <a className="outro-final-contact-link" href={`mailto:${contact.email}`}>
                  {contact.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="outro-final-partnership">
          {OUTRO_PARTNERSHIP_PREFIX}{' '}
          <a
            className="outro-final-partnership-link"
            href="https://forpeople.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            forpeople
          </a>
        </p>
      </div>
    </section>
  )
}

export default OutroFinalSection
