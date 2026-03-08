import type { ComponentType } from 'react'
import type { ChapterLabel } from '../content/chapters'
import { presentationSectionDefinitions } from '../content/presentationStructure'
import ExperienceEnablersContextualSwitchingSection from './experience-enablers/ExperienceEnablersContextualSwitchingSection'
import ExperienceEnablersContinuitySection from './experience-enablers/ExperienceEnablersContinuitySection'
import ExperienceEnablersDeviceConnectivitySection from './experience-enablers/ExperienceEnablersDeviceConnectivitySection'
import ExperienceEnablersPassiveAutomationSection from './experience-enablers/ExperienceEnablersPassiveAutomationSection'
import ExperienceEnablersSharedIOSection from './experience-enablers/ExperienceEnablersSharedIOSection'
import EcosystemShiftSection from './introduction/EcosystemShiftSection'
import FutureVisionSection from './introduction/FutureVisionSection'
import IntroSection from './introduction/IntroSection'
import LegacyContextSection from './introduction/LegacyContextSection'
import LifeDimensionsSection from './introduction/LifeDimensionsSection'
import MultiProductShiftSection from './introduction/MultiProductShiftSection'
import PurchaseShiftSection from './introduction/PurchaseShiftSection'
import SystemShiftSection from './introduction/SystemShiftSection'
import OutroFinalSection from './outro/OutroFinalSection'
import OutroSection from './outro/OutroSection'
import ProjectContextAudienceSection from './project-context/ProjectContextAudienceSection'
import ProjectContextCommandSection from './project-context/ProjectContextCommandSection'
import ProjectContextLensSection from './project-context/ProjectContextLensSection'
import ProjectContextModeSwitchersSection from './project-context/ProjectContextModeSwitchersSection'
import ProjectContextPlaceholderSection from './project-context/ProjectContextPlaceholderSection'
import ProjectContextQuestionsSection from './project-context/ProjectContextQuestionsSection'
import ProjectContextVisionSection from './project-context/ProjectContextVisionSection'

export type PresentationSectionConfig = {
  Component: ComponentType
  disableParallax?: boolean
  chapterLabel?: ChapterLabel
  hashGroup?: number
}

const sectionComponentRegistry: Record<string, ComponentType> = {
  IntroSection,
  LegacyContextSection,
  FutureVisionSection,
  SystemShiftSection,
  PurchaseShiftSection,
  EcosystemShiftSection,
  MultiProductShiftSection,
  LifeDimensionsSection,
  ProjectContextQuestionsSection,
  ProjectContextLensSection,
  ProjectContextVisionSection,
  ProjectContextCommandSection,
  ProjectContextAudienceSection,
  ProjectContextModeSwitchersSection,
  ProjectContextPlaceholderSection,
  ExperienceEnablersDeviceConnectivitySection,
  ExperienceEnablersContinuitySection,
  ExperienceEnablersSharedIOSection,
  ExperienceEnablersPassiveAutomationSection,
  ExperienceEnablersContextualSwitchingSection,
  OutroSection,
  OutroFinalSection,
}

const resolveSectionComponent = (key: string): ComponentType => {
  const component = sectionComponentRegistry[key]

  if (!component) {
    throw new Error(`Unknown presentation component key: ${key}`)
  }

  return component
}

export const presentationSectionConfigs: PresentationSectionConfig[] = presentationSectionDefinitions.map(
  ({ component, chapterLabel, disableParallax, hashGroup }) => ({
    Component: resolveSectionComponent(component),
    chapterLabel,
    disableParallax,
    hashGroup,
  }),
)
