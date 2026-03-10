export const CHAPTER_LABELS = [
  'Introduction',
  'Project Context & Vision',
  'Experiences',
  'Outro',
] as const

export type ChapterLabel = (typeof CHAPTER_LABELS)[number]
