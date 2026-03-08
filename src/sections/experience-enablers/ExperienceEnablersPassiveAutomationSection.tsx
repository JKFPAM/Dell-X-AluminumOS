import ExperienceEnablersSectionShell from './ExperienceEnablersSectionShell'
import ExperienceEnablersSharedMedia from './ExperienceEnablersSharedMedia'

function ExperienceEnablersPassiveAutomationSection() {
  return (
    <ExperienceEnablersSectionShell
      className="experience-enabler-shared-section--passive"
      headline={'Focus on what\nmatters to you.\nLet Gemini\nhandle the rest.'}
      nodeId="experience-enablers-04"
      stepLabel="04/05"
      title="PASSIVE MODE AUTOMATION"
    >
      <ExperienceEnablersSharedMedia
        sceneOneCopy="Press the Google button on your Dell XPS keyboard to summon Gemini. Use voice or text to prompt."
        sceneOneVideo="/assets/experience-enablers/Scene04_1.mp4"
        sceneTwoCopy="Ask from one device, execute on another. Gemini works in the background and lets you know when it's ready on any connected device."
        sceneTwoVideo="/assets/experience-enablers/Scene04_2.mp4"
      />
    </ExperienceEnablersSectionShell>
  )
}

export default ExperienceEnablersPassiveAutomationSection
