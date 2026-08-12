import { motion } from 'framer-motion'
import { ArrowRight, Frown, MessageSquare, Sparkles, ThumbsUp, TrendingUp, Wand2 } from 'lucide-react'

const negativeReviews = [
  { name: 'Olivia Davis', detail: '1★ · order was wrong, escalated', tone: 'gold' },
  { name: 'Alexander White', detail: '1★ · 40 min wait, needs refund', tone: 'blue' },
]

const recommendations = [
  { text: 'Reply to 3 negative reviews before end of day.', icon: Frown },
  { text: 'Promote Isabella Anderson\u2019s 5★ review on social.', icon: ThumbsUp },
]

const trendingTopics = ['Delivery speed', 'Staff friendliness', 'Pricing', 'Order accuracy']

export default function ReviewsAssistant() {
  return (
    <motion.aside
      className="dt-reviews-assistant"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="dt-reviews-assistant-glow" aria-hidden="true" />
      <header className="dt-reviews-assistant-head">
        <span><Sparkles size={22} strokeWidth={1.85} aria-hidden="true" /></span>
        <div>
          <p>DIGITECH AI</p>
          <h2>Reputation Insights</h2>
        </div>
        <small><i /> Live</small>
      </header>

      <section className="dt-reviews-assistant-section">
        <div className="dt-reviews-assistant-title"><p>Today&apos;s Reputation Summary</p><TrendingUp size={15} strokeWidth={1.9} aria-hidden="true" /></div>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.62rem', fontWeight: 620, lineHeight: 1.5, color: 'var(--dt-dashboard-grey, #5f6673)' }}>
          Sentiment is up 4% today with 72% positive reviews. Customer satisfaction score holds steady at 4.7/5.
        </p>
      </section>

      <section className="dt-reviews-assistant-section">
        <div className="dt-reviews-assistant-title"><p>Negative Reviews Needing Attention</p></div>
        {negativeReviews.map((item) => (
          <article className="dt-reviews-followup" key={item.name}>
            <span className={'is-' + item.tone}>{item.name.slice(0, 1)}</span>
            <div><strong>{item.name}</strong><p>{item.detail}</p></div>
            <button aria-label={'Open ' + item.name} type="button"><ArrowRight size={15} strokeWidth={2} aria-hidden="true" /></button>
          </article>
        ))}
      </section>

      <section className="dt-reviews-assistant-section">
        <div className="dt-reviews-assistant-title"><p>AI Suggested Replies</p><button type="button">View all</button></div>
        {recommendations.map(({ icon: Icon, text }) => (
          <article className="dt-reviews-recommendation" key={text}>
            <span><Icon size={16} strokeWidth={1.85} aria-hidden="true" /></span>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="dt-reviews-priority-card">
        <div><MessageSquare size={18} strokeWidth={1.85} aria-hidden="true" /></div>
        <span>
          <p>CUSTOMER SATISFACTION</p>
          <strong>236 replies pending today</strong>
        </span>
        <button type="button">Review</button>
      </section>

      <section className="dt-reviews-assistant-meta">
        <article><span><TrendingUp size={16} strokeWidth={1.9} aria-hidden="true" /></span><div><p>Trending Topics</p><strong>{trendingTopics.join(', ')}</strong></div></article>
        <article><span><ThumbsUp size={16} strokeWidth={1.9} aria-hidden="true" /></span><div><p>Positive to Promote</p><strong>18 reviews this week</strong></div></article>
      </section>

      <button className="dt-reviews-assistant-open" type="button"><Wand2 size={17} strokeWidth={2} aria-hidden="true" /> Open AI Reputation Assistant <ArrowRight size={17} strokeWidth={2} aria-hidden="true" /></button>
    </motion.aside>
  )
}
