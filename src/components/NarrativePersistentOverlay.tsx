import { useEffect, useRef, useState, type CSSProperties } from 'react'
import {
  ECOSYSTEM_SHIFT_LINE,
  LIFE_DIMENSIONS_LINE,
  MULTI_PRODUCT_SHIFT_LINE,
  PURCHASE_SHIFT_LINE,
} from '../sections/stackedNarrativeLines'

type NarrativeIcon = {
  id: string
  src: string
  x: string
  y: string
  size: string
  scale?: string
}

const NARRATIVE_ICONS: NarrativeIcon[] = [
  { id: 'cloud', src: '/assets/section-five/ecosystem-icon-cloud-ecosystem-icon.svg', x: '20%', y: '39%', size: '56px' },
  { id: 'speaker', src: '/assets/section-five/ecosystem-icon-speaker-ecosystem-icon.svg', x: '26%', y: '30%', size: '66px' },
  { id: 'car', src: '/assets/section-five/ecosystem-icon-car-ecosystem-icon.svg', x: '25%', y: '54%', size: '76px' },
  {
    id: 'keyboard',
    src: '/assets/section-five/ecosystem-icon-keeyboard-ecosystem-icon.svg',
    x: '25%',
    y: '73%',
    size: '70px',
  },
  { id: 'laptop', src: '/assets/section-five/ecosystem-icon-laptop-ecosystem-icon.svg', x: '36%', y: '63%', size: '88px' },
  {
    id: 'laptop-speaker',
    src: '/assets/section-five/ecosystem-icon-laptopspeaker-ecosystem-icon.svg',
    x: '37%',
    y: '91%',
    size: '72px',
  },
  { id: 'phone', src: '/assets/section-five/ecosystem-icon-phone-ecosystem-icon.svg', x: '55%', y: '74%', size: '80px' },
  { id: 'airplay', src: '/assets/section-five/ecosystem-icon-airplay-ecosystem-icon.svg', x: '50%', y: '92%', size: '54px' },
  { id: 'watch', src: '/assets/section-five/ecosystem-icon-watch-ecosystem-icon.svg', x: '70%', y: '28%', size: '52px' },
  { id: 'lamps', src: '/assets/section-five/ecosystem-icon-lamps-ecosystem-icon.svg', x: '77%', y: '40%', size: '72px' },
  {
    id: 'earplugs',
    src: '/assets/section-five/ecosystem-icon-earplugs-ecosystem-icon.svg',
    x: '69%',
    y: '54%',
    size: '56px',
  },
  {
    id: 'computer',
    src: '/assets/section-five/ecosystem-icon-computer-ecosystem-icon.svg',
    x: '77%',
    y: '62%',
    size: '76px',
  },
  { id: 'mouse', src: '/assets/section-five/ecosystem-icon-mouse-ecosystem-icon.svg', x: '72%', y: '79%', size: '72px' },
  { id: 'diffuser', src: '/assets/section-five/ecosystem-icon-diffuser-ecosystem-icon.svg', x: '63%', y: '94%', size: '54px' },
]

type NarrativePersistentOverlayProps = {
  activeSectionIndex: number
  isActiveSectionSettled: boolean
}

