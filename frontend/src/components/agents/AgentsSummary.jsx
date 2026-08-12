import { motion } from 'framer-motion'
import { Bot, CircleCheck, ListTodo, Workflow } from 'lucide-react'

const summaries = [
  { label: 'Active Agents', value: '18', detail: '+3 today', icon: Bot, tone: 'green' },
  { label: 'Running Tasks', value: '1,284', detail: 'Across all departments', icon: ListTodo, tone: 'blue' },
  { label: 'Automations', value: '92', detail: 'Currently orchestrated', icon: Workflow, tone: 'gold' },
  { label: 'Success Rate', value: '99.8%', detail: 'Last 30 days', icon: CircleCheck, tone: 'green', ring: true },
]

export default function AgentsSummary() {
  return (
    <section className="dt-agents-summary-grid" aria-label="AI agent summary">
      {summaries.map(({ detail, icon: Icon, label, ring, tone, value }, index) => (
        <motion.article
          className="dt-agents-summary-card"
          key={label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.045, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="dt-agents-summary-top">
            <span className={'dt-agents-summary-icon is-' + tone}><Icon size={19} strokeWidth={1.85} aria-hidden="true" /></span>
            {ring ? <span className="dt-agents-success-ring"><i /></span> : <span className={'dt-agents-summary-indicator is-' + tone}><i /> Live</span>}
          </div>
          <p>{label}</p>
          <strong>{value}</strong>
          <small className={'is-' + tone}>{detail}</small>
        </motion.article>
      ))}
    </section>
  )
}
