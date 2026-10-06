import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, delay: Math.min(i * 0.035, 0.2), ease: [0.22, 1, 0.36, 1] }
  })
};

export function FadeIn({ children, delay = 0, duration, className = '' }) {
  const variants = duration
    ? {
        hidden: { opacity: 0, y: 16 },
        visible: (i = 0) => ({
          opacity: 1,
          y: 0,
          transition: { duration, delay: Math.min(i * 0.035, 0.2), ease: [0.22, 1, 0.36, 1] }
        })
      }
    : fadeUp;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      variants={variants}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

export function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.075 } }
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}

export function HoverCard({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -6, scale: 1.012 }}
      transition={{ type: 'spring', stiffness: 340, damping: 26 }}
    >
      {children}
    </motion.div>
  );
}
