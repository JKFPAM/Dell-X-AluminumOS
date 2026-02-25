import type { ComponentType } from 'react'
import EcosystemShiftSection from './EcosystemShiftSection'
import FutureVisionSection from './FutureVisionSection'
import IntroSection from './IntroSection'
import LegacyContextSection from './LegacyContextSection'
import LifeDimensionsSection from './LifeDimensionsSection'
import MultiProductShiftSection from './MultiProductShiftSection'
import ProjectContextLensSection from './ProjectContextLensSection'
import ProjectContextQuestionsSection from './ProjectContextQuestionsSection'
import PurchaseShiftSection from './PurchaseShiftSection'
import SystemShiftSection from './SystemShiftSection'

export type PresentationSectionConfig = {
  Component: ComponentType
  disableParallax?: boolean
  chapterLabel?: string
  hashGroup?: number
}

export const presentationSectionConfigs: PresentationSectionConfig[] = [
  { Component: IntroSection, chapterLabel: 'Introduction', hashGroup: 1 },
  { Component: LegacyContextSection, chapterLabel: 'Introduction', hashGroup: 2 },
  { Component: FutureVisionSection, chapterLabel: 'Introduction', hashGroup: 3 },
  { Component: SystemShiftSection, chapterLabel: 'Introduction', hashGroup: 4 },
  { Component: PurchaseShiftSection, chapterLabel: 'Introduction', disableParallax: true, hashGroup: 5 },
  { Component: EcosystemShiftSection, chapterLabel: 'Introduction', disableParallax: true, hashGroup: 5 },
  { Component: MultiProductShiftSection, chapterLabel: 'Introduction', disableParallax: true, hashGroup: 5 },
  { Component: LifeDimensionsSection, chapterLabel: 'Introduction', disableParallax: true, hashGroup: 5 },
  {
    Component: ProjectContextQuestionsSection,
    chapterLabel: 'Project Context & Vision',
    hashGroup: 6,
  },
  {
    Component: ProjectContextLensSection,
    chapterLabel: 'Project Context & Vision',
    hashGroup: 7,
  },
]
