import { ArrowUpRight, MoreHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ActivityCard({ action = 'View all', eyebrow, items, title }) {
  return (
    <motion.section
      className="dt-dashboard-activity-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="dt-dashboard-card-heading">
        <div>
          {eyebrow ? <p>{eyebrow}</p> : null}
          <h2>{title}</h2>
        </div>
        <button aria-label={action} type="button"><MoreHorizontal size={19} strokeWidth={1.9} aria-hidden="true" /></button>
      </header>
      <div className="dt-dashboard-activity-list">
        {items.map(({ detail, icon: Icon, label, meta, tone }, index) => (
          <article className="dt-dashboard-activity-row" key={label + index}>
            <span className={'dt-dashboard-activity-icon is-' + tone}><Icon size={18} strokeWidth={1.85} aria-hidden="true" /></span>
            <div>
              <strong>{label}</strong>
              <p>{detail}</p>
            </div>
            <span className="dt-dashboard-activity-meta">{meta}</span>
          </article>
        ))}
      </div>
      <button className="dt-dashboard-card-link" type="button">
        {action}
        <ArrowUpRight size={15} strokeWidth={1.9} aria-hidden="true" />
      </button>
    </motion.section>
  )
}
