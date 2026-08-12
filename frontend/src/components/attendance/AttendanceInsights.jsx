import { motion } from 'framer-motion'
import { ArrowRight, CircleAlert, Clock3, Sparkles, TrendingUp, UserCheck } from 'lucide-react'

const insights = [
  { title: '11 employees checked in late', detail: 'Most delays were under 15 minutes.', icon: Clock3, tone: 'orange' },
  { title: 'Ethan Williams has the longest day', detail: '8h 57m of focused work so far.', icon: TrendingUp, tone: 'gold' },
  { title: '4 check-outs need confirmation', detail: 'AI detected incomplete shift records.', icon: CircleAlert, tone: 'blue' },
]

export default function AttendanceInsights() {
  return (
    <motion.aside
      className="dt-attendance-insights"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="dt-attendance-insights-glow" aria-hidden="true" />
      <header className="dt-attendance-insights-head">
        <span><Sparkles size={22} strokeWidth={1.85} aria-hidden="true" /></span>
        <div><p>DIGITECH AI</p><h2>Attendance Insights</h2></div>
        <small><i /> Live</small>
      </header>

      <section className="dt-attendance-trend-card">
        <span><TrendingUp size={18} strokeWidth={1.85} aria-hidden="true" /></span>
        <div><p>ATTENDANCE TREND</p><strong>+2.4% this month</strong><small>Consistency is improving across teams.</small></div>
      </section>

      <section className="dt-attendance-insight-list">
        <div><p>AI Suggestions</p><button type="button">View all</button></div>
        {insights.map(({ detail, icon: Icon, title, tone }) => (
          <article key={title}>
            <span className={'is-' + tone}><Icon size={16} strokeWidth={1.85} aria-hidden="true" /></span>
            <div><strong>{title}</strong><p>{detail}</p></div>
          </article>
        ))}
      </section>

      <section className="dt-attendance-today-summary">
        <span><UserCheck size={18} strokeWidth={1.85} aria-hidden="true" /></span>
        <div><p>TODAY&apos;S SUMMARY</p><strong>142 present · 34 remote · 9 on leave</strong></div>
      </section>

      <button className="dt-attendance-insights-open" type="button">Open attendance report <ArrowRight size={17} strokeWidth={2} aria-hidden="true" /></button>
    </motion.aside>
  )
}
