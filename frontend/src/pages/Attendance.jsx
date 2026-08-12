import { useState } from 'react'
import AttendanceCharts from '../components/attendance/AttendanceCharts'
import AttendanceFilters from '../components/attendance/AttendanceFilters'
import AttendanceHeader from '../components/attendance/AttendanceHeader'
import AttendanceInsights from '../components/attendance/AttendanceInsights'
import AttendanceSummary from '../components/attendance/AttendanceSummary'
import AttendanceTable from '../components/attendance/AttendanceTable'
import EmployeeDrawer from '../components/attendance/EmployeeDrawer'
import MarkAttendanceModal from '../components/attendance/MarkAttendanceModal'
import '../components/attendance/attendance.css'
import DashboardLayout from '../layouts/DashboardLayout'

export default function Attendance() {
  const [isMarkAttendanceOpen, setIsMarkAttendanceOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  return (
    <DashboardLayout>
      <div className="dt-attendance">
        <AttendanceHeader onMarkAttendance={() => setIsMarkAttendanceOpen(true)} />
        <AttendanceSummary />
        <AttendanceFilters search={search} setSearch={setSearch} />
        <section className="dt-attendance-workspace-grid">
          <AttendanceTable onView={setSelectedEmployee} search={search} />
          <AttendanceInsights />
        </section>
        <AttendanceCharts />
      </div>
      <EmployeeDrawer employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
      <MarkAttendanceModal isOpen={isMarkAttendanceOpen} onClose={() => setIsMarkAttendanceOpen(false)} />
    </DashboardLayout>
  )
}
