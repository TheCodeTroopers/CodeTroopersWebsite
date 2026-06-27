import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import SEOHead from '../components/SEOHead';
import PageHeader from '../components/PageHeader';
import { FadeIn, HoverCard } from '../components/Animated';
import { eventProtocol } from '../data/staticContent';
import styles from './EventProtocol.module.css';

function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.accordion}>
      <button className={styles.accordionHeader} onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <HiChevronDown className={`${styles.chevron} ${open ? styles.open : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.accordionBody}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Timeline({ phases }) {
  return (
    <div className={styles.timeline}>
      {phases.map((p, i) => (
        <FadeIn key={i} delay={i}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineMarker}>{i + 1}</div>
            <div className={styles.timelineContent}>
              <h4>{p.phase}</h4>
              <ul>{p.steps.map((s, j) => <li key={j}>{s}</li>)}</ul>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

function Flowchart({ steps }) {
  return (
    <div className={styles.flowchart}>
      {steps.map((step, i) => (
        <FadeIn key={i} delay={i}>
          <div className={styles.flowItem}>
            <div className={styles.flowBox}>{step}</div>
            {i < steps.length - 1 && <div className={styles.flowArrow}>↓</div>}
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

export default function EventProtocol() {
  return (
    <>
      <SEOHead title="Event Protocol" description="Official Code Troopers event planning and execution framework." path="/event-protocol" />
      <PageHeader label="Official Framework" title="Event Protocol" subtitle="Standard procedure for planning, conducting, and closing all club activities." />

      <section className="section">
        <div className="container">
          <FadeIn>
            <div className={styles.golden}>
              <span className={styles.goldenIcon}>⭐</span>
              <h3>Golden Principle</h3>
              <p>{eventProtocol.goldenPrinciple}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <FadeIn>
            <h2 className={styles.sectionTitle}>Workshop Execution Procedure</h2>
            <p className={styles.sectionDesc}>13-phase framework for conducting workshops and skill development camps.</p>
          </FadeIn>
          <Timeline phases={eventProtocol.workshopPhases} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn>
            <h2 className={styles.sectionTitle}>Hackathon Execution Procedure</h2>
            <p className={styles.sectionDesc}>Enhanced approval process for large-scale hackathon events.</p>
          </FadeIn>
          <Timeline phases={eventProtocol.hackathonPhases} />
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <FadeIn>
            <h2 className={styles.sectionTitle}>Approval Process</h2>
          </FadeIn>
          <Flowchart steps={eventProtocol.approvalProcess} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn>
            <h2 className={styles.sectionTitle}>Key Procedures</h2>
          </FadeIn>
          <div className={styles.processGrid}>
            {[
              { title: 'Venue Verification', items: eventProtocol.venueVerification },
              { title: 'Registration', items: eventProtocol.registration },
              { title: 'Attendance', items: eventProtocol.attendance },
              { title: 'Documentation', items: eventProtocol.documentation },
              { title: 'Certificate Generation', items: eventProtocol.certificates },
              { title: 'Closure Report', items: eventProtocol.closureReport }
            ].map((proc, i) => (
              <FadeIn key={i} delay={i}>
                <HoverCard className={styles.processCard}>
                  <h4>{proc.title}</h4>
                  <ul>{proc.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
                </HoverCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <FadeIn>
            <h2 className={styles.sectionTitle}>Detailed Guidelines</h2>
          </FadeIn>
          <AccordionItem title="Registration Management Details" defaultOpen>
            <p>Google Forms must include Name, USN, Branch, Semester, Contact Number, and Email. Use response-limiting extensions to enforce participant caps automatically.</p>
          </AccordionItem>
          <AccordionItem title="Attendance Submission Process">
            <p>Hard copy attendance sheets submitted to Faculty Coordinator at end of each day. Scanned copies shared with all faculty members of respective year for attendance benefits.</p>
          </AccordionItem>
          <AccordionItem title="Event Documentation Folder Structure">
            <p>Each event folder in Google Drive must contain: Event Document, Posters, Registration Forms, Scanned Attendance, PPTs, Resources, Photos, Videos, Certificates, and Feedback Forms.</p>
          </AccordionItem>
          <AccordionItem title="Online Events Exception">
            <p>If an event is conducted online and does not use any college resource, the approval process need not be followed — but the faculty coordinator must be informed.</p>
          </AccordionItem>
        </div>
      </section>
    </>
  );
}
