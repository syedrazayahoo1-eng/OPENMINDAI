import { useState } from 'react'
import ApplyLeaveModal from '../components/leaves/ApplyLeaveModal'
import DepartmentLeaveStats from '../components/leaves/DepartmentLeaveStats'
import EmployeeLeaveDrawer from '../components/leaves/EmployeeLeaveDrawer'
import LeaveAiAssistant from '../components/leaves/LeaveAiAssistant'
import LeaveBalanceCards from '../components/leaves/LeaveBalanceCards'
import LeaveCharts from '../components/leaves/LeaveCharts'
import LeaveFilters from '../components/leaves/LeaveFilters'
import LeaveHeader from '../components/leaves/LeaveHeader'
import LeaveRequestTable from '../components/leaves/LeaveRequestTable'
import LeaveSummary from '../components/leaves/LeaveSummary'
import '../components/leaves/leaves.css'
import DashboardLayout from '../layouts/DashboardLayout'

const initialFilters = {
  dateRange: 'all',
  department: 'all',
  leaveType: 'all',
  manager: 'all',
  status: 'all',
}

export default function Leaves() {
  const [filters, setFilters] = useState(initialFilters)
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)

  const updateFilter = (name, value) => {
    setFilters((currentFilters) => ({ ...currentFilters, [name]: value }))
  }

  return (
    <DashboardLayout>
      <div className="dt-leaves">
        <LeaveHeader onApplyLeave={() => setIsApplyLeaveOpen(true)} />
        <LeaveSummary />
        <section className="dt-leaves-dashboard-grid">
          <LeaveBalanceCards />
          <DepartmentLeaveStats />
        </section>
        <LeaveFilters filters={filters} onFilterChange={updateFilter} search={search} setSearch={setSearch} />
        <section className="dt-leaves-workspace-grid">
          <LeaveRequestTable filters={filters} onView={setSelectedRequest} search={search} />
          <LeaveAiAssistant />
        </section>
        <LeaveCharts />
      </div>
      <EmployeeLeaveDrawer leaveRequest={selectedRequest} onClose={() => setSelectedRequest(null)} />
      <ApplyLeaveModal isOpen={isApplyLeaveOpen} onClose={() => setIsApplyLeaveOpen(false)} />
    </DashboardLayout>
  )
}
