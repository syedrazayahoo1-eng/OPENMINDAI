import { motion } from 'framer-motion'
import { Check, Eye, History, MoreHorizontal, X } from 'lucide-react'

const leaveRequests = [
  {
    approver: 'Jonathan Reed',
    balance: { annual: '14.5 days', casual: '4 days', sick: '8 days' },
    department: 'Revenue',
    documents: 'Travel itinerary.pdf',
    email: 'aarav.mehta@digitech.ai',
    employeeId: 'EM-1048',
    emergencyContact: '+91 98765 10480',
    from: 'Jul 25, 2026',
    initials: 'AM',
    leaveType: 'Annual Leave',
    managerNote: 'Client handover is scheduled before the leave window.',
    manager: 'Jonathan Reed',
    name: 'Aarav Mehta',
    reason: 'Family travel and personal time off.',
    status: 'Pending',
    timeline: ['Request submitted', 'Manager review pending', 'People Ops notification queued'],
    to: 'Jul 29, 2026',
    tone: 'gold',
  },
  {
    approver: 'Elena Ortiz',
    balance: { annual: '11 days', casual: '5 days', sick: '8 days' },
    department: 'Growth',
    documents: 'No attachment',
    email: 'maya.rodriguez@digitech.ai',
    employeeId: 'EM-1021',
    emergencyContact: '+1 415 555 0188',
    from: 'Jul 21, 2026',
    initials: 'MR',
    leaveType: 'Work From Home',
    managerNote: 'Remote coverage plan is confirmed with the campaign team.',
    manager: 'Elena Ortiz',
    name: 'Maya Rodriguez',
    reason: 'Focused campaign planning from home.',
    status: 'Approved',
    timeline: ['Request submitted', 'Approved by Elena Ortiz', 'Calendar updated'],
    to: 'Jul 23, 2026',
    tone: 'purple',
  },
  {
    approver: 'Marcus Cole',
    balance: { annual: '16 days', casual: '3 days', sick: '6 days' },
    department: 'Engineering',
    documents: 'Medical certificate.pdf',
    email: 'oliver.chen@digitech.ai',
    employeeId: 'EM-1094',
    emergencyContact: '+91 99887 10940',
    from: 'Jul 17, 2026',
    initials: 'OC',
    leaveType: 'Sick Leave',
    managerNote: 'Team release responsibilities reassigned for the day.',
    manager: 'Marcus Cole',
    name: 'Oliver Chen',
    reason: 'Medical recovery and rest.',
    status: 'Approved',
    timeline: ['Request submitted', 'Medical document reviewed', 'Approved by Marcus Cole'],
    to: 'Jul 18, 2026',
    tone: 'blue',
  },
  {
    approver: 'Elena Ortiz',
    balance: { annual: '18 days', casual: '5 days', sick: '8 days' },
    department: 'People',
    documents: 'No attachment',
    email: 'priya.nair@digitech.ai',
    employeeId: 'EM-1017',
    emergencyContact: '+91 98480 10170',
    from: 'Aug 04, 2026',
    initials: 'PN',
    leaveType: 'Casual Leave',
    managerNote: 'A critical onboarding review falls within the requested dates.',
    manager: 'Elena Ortiz',
    name: 'Priya Nair',
    reason: 'Personal appointment.',
    status: 'Rejected',
    timeline: ['Request submitted', 'Coverage conflict identified', 'Request declined with note'],
    to: 'Aug 05, 2026',
    tone: 'green',
  },
  {
    approver: 'Jonathan Reed',
    balance: { annual: '20 days', casual: '5 days', sick: '8 days' },
    department: 'Finance',
    documents: 'Maternity plan.pdf',
    email: 'sofia.turner@digitech.ai',
    employeeId: 'EM-1062',
    emergencyContact: '+44 20 7946 1062',
    from: 'Aug 10, 2026',
    initials: 'ST',
    leaveType: 'Maternity',
    managerNote: 'Finance continuity plan has been approved.',
    manager: 'Jonathan Reed',
    name: 'Sofia Turner',
    reason: 'Planned parental leave.',
    status: 'Approved',
    timeline: ['Leave plan submitted', 'Coverage approved', 'Payroll informed'],
    to: 'Nov 10, 2026',
    tone: 'gold',
  },
  {
    approver: 'Marcus Cole',
    balance: { annual: '9 days', casual: '3 days', sick: '7 days' },
    department: 'Operations',
    documents: 'No attachment',
    email: 'ethan.williams@digitech.ai',
    employeeId: 'EM-1054',
    emergencyContact: '+1 646 555 1054',
    from: 'Jul 29, 2026',
    initials: 'EW',
    leaveType: 'Work From Home',
    managerNote: 'Shift coverage is pending confirmation.',
    manager: 'Marcus Cole',
    name: 'Ethan Williams',
    reason: 'Home appointment and remote operations coverage.',
    status: 'Pending',
    timeline: ['Request submitted', 'Operations coverage review pending', 'Manager notification sent'],
    to: 'Jul 30, 2026',
    tone: 'blue',
  },
  {
    approver: 'Priya Nair',
    balance: { annual: '12 days', casual: '4 days', sick: '8 days' },
    department: 'Customer Success',
    documents: 'No attachment',
    email: 'anika.shah@digitech.ai',
    employeeId: 'EM-1118',
    emergencyContact: '+91 99001 11180',
    from: 'Sep 14, 2026',
    initials: 'AS',
    leaveType: 'Annual Leave',
    managerNote: 'Employee withdrew the request after the delivery timeline changed.',
    manager: 'Priya Nair',
    name: 'Anika Shah',
    reason: 'Personal travel.',
    status: 'Cancelled',
    timeline: ['Request submitted', 'Request cancelled by employee', 'Calendar hold removed'],
    to: 'Sep 18, 2026',
    tone: 'purple',
  },
  {
    approver: 'Jonathan Reed',
    balance: { annual: '15 days', casual: '5 days', sick: '8 days' },
    department: 'Revenue',
    documents: 'Birth certificate.pdf',
    email: 'liam.brooks@digitech.ai',
    employeeId: 'EM-1086',
    emergencyContact: '+44 20 7946 1086',
    from: 'Oct 12, 2026',
    initials: 'LB',
    leaveType: 'Paternity',
    managerNote: 'Revenue pod coverage has been planned across the leave period.',
    manager: 'Jonathan Reed',
    name: 'Liam Brooks',
    reason: 'Planned parental leave.',
    status: 'Approved',
    timeline: ['Leave plan submitted', 'Manager approved', 'People Ops confirmed'],
    to: 'Oct 23, 2026',
    tone: 'green',
  },
]

