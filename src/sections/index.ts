import type { ComponentType } from 'react'
import type { ChapterLabel } from '@/content/chapters'
import {
  type PresentationSectionComponentKey,
  type PresentationSectionId,
  presentationSectionDefinitions,
} from '@/content/presentationStructure'
import {
  ExperienceEnablersContextualSwitchingSection,
  ExperienceEnablersContinuitySection,
  ExperienceEnablersDeviceConnectivitySection,
  ExperienceEnablersPassiveAutomationSection,
  ExperienceEnablersSharedIOSection,
} from './experience-enablers'
import {
  EcosystemShiftSection,
  FutureVisionSection,
  IntroSection,
  LegacyContextSection,
  LifeDimensionsSection,
  MultiProductShiftSection,
  PurchaseShiftSection,
  SystemShiftSection,
} from './introduction'
import { OutroFinalSection, OutroSection } from './outro'
import {
  ProjectContextAudienceSection,
  ProjectContextCommandSection,
  ProjectContextIntelligenceSection,
  ProjectContextLensSection,
  ProjectContextModeSwitchersSection,
  ProjectContextPlaceholderSection,
  ProjectContextQuestionsSection,
  ProjectContextVisionSection,
} from './project-context'

export type PresentationSectionConfig = {
  sectionId: PresentationSectionId
  Component: ComponentType
  disableParallax?: boolean
  chapterLabel?: ChapterLabel
  hashGroup?: number
}

const sectionComponentRegistry: Record<PresentationSectionComponentKey, ComponentType> = {
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
  ProjectContextIntelligenceSection,
  ExperienceEnablersDeviceConnectivitySection,
  ExperienceEnablersContinuitySection,
  ExperienceEnablersSharedIOSection,
  ExperienceEnablersPassiveAutomationSection,
  ExperienceEnablersContextualSwitchingSection,
  OutroSection,
  OutroFinalSection,
}

const resolveSectionComponent = (key: PresentationSectionComponentKey): ComponentType => {
  const component = sectionComponentRegistry[key]

  if (!component) {
    throw new Error(`Unknown presentation component key: ${key}`)
  }

  return component
}

export const presentationSectionConfigs: PresentationSectionConfig[] = presentationSectionDefinitions.map(
  ({ sectionId, component, chapterLabel, disableParallax, hashGroup }) => ({
    sectionId,
    Component: resolveSectionComponent(component),
    chapterLabel,
    disableParallax,
    hashGroup,
  }),
)
