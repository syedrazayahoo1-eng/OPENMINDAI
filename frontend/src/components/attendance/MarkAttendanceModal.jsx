import { AnimatePresence, motion } from 'framer-motion'
import { CalendarCheck, Sparkles, X } from 'lucide-react'

export default function MarkAttendanceModal({ isOpen, onClose }) {
  const submit = (event) => {
    event.preventDefault()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="dt-attendance-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.section
            aria-labelledby="mark-attendance-title"
            aria-modal="true"
            className="dt-attendance-modal"
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <header>
              <div><span><CalendarCheck size={21} strokeWidth={1.85} aria-hidden="true" /></span><div><p>LIVE WORKFORCE RECORD</p><h2 id="mark-attendance-title">Mark Attendance</h2></div></div>
              <button aria-label="Close mark attendance modal" onClick={onClose} type="button"><X size={20} strokeWidth={1.9} aria-hidden="true" /></button>
            </header>
            <form onSubmit={submit}>
              <div className="dt-attendance-modal-grid">
                <label><span>Employee</span><select defaultValue=""><option disabled value="">Select employee</option><option>Aarav Mehta</option><option>Maya Rodriguez</option><option>Oliver Chen</option></select></label>
                <label><span>Department</span><select defaultValue=""><option disabled value="">Select department</option><option>Revenue</option><option>Growth</option><option>People</option><option>Finance</option><option>Operations</option></select></label>
                <label><span>Date</span><input defaultValue="2026-07-21" type="date" /></label>
                <label><span>Attendance Type</span><select defaultValue="Office"><option>Office</option><option>Remote</option><option>Hybrid</option></select></label>
                <label><span>Check In Time</span><input type="time" /></label>
                <label><span>Check Out Time</span><input type="time" /></label>
                <label><span>Location</span><select defaultValue="Bengaluru HQ"><option>Bengaluru HQ</option><option>Remote</option><option>Mumbai Office</option><option>Hyderabad Office</option></select></label>
                <label><span>Status</span><select defaultValue="Present"><option>Present</option><option>Absent</option><option>Late</option><option>Leave</option><option>Remote</option></select></label>
              </div>
              <label className="dt-attendance-modal-notes"><span>Notes</span><textarea placeholder="Add shift notes, location context or attendance details…" rows="4" /></label>
              <footer><button className="dt-attendance-modal-cancel" onClick={onClose} type="button">Cancel</button><button className="dt-attendance-modal-submit" type="submit"><Sparkles size={17} strokeWidth={1.9} aria-hidden="true" /> Save Attendance</button></footer>
            </form>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
