import { useEffect, useState } from 'react'
import {
  ECOSYSTEM_SHIFT_LINE,
  LIFE_DIMENSIONS_LINE,
  MULTI_PRODUCT_SHIFT_LINE,
  PURCHASE_SHIFT_LINE,
} from '../sections/stackedNarrativeLines'

type NarrativePersistentOverlayProps = {
  activeSectionIndex: number
  isActiveSectionSettled: boolean
}

function NarrativePersistentOverlay({
  activeSectionIndex,
  isActiveSectionSettled,
}: NarrativePersistentOverlayProps) {
  const inNarrativeRange = activeSectionIndex >= 4 && activeSectionIndex <= 7
  const [isLineOneLatchedVisible, setIsLineOneLatchedVisible] = useState(false)
  const [hasFinalNarrativeSectionSettled, setHasFinalNarrativeSectionSettled] = useState(false)

  useEffect(() => {
    const shouldLatch = activeSectionIndex === 4 && isActiveSectionSettled

    if (shouldLatch) {
      setIsLineOneLatchedVisible(true)
      return
    }

    if (!inNarrativeRange) {
      setIsLineOneLatchedVisible(false)
    }
  }, [activeSectionIndex, inNarrativeRange, isActiveSectionSettled])

  useEffect(() => {
    if (activeSectionIndex < 7) {
      setHasFinalNarrativeSectionSettled(false)
      return
    }

    if (activeSectionIndex === 7 && isActiveSectionSettled) {
      setHasFinalNarrativeSectionSettled(true)
    }
  }, [activeSectionIndex, isActiveSectionSettled])

  if (!inNarrativeRange) {
    return null
  }

  const line1Visible = (activeSectionIndex >= 5 && activeSectionIndex <= 7) || isLineOneLatchedVisible
  const line1Stacked = activeSectionIndex >= 5

  const line2Visible = activeSectionIndex >= 5
  const line2Stacked = activeSectionIndex >= 6

  const line3Visible = activeSectionIndex >= 6
  const line3Stacked = activeSectionIndex >= 7

  const line4Visible = activeSectionIndex >= 7
  const ringsVisible = activeSectionIndex >= 5
  const ringsFadingOut =
    activeSectionIndex === 7 && hasFinalNarrativeSectionSettled && !isActiveSectionSettled

  return (
    <div aria-hidden="true" className="narrative-persistent-overlay">
      <div className={`narrative-ring-overlay ${ringsVisible ? 'is-visible' : ''} ${ringsFadingOut ? 'is-fading-out' : ''}`}>
        <span className="narrative-ring narrative-ring--1" />
        <span className="narrative-ring narrative-ring--2" />
        <span className="narrative-ring narrative-ring--3" />
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
