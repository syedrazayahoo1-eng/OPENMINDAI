import { motion } from 'framer-motion'

export default function AnalyticsCard({ action, children, className = '', eyebrow, title }) {
  return (
    <motion.section
      className={'dt-dashboard-analytics-card ' + className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="dt-dashboard-card-heading">
        <div>
          {eyebrow ? <p>{eyebrow}</p> : null}
          <h2>{title}</h2>
        </div>
        {action ? <button type="button">{action}</button> : null}
      </header>
      {children}
    </motion.section>
  )
}