function dateRangeFor(from) {
  return from.slice(0, 8) + '2026'
}

function statusClass(status) {
  return status.toLowerCase()
}

function typeClass(type) {
  return type.toLowerCase().replaceAll(' ', '-')
}

function matchesValue(filterValue, recordValue) {
  return filterValue === 'all' || filterValue === recordValue
}

function LeaveActions({ leaveRequest, onView }) {
  return (
    <div className="dt-leaves-table-actions">
      <button aria-label={'View ' + leaveRequest.name + ' leave request'} onClick={() => onView(leaveRequest)} type="button"><Eye size={15} strokeWidth={1.9} aria-hidden="true" /></button>
      <button aria-label={'Approve ' + leaveRequest.name + ' leave request'} onClick={() => onView(leaveRequest)} type="button"><Check size={14} strokeWidth={2} aria-hidden="true" /></button>
      <button aria-label={'Reject ' + leaveRequest.name + ' leave request'} onClick={() => onView(leaveRequest)} type="button"><X size={14} strokeWidth={2} aria-hidden="true" /></button>
      <button aria-label={'View history for ' + leaveRequest.name} onClick={() => onView(leaveRequest)} type="button"><History size={14} strokeWidth={1.9} aria-hidden="true" /></button>
      <button aria-label={'More actions for ' + leaveRequest.name} type="button"><MoreHorizontal size={16} strokeWidth={1.9} aria-hidden="true" /></button>
    </div>
  )
}

export default function LeaveRequestTable({ filters, onView, search }) {
  const normalizedSearch = search.trim().toLowerCase()
  const visibleRequests = leaveRequests.filter((leaveRequest) => {
    const searchMatches = !normalizedSearch || [
      leaveRequest.department,
      leaveRequest.employeeId,
      leaveRequest.leaveType,
      leaveRequest.manager,
      leaveRequest.name,
    ].some((value) => value.toLowerCase().includes(normalizedSearch))

    return searchMatches
      && matchesValue(filters.department, leaveRequest.department)
      && matchesValue(filters.leaveType, leaveRequest.leaveType)
      && matchesValue(filters.status, leaveRequest.status)
      && matchesValue(filters.dateRange, dateRangeFor(leaveRequest.from))
      && matchesValue(filters.manager, leaveRequest.manager)
  })

  return (
    <motion.section
      className="dt-leaves-table-card"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="dt-leaves-section-heading">
        <div>
          <p>LEAVE REQUESTS</p>
          <h2>Every request, approval and coverage decision.</h2>
        </div>
        <button type="button">Export report</button>
      </header>
      <div className="dt-leaves-table-scroll">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Employee ID</th>
              <th>Department</th>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Status</th>
              <th>Approver</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {visibleRequests.map((leaveRequest) => (
              <tr key={leaveRequest.employeeId + leaveRequest.from}>
                <td data-label="Employee"><span className={'dt-leaves-avatar is-' + leaveRequest.tone}>{leaveRequest.initials}</span><strong>{leaveRequest.name}</strong></td>
                <td data-label="Employee ID"><span className="dt-leaves-id">{leaveRequest.employeeId}</span></td>
                <td data-label="Department"><span className="dt-leaves-department">{leaveRequest.department}</span></td>
                <td data-label="Leave Type"><span className={'dt-leaves-type is-' + typeClass(leaveRequest.leaveType)}>{leaveRequest.leaveType}</span></td>
                <td data-label="From">{leaveRequest.from}</td>
                <td data-label="To">{leaveRequest.to}</td>
                <td data-label="Days"><span className="dt-leaves-days">{leaveRequest.leaveType === 'Maternity' ? '92 days' : leaveRequest.leaveType === 'Paternity' ? '10 days' : leaveRequest.leaveType === 'Annual Leave' ? '3 days' : leaveRequest.leaveType === 'Work From Home' ? '2 days' : '2 days'}</span></td>
                <td data-label="Status"><span className={'dt-leaves-status is-' + statusClass(leaveRequest.status)}><i />{leaveRequest.status}</span></td>
                <td data-label="Approver">{leaveRequest.approver}</td>
                <td data-label="Actions"><LeaveActions leaveRequest={leaveRequest} onView={onView} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleRequests.length === 0 ? <p className="dt-leaves-empty-state">No leave requests match the current search and filters.</p> : null}
    </motion.section>
  )
}
