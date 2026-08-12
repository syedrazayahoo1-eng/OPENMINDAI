import { motion } from 'framer-motion'
import { CalendarCheck, Plus, Sparkles } from 'lucide-react'

export default function AttendanceHeader({ onMarkAttendance }) {
  return (
    <motion.section
      className="dt-attendance-header"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="dt-attendance-header-glow" aria-hidden="true" />
      <div className="dt-attendance-header-copy">
        <span><Sparkles size={15} strokeWidth={1.9} aria-hidden="true" /> ENTERPRISE WORKFORCE INTELLIGENCE</span>
        <h1>Attendance <em>Management</em></h1>
        <p>Monitor employee attendance, shifts, working hours and AI insights.</p>
      </div>
      <div className="dt-attendance-header-status">
        <span><CalendarCheck size={20} strokeWidth={1.85} aria-hidden="true" /></span>
        <div>
          <small>WORKFORCE STATUS</small>
          <strong>91.0% present today</strong>
          <p><i /> Live attendance feed active</p>
        </div>
      </div>
      <button className="dt-attendance-mark-button" onClick={onMarkAttendance} type="button">
        <Plus size={18} strokeWidth={2.2} aria-hidden="true" />
        Mark Attendance
      </button>
    </motion.section>
  )
}
