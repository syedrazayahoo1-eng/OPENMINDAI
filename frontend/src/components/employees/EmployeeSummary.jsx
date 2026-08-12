import { motion } from 'framer-motion'
import { BriefcaseBusiness, Building2, Heart, UserCheck, UserPlus, Users } from 'lucide-react'

const summaryItems = [
  { label: 'Total Employees', value: '186', change: '+8 this quarter', icon: Users, tone: 'gold' },
  { label: 'Active Employees', value: '172', change: '92.5% workforce', icon: UserCheck, tone: 'green' },
  { label: 'New Hires', value: '14', change: '+4 this month', icon: UserPlus, tone: 'blue' },
  { label: 'Departments', value: '12', change: '2 hiring now', icon: Building2, tone: 'purple' },
  { label: 'Managers', value: '28', change: '1:6.6 team ratio', icon: BriefcaseBusiness, tone: 'orange' },
  { label: 'Retention Rate', value: '94.8%', change: '+1.6% YoY', icon: Heart, tone: 'gold' },
]

export default function EmployeeSummary() {
  return (
    <section aria-label="Employee summary" className="dt-employees-summary-grid">
      {summaryItems.map(({ change, icon: Icon, label, tone, value }, index) => (
        <motion.article
          className="dt-employees-summary-card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          key={label}
          transition={{ delay: index * 0.045, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <span className={'dt-employees-summary-icon is-' + tone}><Icon size={17} strokeWidth={1.85} aria-hidden="true" /></span>
            <span className={'dt-employees-summary-live is-' + tone}><i aria-hidden="true" /> Live</span>
          </div>
          <p>{label}</p>
          <strong>{value}</strong>
          <small className={'is-' + tone}>{change}</small>
        </motion.article>
      ))}
    </section>
  )
}
