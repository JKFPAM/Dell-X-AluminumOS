import './LegalPage.css'

type LegalPageProps = {
  onBack: () => void
}

function LegalPage({ onBack }: LegalPageProps) {
  return (
    <main className="legal-page">
      <div className="legal-shell">
        <button className="legal-back" onClick={onBack} type="button">
          Back to presentation
        </button>

        <header className="legal-header">
          <h1>Terms &amp; Privacy Policy</h1>
          <p>
            Dell Technologies Experience Design Group confidential presentation access policy for
            authorised recipients.
          </p>
        </header>

        <section className="legal-section">
          <h2>Privacy Policy</h2>
          <p>
            <strong>What we collect:</strong> Your email address, IP address, device type, browser
            information, and viewing activity (time spent, pages/slides viewed).
          </p>
          <p>
            <strong>Why we collect it:</strong> To track who has accessed this confidential
            presentation on behalf of Experience Design Group at Dell Technologies.
          </p>
          <p>
            <strong>Who has access:</strong> This data is accessible to Experience Design Group at
            Dell Technologies only.
          </p>
          <p>
            <strong>How long we keep it:</strong> Data will be retained for [INSERT RETENTION
            PERIOD, e.g. 90 days] and then securely deleted.
          </p>
          <p>
            <strong>Your rights:</strong> You have the right to request access to, correction of,
            or deletion of your personal data at any time. Contact: [INSERT CONTACT EMAIL]
          </p>
          <p>
            <strong>Data controller:</strong> Experience Design Group at Dell Technologies.
            Contact: [INSERT CONTACT EMAIL]
          </p>
        </section>

        <section className="legal-section">
          <h2>Terms of Access</h2>
          <ol className="legal-list">
            <li>
              <strong>Confidentiality</strong> - This presentation and its contents are strictly
              confidential and proprietary to Experience Design Group at Dell Technologies. You may
              not share, copy, screenshot, or distribute any part of it without prior written
              consent.
            </li>
            <li>
              <strong>Authorised access only</strong> - Access is restricted to invited recipients
              at Dell Technologies and Google. Unauthorised access may constitute a breach of
              confidentiality and applicable law.
            </li>
            <li>
              <strong>Data collection consent</strong> - By clicking &quot;Agree &amp;
              continue&quot; you consent to the collection of your email address, IP address,
              device type, and viewing behaviour as described in the Privacy Policy above.
            </li>
            <li>
              <strong>Data controller</strong> - Experience Design Group at Dell Technologies.
              Contact: [INSERT CONTACT EMAIL]
            </li>
            <li>
              <strong>Retention</strong> - Collected data will be retained for [INSERT RETENTION
              PERIOD] and then securely deleted.
            </li>
          </ol>
        </section>
      </div>
    </main>
  )
}

export default LegalPage