function NarrativePersistentOverlay({
  activeSectionIndex,
  isActiveSectionSettled,
}: NarrativePersistentOverlayProps) {
  const inNarrativeCoreRange = activeSectionIndex >= 4 && activeSectionIndex <= 7
  const inNarrativeOverlayRange = activeSectionIndex >= 4 && activeSectionIndex <= 8
  const [isLineOneLatchedVisible, setIsLineOneLatchedVisible] = useState(false)
  const [iconsPrimed, setIconsPrimed] = useState(false)
  const [iconsExitStarted, setIconsExitStarted] = useState(false)
  const [skipIconIntro, setSkipIconIntro] = useState(false)
  const previousSectionIndexRef = useRef(activeSectionIndex)

  useEffect(() => {
    const shouldLatch = activeSectionIndex === 4 && isActiveSectionSettled

    if (shouldLatch) {
      setIsLineOneLatchedVisible(true)
      return
    }

    if (!inNarrativeCoreRange) {
      setIsLineOneLatchedVisible(false)
    }
  }, [activeSectionIndex, inNarrativeCoreRange, isActiveSectionSettled])

  useEffect(() => {
    const previousSectionIndex = previousSectionIndexRef.current
    const hasMovedBackFromNextSection =
      previousSectionIndex > 7 && activeSectionIndex <= 7
    const shouldResetIcons = activeSectionIndex < 6 || activeSectionIndex > 7
    const shouldPrimeIconsFromLanding =
      activeSectionIndex === 6 && isActiveSectionSettled

    if (hasMovedBackFromNextSection && !skipIconIntro) {
      setSkipIconIntro(true)
    }

    if (shouldResetIcons) {
      if (iconsPrimed) {
        setIconsPrimed(false)
      }
      if (iconsExitStarted) {
        setIconsExitStarted(false)
      }
      if (activeSectionIndex > 7 && skipIconIntro) {
        setSkipIconIntro(false)
      }
      previousSectionIndexRef.current = activeSectionIndex
      return
    }

    if (shouldPrimeIconsFromLanding && !iconsPrimed) {
      setIconsPrimed(true)
    }

    if (activeSectionIndex === 6 && iconsExitStarted) {
      setIconsExitStarted(false)
    }

    if (
      activeSectionIndex === 7 &&
      iconsPrimed &&
      !iconsExitStarted
    ) {
      setIconsExitStarted(true)
      if (skipIconIntro) {
        setSkipIconIntro(false)
      }
    }

    previousSectionIndexRef.current = activeSectionIndex
  }, [
    activeSectionIndex,
    iconsExitStarted,
    iconsPrimed,
    isActiveSectionSettled,
    skipIconIntro,
  ])

  if (!inNarrativeOverlayRange) {
    return null
  }

  const line1Visible = (activeSectionIndex >= 5 && activeSectionIndex <= 7) || (isLineOneLatchedVisible && activeSectionIndex <= 7)
  const line1Stacked = activeSectionIndex >= 5

  const line2Visible = activeSectionIndex >= 5 && activeSectionIndex <= 7
  const line2Stacked = activeSectionIndex >= 6

  const line3Visible = activeSectionIndex >= 6 && activeSectionIndex <= 7
  const line3Stacked = activeSectionIndex >= 7

  const line4Visible = activeSectionIndex === 7
  const ringsVisible = activeSectionIndex >= 5 && activeSectionIndex <= 8
  const iconsVisible =
    iconsPrimed && !iconsExitStarted && (activeSectionIndex === 6 || activeSectionIndex === 7)
  const iconsExiting =
    iconsPrimed && iconsExitStarted && activeSectionIndex === 7
  const ringsFadingOut = activeSectionIndex === 8

  return (
    <div aria-hidden="true" className="narrative-persistent-overlay">
      <div className={`narrative-ring-overlay ${ringsVisible ? 'is-visible' : ''} ${ringsFadingOut ? 'is-fading-out' : ''}`}>
        <span className="narrative-ring narrative-ring--1" />
        <span className="narrative-ring narrative-ring--2" />
        <span className="narrative-ring narrative-ring--3" />
      </div>
      <div
        className={`narrative-icon-overlay ${iconsVisible ? 'is-visible' : ''} ${iconsExiting ? 'is-exiting' : ''} ${iconsVisible && skipIconIntro ? 'is-no-intro' : ''}`}
      >
        {NARRATIVE_ICONS.map((icon, index) => (
          <span
            className="narrative-icon-bubble"
            key={icon.id}
            style={
              {
                ['--narrative-icon-x' as string]: icon.x,
                ['--narrative-icon-y' as string]: icon.y,
                ['--narrative-icon-size' as string]: icon.size,
                ['--narrative-icon-scale' as string]: icon.scale ?? '1',
                ['--narrative-icon-delay' as string]: `${index * 95}ms`,
                ['--narrative-icon-exit-delay' as string]: `${index * 85}ms`,
              } as CSSProperties
            }
          >
            <img alt="" src={icon.src} />
          </span>
        ))}
      </div>
      <p className={`narrative-line ${line1Visible ? 'is-visible' : ''} ${line1Stacked ? 'is-top row-0' : 'is-center'}`}>
        {PURCHASE_SHIFT_LINE}
      </p>
      <p className={`narrative-line ${line2Visible ? 'is-visible' : ''} ${line2Stacked ? 'is-top row-1' : 'is-center'}`}>
        {ECOSYSTEM_SHIFT_LINE}
      </p>
      <p className={`narrative-line ${line3Visible ? 'is-visible' : ''} ${line3Stacked ? 'is-top row-2' : 'is-center'}`}>
        {MULTI_PRODUCT_SHIFT_LINE}
      </p>
      <p className={`narrative-line ${line4Visible ? 'is-visible is-center' : ''}`}>
        {LIFE_DIMENSIONS_LINE}
      </p>
    </div>
  )
}

export default NarrativePersistentOverlay
