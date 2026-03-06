import ExperienceEnablersSectionShell from './ExperienceEnablersSectionShell'
import ExperienceEnablersSharedMedia from './ExperienceEnablersSharedMedia'

function ExperienceEnablersContinuitySection() {
  return (
    <ExperienceEnablersSectionShell
      className="experience-enabler-shared-section--continuity"
      headline={"Your work doesn’t\nstop at your laptop.\nIt picks up wherever\nyou left it."}
      nodeId="experience-enablers-02"
      stepLabel="02/05"
      title="CONTINUITY ON THE MOVE"
    >
      <ExperienceEnablersSharedMedia
        sceneOneCopy="Your flow of work travels with you, whether you’re at home or riding a Waymo."
        sceneOneVideo="/assets/experience-enablers/Scene02_1.mp4"
        sceneTwoCopy="Platforms built on Google automatically recognize your activity and leverage the ecosystem to assist you."
        sceneTwoVideo="/assets/experience-enablers/Scene02_2.mp4"
      />
    </ExperienceEnablersSectionShell>
  )
}

export default ExperienceEnablersContinuitySection
