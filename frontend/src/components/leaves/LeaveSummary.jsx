import { motion } from 'framer-motion'
import { CalendarCheck, CalendarDays, CircleAlert, CircleX, Percent, Users } from 'lucide-react'

const summaryItems = [
  { label: 'Pending Requests', value: '18', change: '6 need review today', icon: CircleAlert, tone: 'orange' },
  { label: 'Approved Leaves', value: '47', change: '+11 this month', icon: CalendarCheck, tone: 'green' },
  { label: 'Rejected Leaves', value: '4', change: 'Low impact rate', icon: CircleX, tone: 'red' },
  { label: 'Employees on Leave', value: '9', change: '4.8% of workforce', icon: Users, tone: 'blue' },
  { label: 'Annual Leave Balance', value: '412d', change: 'Across all teams', icon: CalendarDays, tone: 'gold' },
  { label: 'Leave Utilization %', value: '58.4%', change: '+3.2% vs last year', icon: Percent, tone: 'purple' },
]

export default function LeaveSummary() {
  return (
    <section aria-label="Leave summary" className="dt-leaves-summary-grid">
      {summaryItems.map(({ change, icon: Icon, label, tone, value }, index) => (
        <motion.article
          className="dt-leaves-summary-card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          key={label}
          transition={{ delay: index * 0.045, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <span className={'dt-leaves-summary-icon is-' + tone}><Icon size={17} strokeWidth={1.85} aria-hidden="true" /></span>
            <span className={'dt-leaves-summary-live is-' + tone}><i aria-hidden="true" /> Live</span>
          </div>
          <p>{label}</p>
          <strong>{value}</strong>
          <small className={'is-' + tone}>{change}</small>
        </motion.article>
      ))}
    </section>
  )
}
