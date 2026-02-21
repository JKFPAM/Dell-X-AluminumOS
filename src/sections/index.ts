import type { ComponentType } from 'react'
import FutureVisionSection from './FutureVisionSection'
import IntroSection from './IntroSection'
import LegacyContextSection from './LegacyContextSection'
import SystemShiftSection from './SystemShiftSection'

export const presentationSections: ComponentType[] = [
  IntroSection,
  LegacyContextSection,
  FutureVisionSection,
  SystemShiftSection,
]
