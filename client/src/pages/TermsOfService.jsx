import SEOHead from '../components/SEOHead';
import PageHeader from '../components/PageHeader';
import { FadeIn } from '../components/Animated';
import styles from './PrivacyPolicy.module.css';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: [
      'By accessing or using the CodeTroopers Club website (codetroopers.in) or submitting an application to join our club, you agree to be bound by these Terms of Service and all applicable laws and regulations.',
      'If you do not agree with any of these terms, you are prohibited from using or accessing this website. These terms apply to all visitors, applicants, members, and others who access or use our services.',
    ],
  },
  {
    title: '2. Use of the Website',
    content: [
      'You agree to use this website only for lawful purposes and in a manner that does not infringe on the rights of others. You must not:',
      '• Attempt to gain unauthorized access to any part of the website or its servers',
      '• Submit false, misleading, or fraudulent information in any application or form',
      '• Use the website to distribute spam, malware, or harmful content',
      '• Scrape, crawl, or systematically extract data from the website without permission',
      '• Impersonate another person or entity',
      '• Interfere with or disrupt the integrity or performance of the website',
    ],
  },
  {
    title: '3. Application & Membership',
    content: [
      'Submission of an application does not guarantee membership in CodeTroopers Club. All applications are reviewed by the selection committee, and decisions are made at our sole discretion.',
      'By submitting an application, you confirm that all information provided is accurate and complete. Submission of false information will result in immediate disqualification and may be reported to the institution.',
      'Members are expected to uphold the club\'s code of conduct, attend meetings and events regularly, contribute to club projects, and represent the club with integrity.',
      'Membership may be revoked at any time for violation of club rules, misconduct, or breach of these terms.',
    ],
  },
  {
    title: '4. Intellectual Property',
    content: [
      'All content on this website — including but not limited to text, graphics, logos, icons, images, code, and design — is the property of CodeTroopers Club or its content contributors and is protected by applicable intellectual property laws.',
      'You may not reproduce, distribute, modify, create derivative works from, or publicly display any content from this website without prior written permission from the club.',
      'Members who contribute code, designs, or creative work to club projects retain their personal rights but grant the club a non-exclusive license to use, display, and distribute such work.',
    ],
  },
  {
    title: '5. Code of Conduct',
    content: [
      'All members, applicants, and visitors are expected to maintain respectful and professional behavior in all interactions associated with CodeTroopers Club. This includes:',
      '• Treating all individuals with respect regardless of gender, caste, religion, or background',
      '• Maintaining academic integrity and not engaging in plagiarism or cheating',
      '• Respecting the privacy and confidentiality of club information and fellow members',
      '• Using club resources responsibly and for intended purposes only',
      'Violation of the code of conduct may result in removal from the club and reporting to college authorities.',
    ],
  },
  {
    title: '6. Disclaimer of Warranties',
    content: [
      'This website and its content are provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied. CodeTroopers Club makes no warranties regarding:',
      '• The accuracy, completeness, or timeliness of information on the website',
      '• The uninterrupted or error-free operation of the website',
      '• The security of data transmitted to or from the website',
      'We reserve the right to modify or discontinue any part of the website at any time without notice.',
    ],
  },
  {
    title: '7. Limitation of Liability',
    content: [
      'To the fullest extent permitted by law, CodeTroopers Club and its officers, faculty advisors, and members shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of or inability to use the website or its services.',
      'Our total liability for any claim arising from use of this website shall not exceed the amount you paid to access any club services (which is typically zero for a student club).',
    ],
  },
  {
    title: '8. External Links',
    content: [
      'Our website may contain links to third-party websites (such as GitHub, LinkedIn, or Google services). These links are provided for convenience only. CodeTroopers Club does not endorse or take responsibility for the content, privacy practices, or availability of any external websites.',
      'Accessing external links is done at your own risk and subject to the terms and conditions of those websites.',
    ],
  },
  {
    title: '9. Event Participation',
    content: [
      'Participation in CodeTroopers events, workshops, hackathons, and activities is voluntary. By participating, you:',
      '• Acknowledge that some activities may involve physical or technical risks',
      '• Grant the club permission to photograph or record the event and use such media for promotional purposes',
      '• Agree to abide by specific rules and guidelines for each event',
      'The club is not responsible for any personal injury, property damage, or loss arising from event participation.',
    ],
  },
  {
    title: '10. Privacy',
    content: [
      'Your use of this website is also governed by our Privacy Policy, which is incorporated into these Terms of Service by reference. Please review our Privacy Policy to understand our data practices.',
    ],
  },
  {
    title: '11. Modifications to Terms',
    content: [
      'CodeTroopers Club reserves the right to update or modify these Terms of Service at any time without prior notice. Changes will be effective immediately upon posting to the website.',
      'Your continued use of the website after any changes constitutes your acceptance of the new terms. We encourage you to review these terms periodically.',
    ],
  },
  {
    title: '12. Governing Law',
    content: [
      'These Terms of Service shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. Any disputes arising from these terms shall be subject to the jurisdiction of courts in Bengaluru, Karnataka, India.',
    ],
  },
  {
    title: '13. Contact Information',
    content: [
      'If you have any questions about these Terms of Service, please contact us:',
      '📧 Email: codetroopersclub@gmail.com',
      '🏫 CodeTroopers Club, Department of Computer Science & Engineering',
    ],
  },
];

export default function TermsOfService() {
  return (
    <>
      <SEOHead
        title="Terms of Service — CodeTroopers Club"
        description="Terms of Service for CodeTroopers Club website and membership application."
      />

      <PageHeader
        label="Legal"
        title="Terms of Service"
        subtitle="Please read these terms carefully before using our website or submitting an application."
      />

      <main className={styles.main}>
        <div className={styles.container}>
          <FadeIn>
            <div className={styles.meta}>
              <span className={styles.badge}>Last Updated</span>
              <span className={styles.date}>November 25, 2026</span>
            </div>

            <div className={styles.intro}>
              <p>
                These Terms of Service govern your use of the CodeTroopers Club website and all
                associated services. CodeTroopers Club is a student-run technical club at
                RNSIT, Bengaluru, Karnataka. By using our website, you acknowledge
                that you have read, understood, and agree to be bound by these terms.
              </p>
            </div>
          </FadeIn>

          <div className={styles.sections}>
            {sections.map((section, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>{section.title}</h2>
                  <div className={styles.sectionContent}>
                    {section.content.map((para, j) => (
                      <p key={j} className={para.startsWith('•') ? styles.bullet : ''}>
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className={styles.footer}>
              <p>
                These terms were last updated on <strong>November 25, 2026</strong> and apply to all
                users of <strong>codetroopers.in</strong>.
              </p>
            </div>
          </FadeIn>
        </div>
      </main>
    </>
  );
}
