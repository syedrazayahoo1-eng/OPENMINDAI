import { AnimatePresence, motion } from 'framer-motion'
import { Activity, Award, Building2, CalendarDays, CheckCircle2, FileText, Mail, MapPin, MessageSquare, Phone, Sparkles, TrendingUp, Users, X } from 'lucide-react'

function formatDate(value) {
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value + 'T00:00:00'))
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <p>
      <Icon size={14} strokeWidth={1.85} aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
    </p>
  )
}

export default function EmployeeDrawer({ employee, onClose }) {
  return (
    <AnimatePresence>
      {employee ? (
        <motion.div
          aria-modal="true"
          className="dt-employees-drawer-backdrop"
          initial={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          transition={{ duration: 0.2 }}
        >
          <motion.aside
            className="dt-employees-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            onClick={(event) => event.stopPropagation()}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <header>
              <div>
                <span className={'dt-employees-drawer-avatar is-' + employee.tone}>{employee.initials}</span>
                <span>
                  <p>EMPLOYEE PROFILE</p>
                  <h2>{employee.name}</h2>
                  <small>{employee.role} · {employee.id}</small>
                </span>
              </div>
              <button aria-label="Close employee profile" onClick={onClose} type="button"><X size={18} strokeWidth={2} aria-hidden="true" /></button>
            </header>

            <div className="dt-employees-drawer-content">
              <section className="dt-employees-drawer-score">
                <span><Sparkles size={16} strokeWidth={1.9} aria-hidden="true" /></span>
                <div>
                  <p>AI EMPLOYEE SUMMARY</p>
                  <strong>High contribution, stable engagement</strong>
                  <small>Profile confidence 96% · Strong manager alignment</small>
                </div>
              </section>

              <section>
                <h3>Personal information</h3>
                <div className="dt-employees-drawer-details">
                  <DetailRow icon={Mail} label="Work email" value={employee.email} />
                  <DetailRow icon={Phone} label="Phone" value={employee.phone} />
                  <DetailRow icon={MapPin} label="Office location" value={employee.location} />
                </div>
              </section>

              <section>
                <h3>Employment timeline</h3>
                <div className="dt-employees-timeline">
                  <article>
                    <span className="is-gold"><CheckCircle2 size={13} strokeWidth={2} aria-hidden="true" /></span>
                    <div><strong>Joined as {employee.role}</strong><small>{formatDate(employee.joiningDate)}</small></div>
                  </article>
                  <article>
                    <span className="is-blue"><Award size={13} strokeWidth={2} aria-hidden="true" /></span>
                    <div><strong>Completed 90-day review</strong><small>Rated strong contribution</small></div>
                  </article>
                  <article>
                    <span className="is-purple"><TrendingUp size={13} strokeWidth={2} aria-hidden="true" /></span>
                    <div><strong>Promoted to salary grade {employee.salaryGrade}</strong><small>Effective current cycle</small></div>
                  </article>
                  <article>
                    <span className="is-green"><Building2 size={13} strokeWidth={2} aria-hidden="true" /></span>
                    <div><strong>Moved to {employee.department}</strong><small>Reporting to {employee.manager}</small></div>
                  </article>
                </div>
              </section>

              <section>
                <h3>Employment details</h3>
                <div className="dt-employees-drawer-details">
                  <DetailRow icon={Building2} label="Department" value={employee.department} />
                  <DetailRow icon={Users} label="Manager" value={employee.manager} />
                  <DetailRow icon={CalendarDays} label="Joining date" value={formatDate(employee.joiningDate)} />
                  <DetailRow icon={TrendingUp} label="Salary grade" value={employee.salaryGrade} />
                </div>
              </section>

              <section>
                <h3>Attendance, leave and payroll</h3>
                <div className="dt-employees-profile-stats">
                  <article><p>Attendance</p><strong>96.8%</strong><small>Last 90 days</small></article>
                  <article><p>Leave balance</p><strong>14.5d</strong><small>Available</small></article>
                  <article><p>Payroll</p><strong>Ready</strong><small>Next cycle 31 Jul</small></article>
                </div>
              </section>

              <section>
                <h3>Documents</h3>
                <div className="dt-employees-document-list">
                  <article><span><FileText size={14} strokeWidth={1.9} aria-hidden="true" /></span><div><strong>Employment agreement</strong><small>Signed · 17 Apr 2023</small></div><i>Verified</i></article>
                  <article><span><FileText size={14} strokeWidth={1.9} aria-hidden="true" /></span><div><strong>Identity documentation</strong><small>Updated · 12 Jan 2026</small></div><i>Verified</i></article>
                  <article><span><FileText size={14} strokeWidth={1.9} aria-hidden="true" /></span><div><strong>Performance notes</strong><small>Last review · 03 Jul 2026</small></div><i>Current</i></article>
                </div>
              </section>

              <section>
                <h3>Recent activities</h3>
                <div className="dt-employees-activity-list">
                  <article><span><Activity size={13} strokeWidth={1.9} aria-hidden="true" /></span><div><strong>Logged attendance</strong><small>Checked in on time today</small></div></article>
                  <article><span><MessageSquare size={13} strokeWidth={1.9} aria-hidden="true" /></span><div><strong>Manager 1:1 completed</strong><small>Notes added to performance file · 2 days ago</small></div></article>
                  <article><span><FileText size={13} strokeWidth={1.9} aria-hidden="true" /></span><div><strong>Uploaded identity documentation</strong><small>Verified by People Ops · 12 Jan 2026</small></div></article>
                </div>
              </section>

              <section className="dt-employees-performance-note">
                <span><TrendingUp size={15} strokeWidth={1.9} aria-hidden="true" /></span>
                <div>
                  <p>PERFORMANCE NOTE</p>
                  <strong>Consistently achieves goals and creates clarity across functions.</strong>
                </div>
              </section>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
