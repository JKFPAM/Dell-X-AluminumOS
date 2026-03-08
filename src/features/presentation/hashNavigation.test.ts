import { describe, expect, it } from 'vitest'
import { presentationSectionDefinitions } from '@/content/presentationStructure'
import { getSectionHash, parseSectionHash } from './hashNavigation'

const hashSections = presentationSectionDefinitions.map(({ hashGroup }) => ({ hashGroup }))

describe('hash navigation mapping', () => {
  it('formats top-level groups correctly', () => {
    expect(getSectionHash(0, hashSections)).toBe('#01')
    expect(getSectionHash(1, hashSections)).toBe('#02')
    expect(getSectionHash(8, hashSections)).toBe('#06')
  })

  it('formats section five sub-steps with roman suffix', () => {
    expect(getSectionHash(4, hashSections)).toBe('#05-i')
    expect(getSectionHash(5, hashSections)).toBe('#05-ii')
    expect(getSectionHash(6, hashSections)).toBe('#05-iii')
    expect(getSectionHash(7, hashSections)).toBe('#05-iv')
  })

  it('parses section hash back to expected section index', () => {
    expect(parseSectionHash('#05-iii', hashSections.length, hashSections)).toBe(6)
    expect(parseSectionHash('#06', hashSections.length, hashSections)).toBe(8)
    expect(parseSectionHash('#19', hashSections.length, hashSections)).toBe(21)
  })

  it('returns null for invalid hashes', () => {
    expect(parseSectionHash('#00', hashSections.length, hashSections)).toBeNull()
    expect(parseSectionHash('abc', hashSections.length, hashSections)).toBeNull()
    expect(parseSectionHash('#99', hashSections.length, hashSections)).toBeNull()
  })
})
