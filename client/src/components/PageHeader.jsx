import { HiOutlineChevronDown } from 'react-icons/hi';
import styles from './PageHeader.module.css';

export default function PageHeader({ label, title, subtitle, breadcrumb, showScroll }) {
  return (
    <section className={styles.header}>
      <div className={styles.container}>
        {breadcrumb && <p className={styles.breadcrumb}>{breadcrumb}</p>}
        {label && <span className={styles.label}>{label}</span>}
        <h1>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {showScroll && (
          <div className={styles.scrollIndicator}>
            <span>Scroll</span>
            <HiOutlineChevronDown className={styles.scrollIcon} />
          </div>
        )}
      </div>
    </section>
  );
}
