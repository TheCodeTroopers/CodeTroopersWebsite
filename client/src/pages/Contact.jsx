import { useState, useEffect } from 'react';
import { HiChevronDown, HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaGithub, FaLinkedin, FaInstagram, FaDiscord, FaTwitter } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import SEOHead from '../components/SEOHead';
import PageHeader from '../components/PageHeader';
import { FadeIn, HoverCard } from '../components/Animated';
import { getContactInfo, submitContact } from '../services/api';
import styles from './Contact.module.css';

const socialIcons = {
  github: FaGithub,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  discord: FaDiscord,
  twitter: FaTwitter
};

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.faqItem}>
      <button className={styles.faqHeader} onClick={() => setOpen(!open)}>
        <span>{question}</span>
        <HiChevronDown className={`${styles.chevron} ${open ? styles.open : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className={styles.faqBody} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <p>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  const [info, setInfo] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getContactInfo().then(r => setInfo(r.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await submitContact(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title="Contact" description="Get in touch with Code Troopers — questions, membership, and collaborations." path="/contact" />
      <PageHeader label="Get in Touch" title="Contact Us" subtitle="Have questions? We'd love to hear from you." />

      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            <FadeIn>
              <form className={styles.form} onSubmit={handleSubmit}>
                <h3>Send a Message</h3>
                <div className={styles.field}>
                  <label htmlFor="name">Name</label>
                  <input id="name" type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label htmlFor="subject">Subject</label>
                  <input id="subject" type="text" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label htmlFor="message">Message</label>
                  <textarea id="message" rows="5" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
                {status === 'success' && <p className={styles.success}>Message sent successfully!</p>}
                {status === 'error' && <p className={styles.error}>Failed to send. Please try again.</p>}
              </form>
            </FadeIn>

            <div>
              <FadeIn delay={1}>
                <HoverCard className={styles.infoCard}>
                  <h3>Contact Information</h3>
                  {info && (
                    <>
                      <p><HiMail /> {info.info.email}</p>
                      <p><HiPhone /> {info.info.phone}</p>
                      <p><HiLocationMarker /> {info.info.address}</p>
                      <div className={styles.social}>
                        {Object.entries(info.info.social).map(([key, url]) => {
                          const Icon = socialIcons[key];
                          return Icon ? (
                            <a key={key} href={url} target="_blank" rel="noopener noreferrer" aria-label={key}>
                              <Icon />
                            </a>
                          ) : null;
                        })}
                      </div>
                    </>
                  )}
                </HoverCard>
              </FadeIn>

              <FadeIn delay={2}>
                <div className={styles.map}>
                  <div className={styles.mapPlaceholder}>
                    <HiLocationMarker />
                    <p>Google Map Placeholder</p>
                    <span>CSE Department, College Campus</span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <FadeIn>
            <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          </FadeIn>
          {info?.faq?.map((item, i) => (
            <FadeIn key={i} delay={i}>
              <FAQItem question={item.question} answer={item.answer} />
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
