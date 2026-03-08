export type HashNavigableSection = {
  hashGroup?: number
}

const ROMAN_STEPS = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'] as const

const formatHashValue = (value: number) => `#${String(value).padStart(2, '0')}`

export const getHashGroupForIndex = (index: number, sections: HashNavigableSection[]) =>
  sections[index]?.hashGroup ?? index + 1

export const getSectionFiveIndices = (sections: HashNavigableSection[]) =>
  sections.reduce<number[]>((indices, config, index) => {
    if ((config.hashGroup ?? index + 1) === 5) {
      indices.push(index)
    }

    return indices
  }, [])

export const getSectionHash = (index: number, sections: HashNavigableSection[]) => {
  const hashGroup = getHashGroupForIndex(index, sections)

  if (hashGroup !== 5) {
    return formatHashValue(hashGroup)
  }

  const sectionFiveIndices = getSectionFiveIndices(sections)
  const sectionFiveStepIndex = sectionFiveIndices.indexOf(index)

  if (sectionFiveStepIndex < 0) {
    return formatHashValue(hashGroup)
  }

  const romanStep = ROMAN_STEPS[sectionFiveStepIndex] ?? String(sectionFiveStepIndex + 1)
  return `${formatHashValue(hashGroup)}-${romanStep}`
}

export const getIndexForHashGroup = (
  hashGroup: number,
  sectionCount: number,
  sections: HashNavigableSection[],
) => {
  for (let index = 0; index < sectionCount; index += 1) {
    const configHashGroup = sections[index]?.hashGroup ?? index + 1

    if (configHashGroup === hashGroup) {
      return index
    }
  }

  return null
}

export const parseSectionHash = (
  hashValue: string,
  sectionCount: number,
  sections: HashNavigableSection[],
) => {
  const match = hashValue.trim().toLowerCase().match(/^#?(\d{1,2})(?:-([ivxlcdm]+))?$/)

  if (!match) {
    return null
  }

  const number = Number(match[1])
  const subStep = match[2]

  if (!Number.isInteger(number) || number < 1) {
    return null
  }

  if (number === 5 && subStep) {
    const sectionFiveIndices = getSectionFiveIndices(sections)
    const subStepIndex = ROMAN_STEPS.findIndex((step) => step === subStep)

    if (subStepIndex >= 0) {
      return sectionFiveIndices[subStepIndex] ?? sectionFiveIndices[0] ?? null
    }
  }

  return getIndexForHashGroup(number, sectionCount, sections)
}
