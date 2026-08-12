import { motion } from 'framer-motion'
import { ArrowRight, GraduationCap, ShieldAlert, Sparkles, TrendingUp, UserRoundCheck, UserRoundSearch } from 'lucide-react'

const insightItems = [
  {
    copy: 'Liam Brooks and two others have missed attendance twice this week.',
    icon: ShieldAlert,
    title: 'Attendance issues',
    tone: 'orange',
  },
  {
    copy: 'Sofia Turner has taken leave 3 Fridays in a row — worth a quick check-in.',
    icon: UserRoundSearch,
    title: 'Leave anomalies',
    tone: 'purple',
  },
  {
    copy: 'Oliver Chen and Anika Shah are approaching their 90-day probation review.',
    icon: UserRoundCheck,
    title: 'Probation alerts',
    tone: 'blue',
  },
  {
    copy: 'Aarav Mehta, Priya Nair and Maya Rodriguez lead this quarter\u2019s scorecards.',
    icon: TrendingUp,
    title: 'Top performers',
    tone: 'gold',
  },
]

export default function HrAiAssistant() {
  return (
    <motion.aside
      className="dt-employees-insights"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="dt-employees-insights-glow" aria-hidden="true" />
      <header className="dt-employees-insights-head">
        <span><Sparkles size={17} strokeWidth={1.9} aria-hidden="true" /></span>
        <div>
          <p>HR AI ASSISTANT</p>
          <h2>Workforce intelligence</h2>
        </div>
        <small><i aria-hidden="true" /> Online</small>
      </header>

      <article className="dt-employees-trend-card">
        <span><ShieldAlert size={16} strokeWidth={1.9} aria-hidden="true" /></span>
        <div>
          <p>EMPLOYEES NEEDING ATTENTION</p>
          <strong>3 profiles flagged this week</strong>
          <small>Attendance gaps and leave patterns worth a manager check-in.</small>
        </div>
      </article>

      <div className="dt-employees-insight-list">
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

      <article className="dt-employees-promotion-card">
        <span><Sparkles size={15} strokeWidth={1.9} aria-hidden="true" /></span>
        <div>
          <p>SUGGESTED PROMOTIONS</p>
          <strong>3 employees show sustained leadership signals.</strong>
        </div>
      </article>

      <article className="dt-employees-promotion-card is-training">
        <span><GraduationCap size={15} strokeWidth={1.9} aria-hidden="true" /></span>
        <div>
          <p>SUGGESTED TRAINING</p>
          <strong>Engineering team would benefit from a systems-design workshop.</strong>
        </div>
      </article>

      <button className="dt-employees-insights-open" type="button">Open HR command center <ArrowRight size={15} strokeWidth={2} aria-hidden="true" /></button>
    </motion.aside>
  )
}
