import { motion } from 'framer-motion'
import { Bot, CheckCircle2, Clock3, UserRound } from 'lucide-react'

const deployments = [
  { name: 'Marketing AI', department: 'Growth', person: 'Maya R.', time: '9 minutes ago', status: 'Deployed', icon: Bot, tone: 'gold' },
  { name: 'Invoice Agent', department: 'Finance', person: 'David L.', time: '1 hour ago', status: 'Training', icon: Clock3, tone: 'blue' },
  { name: 'Support Bot', department: 'Customer Success', person: 'Sarah T.', time: '3 hours ago', status: 'Deployed', icon: CheckCircle2, tone: 'green' },
  { name: 'CRM Agent', department: 'Revenue', person: 'Alex M.', time: 'Yesterday', status: 'Configured', icon: UserRound, tone: 'purple' },
]

export default function RecentDeployments() {
  return (
    <motion.section
      className="dt-agents-deployments"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="dt-agents-section-heading">
        <div>
          <p>WORKFORCE HISTORY</p>
          <h2>Recent Deployments</h2>
        </div>
        <button type="button">View deployment log</button>
      </header>
      <div className="dt-agents-deployment-list">
        {deployments.map(({ department, icon: Icon, name, person, status, time, tone }) => (
          <article key={name}>
            <span className={'dt-agents-deployment-icon is-' + tone}><Icon size={17} strokeWidth={1.9} aria-hidden="true" /></span>
            <div>
              <strong>{name}</strong>
              <p>Deployed by {person}</p>
            </div>
            <span className="dt-agents-deployment-department">{department}</span>
            <time>{time}</time>
            <span className={'dt-agents-deployment-status is-' + tone}>{status}</span>
          </article>
        ))}
      </div>
    </motion.section>
  )
}
