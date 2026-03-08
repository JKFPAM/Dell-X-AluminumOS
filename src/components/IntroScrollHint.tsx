import './IntroScrollHint.css'
import { PRESENTATION_ADVANCE_REQUEST_EVENT } from '@/features/presentation/navigationEvents'

function IntroScrollHint() {
  const handleAdvance = () => {
    window.dispatchEvent(new CustomEvent(PRESENTATION_ADVANCE_REQUEST_EVENT))
  }

  return (
    <div className="intro-scroll-hint">
      <div aria-hidden="true" className="intro-scroll-hint-graphic">
        <svg
          className="intro-scroll-hint-svg"
          fill="none"
          height="41"
          viewBox="0 0 150 41"
          width="150"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="intro-scroll-hint-key intro-scroll-hint-key--left">
            <rect height="40" rx="6.5" stroke="currentColor" width="45" x="0.5" y="0.5" />
            <path
              d="M23.2426 15.7574L19.3536 19.6464C19.1583 19.8417 19.1583 20.1583 19.3536 20.3536L23.2426 24.2426"
              stroke="currentColor"
              strokeLinecap="round"
            />
          </g>

          <g className="intro-scroll-hint-key intro-scroll-hint-key--up">
            <path
              d="M59 0.5H91C94.5899 0.500001 97.5 3.41015 97.5 7V18C97.5 18.8284 96.8284 19.5 96 19.5H54C53.1716 19.5 52.5 18.8284 52.5 18V7C52.5 3.41015 55.4101 0.5 59 0.5Z"
              stroke="currentColor"
            />
            <path
              d="M70.7574 10.2426L74.6464 6.35355C74.8417 6.15829 75.1583 6.15829 75.3536 6.35355L79.2426 10.2426"
              stroke="currentColor"
              strokeLinecap="round"
            />
          </g>

          <g className="intro-scroll-hint-key intro-scroll-hint-key--down">
            <path
              d="M54 21.5H96C96.8284 21.5 97.5 22.1716 97.5 23V34C97.5 37.5899 94.5899 40.5 91 40.5H59C55.4101 40.5 52.5 37.5899 52.5 34V23C52.5 22.1716 53.1716 21.5 54 21.5Z"
              stroke="currentColor"
            />
            <path
              d="M79.2426 30.7574L75.3536 34.6464C75.1583 34.8417 74.8417 34.8417 74.6464 34.6464L70.7574 30.7574"
              stroke="currentColor"
              strokeLinecap="round"
            />
          </g>

          <g className="intro-scroll-hint-key intro-scroll-hint-key--right">
            <rect height="40" rx="6.5" stroke="currentColor" width="45" x="104.5" y="0.5" />
            <path
              d="M126.757 15.7574L130.646 19.6464C130.842 19.8417 130.842 20.1583 130.646 20.3536L126.757 24.2426"
              stroke="currentColor"
              strokeLinecap="round"
            />
          </g>
        </svg>
        <button
          aria-label="Advance to next section"
          className="intro-scroll-hint-down-hit"
          onClick={handleAdvance}
          type="button"
        />
      </div>
      <span className="intro-scroll-hint-copy">Use Arrow Keys to Advance</span>
    </div>
  )
}

export default IntroScrollHint
