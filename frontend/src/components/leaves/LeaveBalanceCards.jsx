import { motion } from 'framer-motion'
import { Baby, CalendarDays, Coffee, Home, Stethoscope } from 'lucide-react'

const balancePools = [
  { allocated: 480, icon: CalendarDays, tone: 'gold', type: 'Annual Leave', used: 268 },
  { allocated: 210, icon: Stethoscope, tone: 'blue', type: 'Sick Leave', used: 96 },
  { allocated: 150, icon: Coffee, tone: 'purple', type: 'Casual Leave', used: 84 },
  { allocated: 260, icon: Home, tone: 'green', type: 'Work From Home', used: 132 },
  { allocated: 120, icon: Baby, tone: 'orange', type: 'Parental Leave', used: 41 },
]

export default function LeaveBalanceCards() {
  return (
    <motion.article
      className="dt-leaves-chart-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="dt-leaves-section-heading">
        <div>
          <p>ORG BALANCE OVERVIEW</p>
          <h2>Leave pools remaining across the company</h2>
        </div>
        <span>621d left</span>
      </header>
      <div className="dt-leaves-balance-overview-grid">
        {balancePools.map(({ allocated, icon: Icon, tone, type, used }) => {
          const remaining = allocated - used
          const percentUsed = Math.round((used / allocated) * 100)

          return (
            <article className="dt-leaves-balance-overview-item" key={type}>
              <span className={'dt-leaves-summary-icon is-' + tone}><Icon size={16} strokeWidth={1.85} aria-hidden="true" /></span>
              <div className="dt-leaves-balance-overview-copy">
                <p>{type}</p>
                <div className="dt-leaves-balance-overview-track">
                  <span className={'is-' + tone} style={{ width: percentUsed + '%' }} />
                </div>
                <small>{used}d used of {allocated}d &middot; {remaining}d remaining</small>
              </div>
              <strong className={'is-' + tone}>{percentUsed}%</strong>
            </article>
          )
        })}
      </div>
    </motion.article>
  )
}
