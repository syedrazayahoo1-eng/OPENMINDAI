import { motion } from 'framer-motion'

const departmentStats = [
  { daysUsed: 8, department: 'Revenue', headcount: 42, onLeave: 3, tone: 'gold' },
  { daysUsed: 6, department: 'Engineering', headcount: 88, onLeave: 2, tone: 'blue' },
  { daysUsed: 5, department: 'Growth', headcount: 26, onLeave: 2, tone: 'purple' },
  { daysUsed: 4, department: 'Operations', headcount: 31, onLeave: 1, tone: 'orange' },
  { daysUsed: 3, department: 'People', headcount: 14, onLeave: 1, tone: 'green' },
  { daysUsed: 2, department: 'Finance', headcount: 19, onLeave: 1, tone: 'red' },
]

const maxDaysUsed = Math.max(...departmentStats.map((item) => item.daysUsed))

export default function DepartmentLeaveStats() {
  return (
    <motion.article
      className="dt-leaves-chart-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="dt-leaves-section-heading">
        <div>
          <p>DEPARTMENT LEAVE STATS</p>
          <h2>Coverage load by operating team</h2>
        </div>
        <span>6 teams</span>
      </header>
      <div className="dt-leaves-dept-stats-grid">
        {departmentStats.map(({ daysUsed, department, headcount, onLeave, tone }) => (
          <article className="dt-leaves-dept-stat-row" key={department}>
            <div className="dt-leaves-dept-stat-name">
              <span className="dt-leaves-department">{department}</span>
              <small>{headcount} employees</small>
            </div>
            <div className="dt-leaves-dept-stat-track">
              <span className={'is-' + tone} style={{ width: (daysUsed / maxDaysUsed) * 100 + '%' }} />
            </div>
            <div className="dt-leaves-dept-stat-meta">
              <strong>{daysUsed}d</strong>
              <small>{onLeave} on leave now</small>
            </div>
          </article>
        ))}
      </div>
    </motion.article>
  )
}
