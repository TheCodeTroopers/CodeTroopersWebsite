import SEOHead from '../components/SEOHead';
import PageHeader from '../components/PageHeader';
import { FadeIn } from '../components/Animated';
import styles from './PrivacyPolicy.module.css';

const sections = [
  {
    title: '1. Information We Collect',
    content: [
      'When you submit an application through our "Join Us" form, we collect the following personal information:',
      '• Full name, University Serial Number (USN), semester, and college email address',
      '• Phone number',
      '• GitHub and LinkedIn profile links',
      '• Skills, experience, and motivation statement',
      '• Resume/CV file (uploaded to Google Drive)',
      'We also collect non-personal information such as browser type and pages visited through standard server logs.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: [
      'The information collected is used solely for the following purposes:',
      '• Evaluating membership applications to CodeTroopers Club',
      '• Communicating with applicants regarding their application status',
      '• Maintaining records of club members and alumni',
      '• Improving our recruitment process and club operations',
      'We do not use your data for advertising, profiling, or any commercial purpose.',
    ],
  },
  {
    title: '3. Data Storage & Security',
    content: [
      'Your application data is stored securely using Supabase (a managed PostgreSQL database with row-level security). Resume files are stored on Google Drive with access restricted to club administrators.',
      'We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.',
      'Only authorized club administrators and faculty advisors have access to submitted application data.',
    ],
  },
  {
    title: '4. Data Sharing',
    content: [
      'We do not sell, trade, or otherwise transfer your personal information to outside parties. Your data may be shared only in the following limited circumstances:',
      '• With club faculty advisors and department heads for official review purposes',
      '• With college administration when required for institutional compliance',
      '• When required by law or in response to valid legal processes',
    ],
  },
  {
    title: '5. Data Retention',
    content: [
      'Application data is retained for a maximum of 2 academic years from the date of submission. After this period, records are permanently deleted from all storage systems.',
      'If your application is accepted and you become a member, relevant data may be retained for the duration of your membership and up to 1 year after.',
      'You may request deletion of your data at any time by contacting us at the email below.',
    ],
  },
  {
    title: '6. Cookies',
    content: [
      'Our website uses only essential cookies necessary for basic website functionality such as session management and security. We do not use tracking cookies or third-party advertising cookies.',
      'You can control cookie settings through your browser preferences. Disabling cookies may affect certain website features.',
    ],
  },
  {
    title: '7. Third-Party Services',
    content: [
      'We use the following third-party services which have their own privacy policies:',
      '• Google Drive — for resume file storage (Google Privacy Policy)',
      '• Supabase — for application data storage (Supabase Privacy Policy)',
      '• Vercel — for website hosting (Vercel Privacy Policy)',
      'We encourage you to review the privacy policies of these services.',
    ],
  },
  {
    title: '8. Your Rights',
    content: [
      'You have the right to:',
      '• Access the personal data we hold about you',
      '• Request correction of inaccurate data',
      '• Request deletion of your data',
      '• Withdraw consent for data processing at any time',
      'To exercise any of these rights, please contact us at codetroopersclub@gmail.com.',
    ],
  },
  {
    title: '9. Children\'s Privacy',
    content: [
      'Our services are intended for college students (typically 18 years and older). We do not knowingly collect personal information from individuals under the age of 16.',
      'If you believe a minor has submitted personal information to us, please contact us immediately so we can remove it.',
    ],
  },
  {
    title: '10. Changes to This Policy',
    content: [
      'We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.',
      'Continued use of our website or submission of an application after changes are posted constitutes your acceptance of the revised policy.',
    ],
  },
  {
    title: '11. Contact Us',
    content: [
      'If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:',
      '📧 Email: codetroopersclub@gmail.com',
      '🏫 CodeTroopers Club, Department of Computer Science & Engineering',
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <SEOHead
        title="Privacy Policy — CodeTroopers Club"
        description="Learn how CodeTroopers Club collects, uses, and protects your personal information."
      />

      <PageHeader
        label="Legal"
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your personal information."
      />

      <main className={styles.main}>
        <div className={styles.container}>
          <FadeIn>
            <div className={styles.meta}>
              <span className={styles.badge}>Effective Date</span>
              <span className={styles.date}>November 25, 2026</span>
            </div>

            <div className={styles.intro}>
              <p>
                CodeTroopers Club ("we", "our", or "us") is committed to protecting your privacy.
                This Privacy Policy explains how we handle personal information collected through
                our website and recruitment application process. By using our website or submitting
                an application, you agree to the terms described below.
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
                This policy applies to all data collected via{' '}
                <strong>codetroopers.in</strong> and its subdomains.
              </p>
            </div>
          </FadeIn>
        </div>
      </main>
    </>
  );
}
