import { useState } from 'react'
import AddEmployeeModal from '../components/employees/AddEmployeeModal'
import EmployeeCharts from '../components/employees/EmployeeCharts'
import EmployeeDrawer from '../components/employees/EmployeeDrawer'
import EmployeeFilters from '../components/employees/EmployeeFilters'
import EmployeeHeader from '../components/employees/EmployeeHeader'
import EmployeeSummary from '../components/employees/EmployeeSummary'
import EmployeeTable from '../components/employees/EmployeeTable'
import HrAiAssistant from '../components/employees/HrAiAssistant'
import '../components/employees/employees.css'
import DashboardLayout from '../layouts/DashboardLayout'

const initialFilters = {
  department: 'all',
  employmentType: 'all',
  joined: 'all',
  location: 'all',
  manager: 'all',
  role: 'all',
  status: 'all',
}

const initialEmployees = [
  {
    attendanceToday: 'Present', department: 'Revenue', email: 'aarav.mehta@digitech.ai', employmentType: 'Full-time',
    id: 'EM-1048', initials: 'AM', joiningDate: '2023-04-17', leaveBalance: 8, location: 'Bengaluru HQ',
    manager: 'Jonathan Reed', name: 'Aarav Mehta', performanceScore: 92, phone: '+91 98765 10480',
    role: 'Enterprise Account Director', roleGroup: 'Leadership', salaryGrade: 'G7', status: 'Active', tone: 'gold',
  },
  {
    attendanceToday: 'Present', department: 'Growth', email: 'maya.rodriguez@digitech.ai', employmentType: 'Full-time',
    id: 'EM-1021', initials: 'MR', joiningDate: '2022-09-08', leaveBalance: 12.5, location: 'Remote',
    manager: 'Elena Ortiz', name: 'Maya Rodriguez', performanceScore: 88, phone: '+1 415 555 0188',
    role: 'Growth Marketing Lead', roleGroup: 'Manager', salaryGrade: 'G6', status: 'Remote', tone: 'purple',
  },
  {
    attendanceToday: 'Present', department: 'Engineering', email: 'oliver.chen@digitech.ai', employmentType: 'Full-time',
    id: 'EM-1094', initials: 'OC', joiningDate: '2025-11-03', leaveBalance: 15, location: 'Bengaluru HQ',
    manager: 'Marcus Cole', name: 'Oliver Chen', performanceScore: 74, phone: '+91 99887 10940',
    role: 'Product Engineer', roleGroup: 'Engineer', salaryGrade: 'G4', status: 'Probation', tone: 'blue',
  },
  {
    attendanceToday: 'Present', department: 'People', email: 'priya.nair@digitech.ai', employmentType: 'Full-time',
    id: 'EM-1017', initials: 'PN', joiningDate: '2021-02-14', leaveBalance: 9.5, location: 'Hyderabad Office',
    manager: 'Elena Ortiz', name: 'Priya Nair', performanceScore: 90, phone: '+91 98480 10170',
    role: 'People Operations Partner', roleGroup: 'Manager', salaryGrade: 'G6', status: 'Active', tone: 'green',
  },
  {
    attendanceToday: 'On Leave', department: 'Finance', email: 'sofia.turner@digitech.ai', employmentType: 'Full-time',
    id: 'EM-1062', initials: 'ST', joiningDate: '2020-07-20', leaveBalance: 4, location: 'Remote',
    manager: 'Jonathan Reed', name: 'Sofia Turner', performanceScore: 85, phone: '+44 20 7946 1062',
    role: 'Finance Controller', roleGroup: 'Leadership', salaryGrade: 'G7', status: 'On Leave', tone: 'gold',
  },
  {
    attendanceToday: 'Present', department: 'Operations', email: 'ethan.williams@digitech.ai', employmentType: 'Contract',
    id: 'EM-1054', initials: 'EW', joiningDate: '2024-08-12', leaveBalance: 11, location: 'Remote',
    manager: 'Marcus Cole', name: 'Ethan Williams', performanceScore: 79, phone: '+1 646 555 1054',
    role: 'Operations Specialist', roleGroup: 'Specialist', salaryGrade: 'G4', status: 'Remote', tone: 'blue',
  },
  {
    attendanceToday: 'Present', department: 'Customer Success', email: 'anika.shah@digitech.ai', employmentType: 'Full-time',
    id: 'EM-1118', initials: 'AS', joiningDate: '2026-01-06', leaveBalance: 16, location: 'Bengaluru HQ',
    manager: 'Priya Nair', name: 'Anika Shah', performanceScore: 71, phone: '+91 99001 11180',
    role: 'Customer Success Associate', roleGroup: 'Specialist', salaryGrade: 'G3', status: 'Probation', tone: 'purple',
  },
  {
    attendanceToday: 'Absent', department: 'Revenue', email: 'liam.brooks@digitech.ai', employmentType: 'Part-time',
    id: 'EM-1086', initials: 'LB', joiningDate: '2023-10-30', leaveBalance: 6, location: 'Hyderabad Office',
    manager: 'Jonathan Reed', name: 'Liam Brooks', performanceScore: 68, phone: '+44 20 7946 1086',
    role: 'Sales Enablement Specialist', roleGroup: 'Specialist', salaryGrade: 'G3', status: 'Inactive', tone: 'green',
  },
]

