import './IntroScrollHint.css'

function IntroScrollHint() {
  return (
    <div aria-hidden="true" className="intro-scroll-hint">
      <svg
        className="intro-scroll-hint-svg"
        fill="none"
        viewBox="0 0 200 163"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="keyboard-group">
          <rect height="40" rx="6.5" stroke="white" width="45" x="25.5" y="61.5" />
          <path
            d="M48.2426 76.7574L44.3536 80.6464C44.1583 80.8417 44.1583 81.1583 44.3536 81.3536L48.2426 85.2426"
            stroke="white"
            strokeLinecap="round"
          />
          <rect height="40" rx="6.5" stroke="white" width="45" x="128.5" y="61.5" />
          <path
            d="M150.757 76.7574L154.646 80.6464C154.842 80.8417 154.842 81.1583 154.646 81.3536L150.757 85.2426"
            stroke="white"
            strokeLinecap="round"
          />
          <path
            d="M84 61.5H116C119.59 61.5 122.5 64.4101 122.5 68V79C122.5 79.8284 121.828 80.5 121 80.5H79C78.1716 80.5 77.5 79.8284 77.5 79V68C77.5 64.4101 80.4101 61.5 84 61.5Z"
            stroke="white"
          />
          <path
            d="M95.7574 71.2426L99.6464 67.3536C99.8417 67.1583 100.158 67.1583 100.354 67.3536L104.243 71.2426"
            stroke="white"
            strokeLinecap="round"
          />
        </g>
        <rect
          className="morphing-rect"
          fill="none"
          height="19"
          rx="4"
          stroke="white"
          strokeWidth="1.5"
          width="45"
          x="77.5"
          y="82.5"
        >
          <animate
            attributeName="x"
            dur="6s"
            keyTimes="0;0.30;0.383;0.86;0.943;1"
            repeatCount="indefinite"
            values="77.5;77.5;25.5;25.5;77.5;77.5"
          />
          <animate
            attributeName="y"
            dur="6s"
            keyTimes="0;0.30;0.383;0.86;0.943;1"
            repeatCount="indefinite"
            values="82.5;82.5;30;30;82.5;82.5"
          />
          <animate
            attributeName="width"
            dur="6s"
            keyTimes="0;0.30;0.383;0.86;0.943;1"
            repeatCount="indefinite"
            values="45;45;148;148;45;45"
          />
          <animate
            attributeName="height"
            dur="6s"
            keyTimes="0;0.30;0.383;0.86;0.943;1"
            repeatCount="indefinite"
            values="19;19;103;103;19;19"
          />
          <animate
            attributeName="rx"
            dur="6s"
            keyTimes="0;0.30;0.383;0.86;0.943;1"
            repeatCount="indefinite"
            values="4;4;12;12;4;4"
          />
        </rect>
        <path
          className="down-arrow"
          d="M104.243 91.7574L100.354 95.6464C100.158 95.6464 99.8417 95.6464 99.6464 95.6464L95.7574 91.7574"
          stroke="white"
          strokeLinecap="round"
        />
        <g className="fingers-group">
          <circle cx="92" cy="80" fill="none" r="6" stroke="white" strokeWidth="1.5" />
          <circle cx="108" cy="80" fill="none" r="6" stroke="white" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  )
}

export default IntroScrollHint
