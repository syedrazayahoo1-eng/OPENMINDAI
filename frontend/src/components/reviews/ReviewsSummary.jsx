import { motion } from 'framer-motion'
import { AlarmClock, Frown, Smile, Sparkles, Star, Users } from 'lucide-react'

const summaryItems = [
  { label: 'Overall Rating', value: '4.7', detail: '+0.2 vs last month', icon: Star, tone: 'gold' },
  { label: 'Total Reviews', value: '14,862', detail: '+18% this month', icon: Users, tone: 'blue' },
  { label: 'Positive Reviews', value: '72%', detail: '10,700 reviews', icon: Smile, tone: 'green' },
  { label: 'Negative Reviews', value: '10%', detail: '1,486 reviews', icon: Frown, tone: 'purple' },
  { label: 'Pending Replies', value: '236', detail: 'Awaiting response', icon: AlarmClock, tone: 'gold' },
  { label: 'AI Reputation Score', value: '91.4', detail: 'Excellent standing', icon: Sparkles, tone: 'green' },
]

export default function ReviewsSummary() {
  return (
    <section className="dt-reviews-summary-grid" aria-label="Reviews and reputation summary">
      {summaryItems.map(({ detail, icon: Icon, label, tone, value }, index) => (
        <motion.article
          className="dt-reviews-summary-card"
          key={label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <span className={'dt-reviews-summary-icon is-' + tone}><Icon size={19} strokeWidth={1.85} aria-hidden="true" /></span>
            <span className={'dt-reviews-summary-live is-' + tone}><i /> Live</span>
          </div>
          <p>{label}</p>
          <strong>{value}</strong>
          <small className={'is-' + tone}>{detail}</small>
        </motion.article>
      ))}
    </section>
  )
}
