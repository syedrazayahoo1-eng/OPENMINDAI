import { motion } from 'framer-motion'
import { CalendarCheck, FileText, Megaphone, MessageSquare, UserRoundCheck } from 'lucide-react'

const activity = [
  { time: '09:12', text: 'Sales AI replied to a priority customer', icon: MessageSquare, tone: 'gold' },
  { time: '09:18', text: 'HR AI approved a leave request', icon: CalendarCheck, tone: 'blue' },
  { time: '09:21', text: 'Attendance AI marked a team check-in', icon: UserRoundCheck, tone: 'green' },
  { time: '09:26', text: 'Marketing AI scheduled a campaign', icon: Megaphone, tone: 'purple' },
  { time: '09:31', text: 'Finance AI generated a report', icon: FileText, tone: 'gold' },
]

export default function AgentActivity() {
  return (
    <motion.aside
      className="dt-agents-activity"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="dt-agents-section-heading">
        <div>
          <p>LIVE SIGNALS</p>
          <h2>Agent Activity</h2>
        </div>
        <span><i /> Live</span>
      </header>
      <div className="dt-agents-activity-timeline">
        {activity.map(({ icon: Icon, text, time, tone }) => (
          <article key={time}>
            <time>{time}</time>
            <span className={'dt-agents-timeline-icon is-' + tone}><Icon size={16} strokeWidth={1.85} aria-hidden="true" /></span>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <button className="dt-agents-activity-link" type="button">View activity log</button>
    </motion.aside>
  )
}
