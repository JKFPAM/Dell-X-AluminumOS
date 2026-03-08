export const CHAPTER_LABELS = [
  'Introduction',
  'Project Context & Vision',
  'Experience Enablers',
  'Outro',
] as const

export type ChapterLabel = (typeof CHAPTER_LABELS)[number]
