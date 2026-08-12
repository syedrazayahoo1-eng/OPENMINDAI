import { AnimatePresence, motion } from 'framer-motion'
import { Building2, CalendarDays, CheckCircle2, Clock3, FileText, Mail, Phone, Sparkles, Users, X } from 'lucide-react'

function DetailRow({ icon: Icon, label, value }) {
  return (
    <p>
      <Icon size={14} strokeWidth={1.85} aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
    </p>
  )
}

export default function EmployeeLeaveDrawer({ leaveRequest, onClose }) {
  return (
    <AnimatePresence>
      {leaveRequest ? (
        <motion.div
          aria-modal="true"
          className="dt-leaves-drawer-backdrop"
          initial={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          transition={{ duration: 0.2 }}
        >
          <motion.aside
            className="dt-leaves-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            onClick={(event) => event.stopPropagation()}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <header>
              <div>
                <span className={'dt-leaves-drawer-avatar is-' + leaveRequest.tone}>{leaveRequest.initials}</span>
                <span>
                  <p>LEAVE REQUEST</p>
                  <h2>{leaveRequest.name}</h2>
                  <small>{leaveRequest.leaveType} / {leaveRequest.employeeId}</small>
                </span>
              </div>
              <button aria-label="Close leave request details" onClick={onClose} type="button"><X size={18} strokeWidth={2} aria-hidden="true" /></button>
            </header>

            <div className="dt-leaves-drawer-content">
              <section className="dt-leaves-drawer-score">
                <span><Sparkles size={16} strokeWidth={1.9} aria-hidden="true" /></span>
                <div>
                  <p>AI LEAVE SUMMARY</p>
                  <strong>Coverage remains safe for this request</strong>
                  <small>Low operational risk with an available backup owner.</small>
                </div>
              </section>

              <section>
                <h3>Employee details</h3>
                <div className="dt-leaves-drawer-details">
                  <DetailRow icon={Mail} label="Work email" value={leaveRequest.email} />
                  <DetailRow icon={Phone} label="Emergency contact" value={leaveRequest.emergencyContact} />
                  <DetailRow icon={Building2} label="Department" value={leaveRequest.department} />
                  <DetailRow icon={Users} label="Manager" value={leaveRequest.manager} />
                </div>
              </section>

              <section>
                <h3>Request details</h3>
                <div className="dt-leaves-drawer-details">
                  <DetailRow icon={CalendarDays} label="Leave type" value={leaveRequest.leaveType} />
                  <DetailRow icon={CalendarDays} label="Leave window" value={leaveRequest.from + ' - ' + leaveRequest.to} />
                  <DetailRow icon={Clock3} label="Status" value={leaveRequest.status} />
                </div>
                <p className="dt-leaves-request-reason"><strong>Reason</strong>{leaveRequest.reason}</p>
              </section>

              <section>
                <h3>Current leave balance</h3>
                <div className="dt-leaves-balance-grid">
                  <article><p>Annual</p><strong>{leaveRequest.balance.annual}</strong><small>Available</small></article>
                  <article><p>Sick</p><strong>{leaveRequest.balance.sick}</strong><small>Available</small></article>
                  <article><p>Casual</p><strong>{leaveRequest.balance.casual}</strong><small>Available</small></article>
                </div>
              </section>

              <section>
                <h3>Leave history</h3>
                <div className="dt-leaves-history">
                  <article><strong>Annual Leave</strong><span>12 Jun - 14 Jun 2026</span><small>Approved</small></article>
                  <article><strong>Casual Leave</strong><span>08 Apr - 09 Apr 2026</span><small>Approved</small></article>
                  <article><strong>Sick Leave</strong><span>15 Feb 2026</span><small>Approved</small></article>
                </div>
              </section>

              <section className="dt-leaves-manager-note">
                <span><Users size={15} strokeWidth={1.9} aria-hidden="true" /></span>
                <div>
                  <p>MANAGER NOTE</p>
                  <strong>{leaveRequest.managerNote}</strong>
                </div>
              </section>

              <section>
                <h3>Approval timeline</h3>
                <div className="dt-leaves-timeline">
                  {leaveRequest.timeline.map((item, index) => (
                    <article key={item}>
                      <span><CheckCircle2 size={13} strokeWidth={2} aria-hidden="true" /></span>
                      <div><strong>{item}</strong><small>{index === 0 ? 'Today, 09:12' : index === 1 ? 'Today, 09:20' : 'Pending update'}</small></div>
                    </article>
                  ))}
                </div>
              </section>

              <section>
                <h3>Attached documents</h3>
                <div className="dt-leaves-document-list">
                  <article><span><FileText size={14} strokeWidth={1.9} aria-hidden="true" /></span><div><strong>{leaveRequest.documents}</strong><small>{leaveRequest.documents === 'No attachment' ? 'No supporting document required' : 'Securely attached to request'}</small></div><i>{leaveRequest.documents === 'No attachment' ? 'Optional' : 'Attached'}</i></article>
                </div>
              </section>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
