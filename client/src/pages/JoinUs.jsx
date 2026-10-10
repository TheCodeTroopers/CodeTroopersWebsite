import { useState } from 'react';
import { HiDocumentText, HiExclamationCircle, HiInformationCircle } from 'react-icons/hi';
import SEOHead from '../components/SEOHead';
import PageHeader from '../components/PageHeader';
import { FadeIn } from '../components/Animated';
import { clubInfo } from '../data/staticContent';
import styles from './JoinUs.module.css';

const initialForm = {
  fullName: '',
  usn: '',
  semester: '',
  collegeEmail: '',
  phone: '',
  skillsExperience: '',
  github: '',
  linkedin: '',
  motivation: '',
  resume: null
};

export default function JoinUs() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null);

  const updateField = (field, value) => {
    setForm(current => ({ ...current, [field]: value }));
    setStatus(null);
  };

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (file && file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      event.target.value = '';
      setForm(current => ({ ...current, resume: null }));
      setStatus({ type: 'error', message: 'Please upload your resume as a PDF file.' });
      return;
    }
    updateField('resume', file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.resume) {
      setStatus({ type: 'error', message: 'Please attach your resume as a PDF file.' });
      return;
    }

    if (!form.skillsExperience.trim()) {
      setStatus({ type: 'error', message: 'Please tell us about your skills and experience.' });
      return;
    }

    setStatus({
      type: 'pending',
      message: 'Your details look complete. Online submission is not open yet, so this application has not been saved.'
    });
  };

  return (
    <>
      <SEOHead
        title="Join Us"
        description="Apply to join CodeTroopers and contribute to technical projects, events, workshops, and community initiatives."
        path="/join-us"
      />
      <PageHeader
        label="Recruitment"
        title="Join CodeTroopers"
        subtitle="Apply to work with builders, organizers, designers, and problem solvers across the club."
      />

      <section className="section">
        <div className="container">
          <div className={styles.layout}>
            <FadeIn>
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formHeader}>
                  <span className={styles.kicker}>Application Form</span>
                  <h2>Tell us where you want to contribute</h2>
                </div>

                <div className={styles.grid}>
                  <div className={styles.field}>
                    <label htmlFor="fullName">Full name</label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={form.fullName}
                      onChange={event => updateField('fullName', event.target.value)}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="usn">USN</label>
                    <input
                      id="usn"
                      type="text"
                      required
                      value={form.usn}
                      onChange={event => updateField('usn', event.target.value.toUpperCase())}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="semester">Semester</label>
                    <select
                      id="semester"
                      required
                      value={form.semester}
                      onChange={event => updateField('semester', event.target.value)}
                    >
                      <option value="">Select semester</option>
                      {Array.from({ length: 8 }, (_, index) => String(index + 1)).map(semester => (
                        <option key={semester} value={semester}>{semester}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="collegeEmail">College email</label>
                    <input
                      id="collegeEmail"
                      type="email"
                      required
                      value={form.collegeEmail}
                      onChange={event => updateField('collegeEmail', event.target.value)}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="phone">Phone number</label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      inputMode="tel"
                      value={form.phone}
                      onChange={event => updateField('phone', event.target.value)}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="github">GitHub</label>
                    <input
                      id="github"
                      type="url"
                      required
                      placeholder="https://github.com/username"
                      value={form.github}
                      onChange={event => updateField('github', event.target.value)}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="linkedin">LinkedIn</label>
                    <input
                      id="linkedin"
                      type="url"
                      required
                      placeholder="https://linkedin.com/in/username"
                      value={form.linkedin}
                      onChange={event => updateField('linkedin', event.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="skillsExperience">Skills & Experience</label>
                  <textarea
                    id="skillsExperience"
                    rows="7"
                    required
                    placeholder="List the technologies, tools, or skills you are good at. For example: Java, Python, React, UI/UX design, graphic design, video editing, content writing, event coordination, public speaking, or social media management. Mention your experience or projects if applicable."
                    value={form.skillsExperience}
                    onChange={event => updateField('skillsExperience', event.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="motivation">Why do you want to join?</label>
                  <textarea
                    id="motivation"
                    rows="6"
                    required
                    value={form.motivation}
                    onChange={event => updateField('motivation', event.target.value)}
                  />
                </div>

                <div className={styles.uploadField}>
                  <label htmlFor="resume">
                    <HiDocumentText />
                    <span>
                      Resume upload
                      <small>PDF only</small>
                    </span>
                  </label>
                  <input
                    id="resume"
                    type="file"
                    accept="application/pdf,.pdf"
                    required
                    onChange={handleResumeChange}
                  />
                  {form.resume && <p>{form.resume.name}</p>}
                </div>

                <button type="submit" className="btn btn-primary">Check Application</button>

                {status && (
                  <p className={`${styles.status} ${styles[status.type]}`}>
                    {status.type === 'error' ? <HiExclamationCircle /> : <HiInformationCircle />}
                    {status.message}
                  </p>
                )}
              </form>
            </FadeIn>

            <FadeIn delay={1}>
              <aside className={styles.aside}>
                <div className={styles.panel}>
                  <span className={styles.kicker}>What We Look For</span>
                  <h3>{clubInfo.tagline}</h3>
                  <p>{clubInfo.secondaryTagline}</p>
                  <ul className={styles.ruleList}>
                    {clubInfo.goldenRules.slice(0, 4).map(rule => (
                      <li key={rule}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </aside>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
