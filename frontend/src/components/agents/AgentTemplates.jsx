import { motion } from 'framer-motion'
import { CalendarCheck, DollarSign, FileText, Megaphone, MessageSquare, UserPlus, Users } from 'lucide-react'

const templates = [
  { name: 'Sales Assistant', description: 'Qualifies leads and keeps revenue conversations moving.', icon: DollarSign, tone: 'gold' },
  { name: 'HR Manager', description: 'Handles employee requests, policies and people operations.', icon: Users, tone: 'blue' },
  { name: 'Support Bot', description: 'Resolves customer questions with enterprise context.', icon: MessageSquare, tone: 'green' },
  { name: 'CRM Agent', description: 'Enriches records and surfaces your highest intent leads.', icon: UserPlus, tone: 'purple' },
  { name: 'Attendance Agent', description: 'Tracks check-ins and publishes daily workforce summaries.', icon: CalendarCheck, tone: 'blue' },
  { name: 'Marketing Agent', description: 'Plans, coordinates and schedules campaigns at speed.', icon: Megaphone, tone: 'gold' },
  { name: 'Invoice Agent', description: 'Prepares invoice data and flags exceptions for review.', icon: FileText, tone: 'green' },
]

export default function AgentTemplates({ onCreateAgent }) {
  return (
    <section className="dt-agents-templates">
      <div className="dt-agents-section-heading">
        <div>
          <p>START WITH A BLUEPRINT</p>
          <h2>Agent Templates</h2>
        </div>
        <button onClick={onCreateAgent} type="button">Browse library</button>
      </div>
      <div className="dt-agents-template-grid">
        {templates.map(({ description, icon: Icon, name, tone }, index) => (
          <motion.article
            className="dt-agents-template-card"
            key={name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={'dt-agents-template-icon is-' + tone}><Icon size={23} strokeWidth={1.8} aria-hidden="true" /></span>
            <h3>{name}</h3>
            <p>{description}</p>
            <button onClick={onCreateAgent} type="button">Deploy template</button>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
