import type { ChapterLabel } from './chapters'

export type PresentationSectionDefinition = {
  component: string
  disableParallax?: boolean
  chapterLabel?: ChapterLabel
  hashGroup?: number
}

export const presentationSectionDefinitions: PresentationSectionDefinition[] = [
  { component: 'IntroSection', chapterLabel: 'Introduction', hashGroup: 1 },
  { component: 'LegacyContextSection', chapterLabel: 'Introduction', hashGroup: 2 },
  { component: 'FutureVisionSection', chapterLabel: 'Introduction', hashGroup: 3 },
  { component: 'SystemShiftSection', chapterLabel: 'Introduction', hashGroup: 4 },
  { component: 'PurchaseShiftSection', chapterLabel: 'Introduction', disableParallax: true, hashGroup: 5 },
  { component: 'EcosystemShiftSection', chapterLabel: 'Introduction', disableParallax: true, hashGroup: 5 },
  { component: 'MultiProductShiftSection', chapterLabel: 'Introduction', disableParallax: true, hashGroup: 5 },
  { component: 'LifeDimensionsSection', chapterLabel: 'Introduction', disableParallax: true, hashGroup: 5 },
  {
    component: 'ProjectContextQuestionsSection',
    chapterLabel: 'Project Context & Vision',
    hashGroup: 6,
  },
  {
    component: 'ProjectContextLensSection',
    chapterLabel: 'Project Context & Vision',
    hashGroup: 7,
  },
  {
    component: 'ProjectContextVisionSection',
    chapterLabel: 'Project Context & Vision',
    hashGroup: 8,
  },
  {
    component: 'ProjectContextCommandSection',
    chapterLabel: 'Project Context & Vision',
    hashGroup: 9,
  },
  {
    component: 'ProjectContextAudienceSection',
    chapterLabel: 'Project Context & Vision',
    hashGroup: 10,
  },
  {
    component: 'ProjectContextModeSwitchersSection',
    chapterLabel: 'Project Context & Vision',
    hashGroup: 11,
  },
  {
    component: 'ProjectContextPlaceholderSection',
    chapterLabel: 'Project Context & Vision',
    hashGroup: 12,
  },
  {
    component: 'ExperienceEnablersDeviceConnectivitySection',
    chapterLabel: 'Experience Enablers',
    hashGroup: 13,
  },
  {
    component: 'ExperienceEnablersContinuitySection',
    chapterLabel: 'Experience Enablers',
    hashGroup: 14,
  },
  {
    component: 'ExperienceEnablersSharedIOSection',
    chapterLabel: 'Experience Enablers',
    hashGroup: 15,
  },
  {
    component: 'ExperienceEnablersPassiveAutomationSection',
    chapterLabel: 'Experience Enablers',
    hashGroup: 16,
  },
  {
    component: 'ExperienceEnablersContextualSwitchingSection',
    chapterLabel: 'Experience Enablers',
    hashGroup: 17,
  },
  {
    component: 'OutroSection',
    chapterLabel: 'Outro',
    hashGroup: 18,
  },
  {
    component: 'OutroFinalSection',
    chapterLabel: 'Outro',
    hashGroup: 19,
  },
]
