import ExperienceEnablersSectionShell from './ExperienceEnablersSectionShell'
import ExperienceEnablersSharedMedia from './ExperienceEnablersSharedMedia'

function ExperienceEnablersContextualSwitchingSection() {
  return (
    <ExperienceEnablersSectionShell
      className="experience-enabler-shared-section--contextual"
      headline={"Work is work, though.\nAnd it doesn’t follow you home if you don’t want it to."}
      nodeId="experience-enablers-05"
      stepLabel="05/05"
      title="CONTEXTUAL MODE SWITCHING"
    >
      <ExperienceEnablersSharedMedia
        sceneOneCopy="When you dock your Dell XPS at home, your Dell peripherals automatically wake. Your system automatically switches to Home Mode."
        sceneOneVideo="/assets/experience-enablers/Scene05_1.mp4"
        sceneTwoCopy="With Chromecast built into Dell XPS, your Android TV becomes an extended display for your laptop."
        sceneTwoVideo="/assets/experience-enablers/Scene05_2.mp4"
      />
    </ExperienceEnablersSectionShell>
  )
}

export default ExperienceEnablersContextualSwitchingSection
