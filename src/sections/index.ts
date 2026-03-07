import type { ComponentType } from 'react'
import ExperienceEnablersContextualSwitchingSection from './ExperienceEnablersContextualSwitchingSection'
import ExperienceEnablersContinuitySection from './ExperienceEnablersContinuitySection'
import ExperienceEnablersDeviceConnectivitySection from './ExperienceEnablersDeviceConnectivitySection'
import ExperienceEnablersPassiveAutomationSection from './ExperienceEnablersPassiveAutomationSection'
import ExperienceEnablersSharedIOSection from './ExperienceEnablersSharedIOSection'
import ProjectContextCommandSection from './ProjectContextCommandSection'
import ProjectContextAudienceSection from './ProjectContextAudienceSection'
import ProjectContextModeSwitchersSection from './ProjectContextModeSwitchersSection'
import ProjectContextPlaceholderSection from './ProjectContextPlaceholderSection'
import EcosystemShiftSection from './EcosystemShiftSection'
import FutureVisionSection from './FutureVisionSection'
import IntroSection from './IntroSection'
import LegacyContextSection from './LegacyContextSection'
import LifeDimensionsSection from './LifeDimensionsSection'
import MultiProductShiftSection from './MultiProductShiftSection'
import OutroFinalSection from './OutroFinalSection'
import OutroSection from './OutroSection'
import ProjectContextLensSection from './ProjectContextLensSection'
import ProjectContextQuestionsSection from './ProjectContextQuestionsSection'
import ProjectContextVisionSection from './ProjectContextVisionSection'
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
  {
    Component: ProjectContextVisionSection,
    chapterLabel: 'Project Context & Vision',
    hashGroup: 8,
  },
  {
    Component: ProjectContextCommandSection,
    chapterLabel: 'Project Context & Vision',
    hashGroup: 9,
  },
  {
    Component: ProjectContextAudienceSection,
    chapterLabel: 'Project Context & Vision',
    hashGroup: 10,
  },
  {
    Component: ProjectContextModeSwitchersSection,
    chapterLabel: 'Project Context & Vision',
    hashGroup: 11,
  },
  {
    Component: ProjectContextPlaceholderSection,
    chapterLabel: 'Project Context & Vision',
    hashGroup: 12,
  },
  {
    Component: ExperienceEnablersDeviceConnectivitySection,
    chapterLabel: 'Experience Enablers',
    hashGroup: 13,
  },
  {
    Component: ExperienceEnablersContinuitySection,
    chapterLabel: 'Experience Enablers',
    hashGroup: 14,
  },
  {
    Component: ExperienceEnablersSharedIOSection,
    chapterLabel: 'Experience Enablers',
    hashGroup: 15,
  },
  {
    Component: ExperienceEnablersPassiveAutomationSection,
    chapterLabel: 'Experience Enablers',
    hashGroup: 16,
  },
  {
    Component: ExperienceEnablersContextualSwitchingSection,
    chapterLabel: 'Experience Enablers',
    hashGroup: 17,
  },
  {
    Component: OutroSection,
    chapterLabel: 'Outro',
    hashGroup: 18,
  },
  {
    Component: OutroFinalSection,
    chapterLabel: 'Outro',
    hashGroup: 19,
  },
]
