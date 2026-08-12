import { AnimatePresence, motion } from 'framer-motion'
import { Briefcase, CalendarDays, Clock3, FileText, MapPin, ShieldCheck, StickyNote, UserRound, X } from 'lucide-react'

const history = [
  { day: 'Mon, 21 Jul', in: '09:02', out: '18:18', hours: '8h 46m' },
  { day: 'Fri, 18 Jul', in: '08:56', out: '17:46', hours: '8h 50m' },
  { day: 'Thu, 17 Jul', in: '09:10', out: '18:08', hours: '8h 58m' },
]

export default function EmployeeDrawer({ employee, onClose }) {
  return (
    <AnimatePresence>
      {employee ? (
        <motion.div
          className="dt-attendance-drawer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.aside
            aria-label={employee.name + ' attendance profile'}
            className="dt-attendance-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            onMouseDown={(event) => event.stopPropagation()}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <header>
              <div>
                <span className={'dt-attendance-drawer-avatar is-' + employee.tone}>{employee.initials}</span>
                <div><p>EMPLOYEE PROFILE</p><h2>{employee.name}</h2><small>{employee.id} · {employee.department}</small></div>
              </div>
              <button aria-label="Close employee profile" onClick={onClose} type="button"><X size={20} strokeWidth={1.9} aria-hidden="true" /></button>
            </header>

            <div className="dt-attendance-drawer-content">
              <section className="dt-attendance-drawer-score">
                <span><ShieldCheck size={17} strokeWidth={1.9} aria-hidden="true" /></span>
                <div><p>AI ATTENDANCE ANALYSIS</p><strong>Excellent consistency</strong><small>96% reliability over the last 30 days</small></div>
              </section>

              <section>
                <h3>Employee Information</h3>
                <div className="dt-attendance-drawer-details">
                  <p><UserRound size={15} strokeWidth={1.9} aria-hidden="true" /><span>Employee ID</span><strong>{employee.id}</strong></p>
                  <p><Briefcase size={15} strokeWidth={1.9} aria-hidden="true" /><span>Department</span><strong>{employee.department}</strong></p>
                  <p><MapPin size={15} strokeWidth={1.9} aria-hidden="true" /><span>Location</span><strong>{employee.location}</strong></p>
                  <p><Clock3 size={15} strokeWidth={1.9} aria-hidden="true" /><span>Today&apos;s Hours</span><strong>{employee.hours}</strong></p>
                </div>
              </section>

              <section>
                <h3>Attendance History</h3>
                <div className="dt-attendance-history">
                  {history.map((item) => (
                    <article key={item.day}>
                      <strong>{item.day}</strong>
                      <span>{item.in} — {item.out}</span>
                      <small>{item.hours}</small>
                    </article>
                  ))}
                </div>
              </section>

              <section className="dt-attendance-hours-grid">
                <article><Clock3 size={16} strokeWidth={1.9} aria-hidden="true" /><span><p>Weekly Hours</p><strong>42h 18m</strong></span></article>
                <article><CalendarDays size={16} strokeWidth={1.9} aria-hidden="true" /><span><p>Monthly Hours</p><strong>168h 42m</strong></span></article>
                <article><CalendarDays size={16} strokeWidth={1.9} aria-hidden="true" /><span><p>Leave Balance</p><strong>14 days</strong></span></article>
                <article><FileText size={16} strokeWidth={1.9} aria-hidden="true" /><span><p>Documents</p><strong>8 records</strong></span></article>
                <article><StickyNote size={16} strokeWidth={1.9} aria-hidden="true" /><span><p>Recent Check-outs</p><strong>3 confirmed</strong></span></article>
              </section>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
