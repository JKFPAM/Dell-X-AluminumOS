import type { ChapterLabel } from './chapters'

export const PRESENTATION_COMPONENT_KEYS = [
  'IntroSection',
  'LegacyContextSection',
  'FutureVisionSection',
  'SystemShiftSection',
  'PurchaseShiftSection',
  'EcosystemShiftSection',
  'MultiProductShiftSection',
  'LifeDimensionsSection',
  'ProjectContextQuestionsSection',
  'ProjectContextLensSection',
  'ProjectContextVisionSection',
  'ProjectContextCommandSection',
  'ProjectContextAudienceSection',
  'ProjectContextModeSwitchersSection',
  'ProjectContextPlaceholderSection',
  'ExperienceEnablersDeviceConnectivitySection',
  'ExperienceEnablersContinuitySection',
  'ExperienceEnablersSharedIOSection',
  'ExperienceEnablersPassiveAutomationSection',
  'ExperienceEnablersContextualSwitchingSection',
  'OutroSection',
  'OutroFinalSection',
] as const

export type PresentationSectionComponentKey = (typeof PRESENTATION_COMPONENT_KEYS)[number]

export const PRESENTATION_SECTION_IDS = [
  'intro',
  'legacy-context',
  'future-vision',
  'system-shift',
  'purchase-shift',
  'ecosystem-shift',
  'multi-product-shift',
  'life-dimensions',
  'project-context-questions',
  'project-context-lens',
  'project-context-vision',
  'project-context-command',
  'project-context-audience',
  'project-context-mode-switchers',
  'project-context-placeholder',
  'experience-enablers-device-connectivity',
  'experience-enablers-continuity',
  'experience-enablers-shared-io',
  'experience-enablers-passive-automation',
  'experience-enablers-contextual-switching',
  'outro',
  'outro-final',
] as const

export type PresentationSectionId = (typeof PRESENTATION_SECTION_IDS)[number]

export type PresentationSectionDefinition = {
  sectionId: PresentationSectionId
  component: PresentationSectionComponentKey
  disableParallax?: boolean
  chapterLabel?: ChapterLabel
  hashGroup?: number
}

export const presentationSectionDefinitions: PresentationSectionDefinition[] = [
  { sectionId: 'intro', component: 'IntroSection', chapterLabel: 'Introduction', hashGroup: 1 },
  {
    sectionId: 'legacy-context',
    component: 'LegacyContextSection',
    chapterLabel: 'Introduction',
    hashGroup: 2,
  },
  {
    sectionId: 'future-vision',
    component: 'FutureVisionSection',
    chapterLabel: 'Introduction',
    hashGroup: 3,
  },
  {
    sectionId: 'system-shift',
    component: 'SystemShiftSection',
    chapterLabel: 'Introduction',
    hashGroup: 4,
  },
  {
    sectionId: 'purchase-shift',
    component: 'PurchaseShiftSection',
    chapterLabel: 'Introduction',
    disableParallax: true,
    hashGroup: 5,
  },
  {
    sectionId: 'ecosystem-shift',
    component: 'EcosystemShiftSection',
    chapterLabel: 'Introduction',
    disableParallax: true,
    hashGroup: 5,
  },
  {
    sectionId: 'multi-product-shift',
    component: 'MultiProductShiftSection',
    chapterLabel: 'Introduction',
    disableParallax: true,
    hashGroup: 5,
  },
  {
    sectionId: 'life-dimensions',
    component: 'LifeDimensionsSection',
    chapterLabel: 'Introduction',
    disableParallax: true,
    hashGroup: 5,
  },
  {
    sectionId: 'project-context-questions',
    component: 'ProjectContextQuestionsSection',
    chapterLabel: 'Project Context & Vision',
    hashGroup: 6,
  },
  {
    sectionId: 'project-context-lens',
    component: 'ProjectContextLensSection',
    chapterLabel: 'Project Context & Vision',
    hashGroup: 7,
  },
  {
    sectionId: 'project-context-vision',
    component: 'ProjectContextVisionSection',
    chapterLabel: 'Project Context & Vision',
    hashGroup: 8,
  },
  {
    sectionId: 'project-context-command',
    component: 'ProjectContextCommandSection',
    chapterLabel: 'Project Context & Vision',
    hashGroup: 9,
  },
  {
    sectionId: 'project-context-audience',
    component: 'ProjectContextAudienceSection',
    chapterLabel: 'Project Context & Vision',
    hashGroup: 10,
  },
  {
    sectionId: 'project-context-mode-switchers',
    component: 'ProjectContextModeSwitchersSection',
    chapterLabel: 'Project Context & Vision',
    hashGroup: 11,
  },
  {
    sectionId: 'project-context-placeholder',
    component: 'ProjectContextPlaceholderSection',
    chapterLabel: 'Project Context & Vision',
    hashGroup: 12,
  },
  {
    sectionId: 'experience-enablers-device-connectivity',
    component: 'ExperienceEnablersDeviceConnectivitySection',
    chapterLabel: 'Experience Enablers',
    hashGroup: 13,
  },
  {
    sectionId: 'experience-enablers-continuity',
    component: 'ExperienceEnablersContinuitySection',
    chapterLabel: 'Experience Enablers',
    hashGroup: 14,
  },
  {
    sectionId: 'experience-enablers-shared-io',
    component: 'ExperienceEnablersSharedIOSection',
    chapterLabel: 'Experience Enablers',
    hashGroup: 15,
  },
  {
    sectionId: 'experience-enablers-passive-automation',
    component: 'ExperienceEnablersPassiveAutomationSection',
    chapterLabel: 'Experience Enablers',
    hashGroup: 16,
  },
  {
    sectionId: 'experience-enablers-contextual-switching',
    component: 'ExperienceEnablersContextualSwitchingSection',
    chapterLabel: 'Experience Enablers',
    hashGroup: 17,
  },
  {
    sectionId: 'outro',
    component: 'OutroSection',
    chapterLabel: 'Outro',
    hashGroup: 18,
  },
  {
    sectionId: 'outro-final',
    component: 'OutroFinalSection',
    chapterLabel: 'Outro',
    hashGroup: 19,
  },
]
