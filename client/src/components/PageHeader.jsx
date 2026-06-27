import { Link } from 'react-router-dom';
import styles from './PageHeader.module.css';

export default function PageHeader({ label, title, subtitle, breadcrumb }) {
  return (
    <section className={styles.header}>
      <div className={styles.container}>
        {breadcrumb && <p className={styles.breadcrumb}>{breadcrumb}</p>}
        {label && <span className={styles.label}>{label}</span>}
        <h1>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </section>
  );
}
