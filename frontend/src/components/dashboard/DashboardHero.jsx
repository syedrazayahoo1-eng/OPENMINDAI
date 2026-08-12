import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, CheckCircle2, Sparkles } from 'lucide-react'

export default function DashboardHero() {
  return (
    <motion.section
      className="dt-dashboard-hero"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="dt-dashboard-hero-glow" aria-hidden="true" />
      <div className="dt-dashboard-hero-copy">
        <span className="dt-dashboard-hero-kicker"><Sparkles size={15} strokeWidth={1.9} aria-hidden="true" /> ENTERPRISE OPERATING SYSTEM</span>
        <h1>Good morning, <em>Sarah.</em></h1>
        <p>Your business is moving with purpose. Here&apos;s the complete picture across your people, customers, and AI operations.</p>
        <div className="dt-dashboard-hero-actions">
          <button className="dt-dashboard-primary-button" type="button">
            View daily brief
            <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
          </button>
          <span><CalendarDays size={16} strokeWidth={1.9} aria-hidden="true" /> Monday, 21 July</span>
        </div>
      </div>
      <div className="dt-dashboard-hero-status">
        <span className="dt-dashboard-hero-status-ring"><span>92<small>%</small></span></span>
        <div>
          <p>Business Health</p>
          <strong>Excellent</strong>
          <span><CheckCircle2 size={14} strokeWidth={2.2} aria-hidden="true" /> Performing above target</span>
        </div>
      </div>
    </motion.section>
  )
}
