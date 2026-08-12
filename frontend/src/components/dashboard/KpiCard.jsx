import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'

export default function KpiCard({ accent, change, changeLabel, icon: Icon, index, label, trend, value }) {
  const highest = Math.max(...trend)
  const lowest = Math.min(...trend)
  const range = Math.max(highest - lowest, 1)
  const trendPoints = trend
    .map((point, pointIndex) => {
      const x = (pointIndex / Math.max(trend.length - 1, 1)) * 100
      const y = 37 - ((point - lowest) / range) * 27
      return x + ',' + y
    })
    .join(' ')
  const isPositive = !change.startsWith('-')
  const cardStyle = { '--dt-dashboard-kpi-accent': accent }

  return (
    <motion.article
      className="dt-dashboard-kpi-card"
      style={cardStyle}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.045, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="dt-dashboard-kpi-card-top">
        <span className="dt-dashboard-kpi-icon"><Icon size={19} strokeWidth={1.85} aria-hidden="true" /></span>
        <span className={'dt-dashboard-kpi-change' + (isPositive ? ' is-positive' : ' is-negative')}>
          {isPositive ? <TrendingUp size={13} strokeWidth={2.2} aria-hidden="true" /> : <TrendingDown size={13} strokeWidth={2.2} aria-hidden="true" />}
          {change}
        </span>
      </div>
      <p>{label}</p>
      <strong>{value}</strong>
      <div className="dt-dashboard-kpi-card-bottom">
        <span>{changeLabel}</span>
        <svg viewBox="0 0 100 42" preserveAspectRatio="none" aria-hidden="true">
          <path d={'M0,42 L' + trendPoints + ' L100,42 Z'} fill="var(--dt-dashboard-kpi-accent)" fillOpacity="0.1" />
          <polyline fill="none" points={trendPoints} stroke="var(--dt-dashboard-kpi-accent)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" />
        </svg>
      </div>
    </motion.article>
  )
}
