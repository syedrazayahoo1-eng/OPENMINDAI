import { motion } from 'framer-motion'
import { BadgeCheck, CalendarDays, Plus, Sparkles } from 'lucide-react'

export default function LeaveHeader({ onApplyLeave }) {
  return (
    <motion.header
      className="dt-leaves-header"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="dt-leaves-header-glow" aria-hidden="true" />
      <div className="dt-leaves-header-copy">
        <span><Sparkles size={13} strokeWidth={2} aria-hidden="true" /> TIME AND LEAVE</span>
        <h1>Leave <em>Management</em></h1>
        <p>Track employee leave requests, approvals, balances and AI recommendations.</p>
      </div>
      <div className="dt-leaves-header-status">
        <span><BadgeCheck size={18} strokeWidth={1.9} aria-hidden="true" /></span>
        <div>
          <small>TEAM COVERAGE</small>
          <strong>Coverage healthy across teams</strong>
          <p><i aria-hidden="true" /> 9 colleagues on planned leave</p>
        </div>
      </div>
      <button className="dt-leaves-apply-button" onClick={onApplyLeave} type="button">
        <Plus size={17} strokeWidth={2.25} aria-hidden="true" />
        Apply Leave
      </button>
      <span className="dt-leaves-header-calendar" aria-hidden="true"><CalendarDays size={22} strokeWidth={1.45} /></span>
    </motion.header>
  )
}