const toneCycle = ['gold', 'blue', 'purple', 'green']

function initialsFromName(name) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('')
}

export default function Employees() {
  const [employees, setEmployees] = useState(initialEmployees)
  const [filters, setFilters] = useState(initialFilters)
  const [importStatus, setImportStatus] = useState('')
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [sort, setSort] = useState({ direction: 'asc', key: 'name' })

  const updateFilter = (name, value) => {
    setFilters((currentFilters) => ({ ...currentFilters, [name]: value }))
  }

  const handleDeactivate = (id) => {
    setEmployees((current) => current.map((employee) => (employee.id === id ? { ...employee, status: 'Inactive' } : employee)))
  }

  const handleDelete = (id) => {
    setEmployees((current) => current.filter((employee) => employee.id !== id))
    setSelectedIds((current) => current.filter((value) => value !== id))
  }

  const handleBulkDeactivate = () => {
    setEmployees((current) => current.map((employee) => (selectedIds.includes(employee.id) ? { ...employee, status: 'Inactive' } : employee)))
    setSelectedIds([])
  }

  const handleBulkDelete = () => {
    setEmployees((current) => current.filter((employee) => !selectedIds.includes(employee.id)))
    setSelectedIds([])
  }

  const handleImportFile = (file) => {
    setImportStatus('Imported "' + file.name + '" — directory sync running in the background.')
    window.setTimeout(() => setImportStatus(''), 4000)
  }

  const handleAddEmployee = (formValues) => {
    const nextId = 'EM-' + (1100 + employees.length + Math.floor(Math.random() * 50))
    setEmployees((current) => [
      {
        attendanceToday: 'Present',
        department: formValues.department,
        email: formValues.email,
        employmentType: formValues.employmentType,
        id: formValues.employeeId || nextId,
        initials: initialsFromName(formValues.employeeName || 'New Hire'),
        joiningDate: formValues.joiningDate,
        leaveBalance: 18,
        location: formValues.officeLocation,
        manager: formValues.manager,
        name: formValues.employeeName,
        performanceScore: 70,
        phone: formValues.phone,
        role: formValues.role,
        roleGroup: 'Specialist',
        salaryGrade: formValues.salaryGrade,
        status: 'Active',
        tone: toneCycle[current.length % toneCycle.length],
      },
      ...current,
    ])
  }

  return (
    <DashboardLayout>
      <div className="dt-employees">
        <EmployeeHeader onAddEmployee={() => setIsAddEmployeeOpen(true)} />
        <EmployeeSummary />
        <EmployeeFilters
          employees={employees}
          filters={filters}
          importStatus={importStatus}
          onBulkDeactivate={handleBulkDeactivate}
          onBulkDelete={handleBulkDelete}
          onFilterChange={updateFilter}
          onImportFile={handleImportFile}
          onSortChange={setSort}
          search={search}
          selectedIds={selectedIds}
          setSearch={setSearch}
          sort={sort}
        />
        <section className="dt-employees-workspace-grid">
          <EmployeeTable
            employees={employees}
            filters={filters}
            onDeactivate={handleDeactivate}
            onDelete={handleDelete}
            onSelectedIdsChange={setSelectedIds}
            onSortChange={setSort}
            onView={setSelectedEmployee}
            search={search}
            selectedIds={selectedIds}
            sort={sort}
          />
          <HrAiAssistant />
        </section>
        <EmployeeCharts />
      </div>
      <EmployeeDrawer employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
      <AddEmployeeModal isOpen={isAddEmployeeOpen} onClose={() => setIsAddEmployeeOpen(false)} onSubmit={handleAddEmployee} />
    </DashboardLayout>
  )
}
