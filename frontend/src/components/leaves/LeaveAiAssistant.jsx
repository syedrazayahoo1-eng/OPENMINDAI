import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, CircleAlert, FileCheck2, Sparkles, TrendingUp, Users } from 'lucide-react'

const insightItems = [
  {
    copy: '6 requests need an approver decision before the end of today.',
    icon: CircleAlert,
    title: 'Pending approvals',
    tone: 'orange',
  },
  {
    copy: 'Independence Day is the next company holiday on 15 August.',
    icon: CalendarDays,
    title: 'Upcoming holidays',
    tone: 'gold',
  },
  {
    copy: 'Revenue has 3 overlapping leave requests in the final week of July.',
    icon: Users,
    title: 'Coverage alert',
    tone: 'blue',
  },
  {
    copy: 'Annual leave utilization is rising at a healthy, planned pace.',
    icon: TrendingUp,
    title: 'Leave trend insight',
    tone: 'purple',
  },
]

export default function LeaveAiAssistant() {
  return (
    <motion.aside
      className="dt-leaves-insights"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="dt-leaves-insights-glow" aria-hidden="true" />
      <header className="dt-leaves-insights-head">
        <span><Sparkles size={17} strokeWidth={1.9} aria-hidden="true" /></span>
        <div>
          <p>AI LEAVE ASSISTANT</p>
          <h2>Coverage intelligence</h2>
        </div>
        <small><i aria-hidden="true" /> Online</small>
      </header>

      <article className="dt-leaves-trend-card">
        <span><CalendarDays size={16} strokeWidth={1.9} aria-hidden="true" /></span>
        <div>
          <p>TODAY'S LEAVE SUMMARY</p>
          <strong>9 people away, 96% coverage maintained</strong>
          <small>Most teams have at least two cross-trained coverage owners.</small>
        </div>
      </article>

      <div className="dt-leaves-insight-list">
        <div>
          <p>PRIORITY QUEUE</p>
          <button type="button">View all</button>
        </div>
        {insightItems.map(({ copy, icon: Icon, title, tone }) => (
          <article key={title}>
            <span className={'is-' + tone}><Icon size={14} strokeWidth={1.9} aria-hidden="true" /></span>
            <div>
              <strong>{title}</strong>
              <p>{copy}</p>
            </div>
          </article>
        ))}
      </div>

      <article className="dt-leaves-recommendation-card">
        <span><FileCheck2 size={15} strokeWidth={1.9} aria-hidden="true" /></span>
        <div>
          <p>AI RECOMMENDATION</p>
          <strong>Approve Maya's remote request; Growth coverage remains clear.</strong>
        </div>
      </article>
      <button className="dt-leaves-insights-open" type="button">Open leave command center <ArrowRight size={15} strokeWidth={2} aria-hidden="true" /></button>
    </motion.aside>
  )
}
