import { motion } from 'framer-motion'
import { BadgeCheck, CalendarOff, Clock3, Home, UserX, Users } from 'lucide-react'

const summaryItems = [
  { label: 'Present Today', value: '142', detail: '91.0% of workforce', icon: Users, tone: 'green' },
  { label: 'Absent', value: '7', detail: '2 unreported', icon: UserX, tone: 'red' },
  { label: 'Late Check-ins', value: '11', detail: 'Average delay: 13m', icon: Clock3, tone: 'orange' },
  { label: 'On Leave', value: '9', detail: '6 approved today', icon: CalendarOff, tone: 'blue' },
  { label: 'Remote Employees', value: '34', detail: '24% of workforce', icon: Home, tone: 'purple' },
  { label: 'Attendance %', value: '96.2%', detail: '+2.4% vs last month', icon: BadgeCheck, tone: 'gold' },
]

export default function AttendanceSummary() {
  return (
    <section className="dt-attendance-summary-grid" aria-label="Attendance summary">
      {summaryItems.map(({ detail, icon: Icon, label, tone, value }, index) => (
        <motion.article
          className="dt-attendance-summary-card"
          key={label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <span className={'dt-attendance-summary-icon is-' + tone}><Icon size={19} strokeWidth={1.85} aria-hidden="true" /></span>
            <span className={'dt-attendance-summary-live is-' + tone}><i /> Live</span>
          </div>
          <p>{label}</p>
          <strong>{value}</strong>
          <small className={'is-' + tone}>{detail}</small>
        </motion.article>
      ))}
    </section>
  )
}
