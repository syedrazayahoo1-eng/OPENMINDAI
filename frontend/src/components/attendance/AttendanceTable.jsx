import { motion } from 'framer-motion'
import { Eye, History, MoreHorizontal, Pencil } from 'lucide-react'

const attendanceRecords = [
  { name: 'Aarav Mehta', initials: 'AM', id: 'EM-1048', department: 'Revenue', checkIn: '09:02', checkOut: '18:18', hours: '8h 46m', status: 'Present', location: 'Bengaluru HQ', tone: 'gold' },
  { name: 'Maya Rodriguez', initials: 'MR', id: 'EM-1021', department: 'Growth', checkIn: '08:49', checkOut: '17:42', hours: '8h 53m', status: 'Present', location: 'Remote', tone: 'purple' },
  { name: 'Oliver Chen', initials: 'OC', id: 'EM-1094', department: 'Engineering', checkIn: '09:27', checkOut: '—', hours: '6h 12m', status: 'Late', location: 'Bengaluru HQ', tone: 'blue' },
  { name: 'Priya Nair', initials: 'PN', id: 'EM-1017', department: 'People', checkIn: '09:10', checkOut: '18:06', hours: '8h 56m', status: 'Present', location: 'Hyderabad Office', tone: 'green' },
  { name: 'Sofia Turner', initials: 'ST', id: 'EM-1062', department: 'Finance', checkIn: '—', checkOut: '—', hours: 'Leave', status: 'Leave', location: 'Remote', tone: 'gold' },
  { name: 'Ethan Williams', initials: 'EW', id: 'EM-1054', department: 'Operations', checkIn: '09:01', checkOut: '17:58', hours: '8h 57m', status: 'Remote', location: 'Remote', tone: 'blue' },
  { name: 'Anika Shah', initials: 'AS', id: 'EM-1118', department: 'Customer Success', checkIn: '—', checkOut: '—', hours: '—', status: 'Absent', location: '—', tone: 'purple' },
]

function AttendanceActions({ employee, onView }) {
  return (
    <div className="dt-attendance-table-actions">
      <button aria-label={'View ' + employee.name} onClick={() => onView(employee)} type="button"><Eye size={15} strokeWidth={1.9} aria-hidden="true" /></button>
      <button aria-label={'Edit ' + employee.name} onClick={() => onView(employee)} type="button"><Pencil size={14} strokeWidth={1.9} aria-hidden="true" /></button>
      <button aria-label={'View history for ' + employee.name} onClick={() => onView(employee)} type="button"><History size={14} strokeWidth={1.9} aria-hidden="true" /></button>
      <button aria-label={'More actions for ' + employee.name} type="button"><MoreHorizontal size={16} strokeWidth={1.9} aria-hidden="true" /></button>
    </div>
  )
}

export default function AttendanceTable({ onView, search }) {
  const normalizedSearch = search.trim().toLowerCase()
  const visibleEmployees = attendanceRecords.filter((employee) => {
    if (!normalizedSearch) return true
    return [employee.name, employee.id, employee.department, employee.location].some((value) => value.toLowerCase().includes(normalizedSearch))
  })

  return (
    <motion.section
      className="dt-attendance-table-card"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="dt-attendance-section-heading">
        <div>
          <p>LIVE WORKFORCE DIRECTORY</p>
          <h2>Today&apos;s attendance, down to every shift.</h2>
        </div>
        <button type="button">Export report</button>
      </header>
      <div className="dt-attendance-table-scroll">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Employee ID</th>
              <th>Department</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Working Hours</th>
              <th>Status</th>
              <th>Location</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {visibleEmployees.map((employee) => (
              <tr key={employee.id}>
                <td data-label="Employee"><span className={'dt-attendance-avatar is-' + employee.tone}>{employee.initials}</span><strong>{employee.name}</strong></td>
                <td data-label="Employee ID"><span className="dt-attendance-id">{employee.id}</span></td>
                <td data-label="Department"><span className="dt-attendance-department">{employee.department}</span></td>
                <td data-label="Check In">{employee.checkIn}</td>
                <td data-label="Check Out">{employee.checkOut}</td>
                <td data-label="Working Hours"><span className="dt-attendance-hours">{employee.hours}</span></td>
                <td data-label="Status"><span className={'dt-attendance-status is-' + employee.status.toLowerCase()}><i />{employee.status}</span></td>
                <td data-label="Location"><span className="dt-attendance-location">{employee.location}</span></td>
                <td data-label="Actions"><AttendanceActions employee={employee} onView={onView} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleEmployees.length === 0 ? <p className="dt-attendance-empty-state">No employees match this search.</p> : null}
    </motion.section>
  )
}
