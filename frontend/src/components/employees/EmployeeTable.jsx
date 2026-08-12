import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ClipboardList,
  Eye,
  FileText,
  MoreHorizontal,
  Pencil,
  TrendingUp,
  UserRoundX,
  Trash2,
} from 'lucide-react'

const columns = [
  { key: 'name', label: 'Employee', sortable: true },
  { key: 'id', label: 'Employee ID', sortable: true },
  { key: 'email', label: 'Email', sortable: false },
  { key: 'phone', label: 'Phone', sortable: false },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'role', label: 'Designation', sortable: true },
  { key: 'manager', label: 'Manager', sortable: true },
  { key: 'joiningDate', label: 'Joining Date', sortable: true },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'employmentType', label: 'Employment Type', sortable: true },
  { key: 'attendanceToday', label: 'Attendance Today', sortable: true },
  { key: 'leaveBalance', label: 'Leave Balance', sortable: true },
  { key: 'performanceScore', label: 'Performance', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
]

const PAGE_SIZE = 5

function matchesValue(filterValue, recordValue) {
  return filterValue === 'all' || filterValue === recordValue
}

function formatJoiningDate(value) {
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value + 'T00:00:00'))
}

function EmployeeActionMenu({ employee, isOpen, onDeactivate, onDelete, onToggle, onView }) {
  const items = [
    { icon: Eye, label: 'View Profile', onClick: () => onView(employee) },
    { icon: Pencil, label: 'Edit Employee', onClick: () => onView(employee) },
    { icon: CalendarClock, label: 'Attendance History', onClick: () => onView(employee) },
    { icon: ClipboardList, label: 'Leave History', onClick: () => onView(employee) },
    { icon: TrendingUp, label: 'Performance', onClick: () => onView(employee) },
    { icon: FileText, label: 'Documents', onClick: () => onView(employee) },
    { icon: UserRoundX, label: 'Deactivate', onClick: () => onDeactivate(employee.id), tone: 'warn' },
    { icon: Trash2, label: 'Delete', onClick: () => onDelete(employee.id), tone: 'danger' },
  ]

  return (
    <div className="dt-employees-action-menu">
      <button aria-expanded={isOpen} aria-haspopup="menu" aria-label={'More actions for ' + employee.name} onClick={onToggle} type="button">
        <MoreHorizontal size={16} strokeWidth={1.9} aria-hidden="true" />
      </button>
      {isOpen ? (
        <div className="dt-employees-action-menu-panel" role="menu">
          {items.map(({ icon: Icon, label, onClick, tone }) => (
            <button className={tone ? 'is-' + tone : undefined} key={label} onClick={onClick} role="menuitem" type="button">
              <Icon size={13} strokeWidth={1.9} aria-hidden="true" /> {label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default function EmployeeTable({
  employees, filters, onDeactivate, onDelete, onSelectedIdsChange, onSortChange, onView, search, selectedIds, sort,
}) {
  const [openMenuId, setOpenMenuId] = useState(null)
  const [page, setPage] = useState(1)

  const normalizedSearch = search.trim().toLowerCase()

  const filteredEmployees = useMemo(() => employees.filter((employee) => {
    const searchMatches = !normalizedSearch || [
      employee.department,
      employee.id,
      employee.manager,
      employee.name,
      employee.role,
    ].some((value) => value.toLowerCase().includes(normalizedSearch))

    return searchMatches
      && matchesValue(filters.department, employee.department)
      && matchesValue(filters.role, employee.roleGroup)
      && matchesValue(filters.manager, employee.manager)
      && matchesValue(filters.employmentType, employee.employmentType)
      && matchesValue(filters.status, employee.status)
      && matchesValue(filters.joined, employee.joiningDate.slice(0, 4))
      && matchesValue(filters.location, employee.location)
  }), [employees, filters, normalizedSearch])

  const sortedEmployees = useMemo(() => {
    const factor = sort.direction === 'asc' ? 1 : -1
    return [...filteredEmployees].sort((a, b) => {
      const left = a[sort.key]
      const right = b[sort.key]
      if (typeof left === 'number' && typeof right === 'number') return (left - right) * factor
      return String(left).localeCompare(String(right)) * factor
    })
  }, [filteredEmployees, sort])

  const totalPages = Math.max(1, Math.ceil(sortedEmployees.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visibleEmployees = sortedEmployees.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const allVisibleSelected = visibleEmployees.length > 0 && visibleEmployees.every((employee) => selectedIds.includes(employee.id))

  const toggleSort = (key) => {
    onSortChange(sort.key === key ? { direction: sort.direction === 'asc' ? 'desc' : 'asc', key } : { direction: 'asc', key })
  }

  const toggleSelectAllVisible = () => {
    onSelectedIdsChange(
      allVisibleSelected
        ? selectedIds.filter((id) => !visibleEmployees.some((employee) => employee.id === id))
        : [...new Set([...selectedIds, ...visibleEmployees.map((employee) => employee.id)])]
    )
  }

  const toggleSelectOne = (id) => {
    onSelectedIdsChange(selectedIds.includes(id) ? selectedIds.filter((value) => value !== id) : [...selectedIds, id])
  }

  return (
    <motion.section
      className="dt-employees-table-card"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="dt-employees-section-heading">
        <div>
          <p>WORKFORCE DIRECTORY</p>
          <h2>Your people, contextually organized.</h2>
        </div>
        <span className="dt-employees-selection-note">{selectedIds.length > 0 ? selectedIds.length + ' selected' : sortedEmployees.length + ' employees'}</span>
      </header>
      <div className="dt-employees-table-scroll">
        <table>
          <thead>
            <tr>
              <th className="dt-employees-checkbox-cell"><input aria-label="Select all visible employees" checked={allVisibleSelected} onChange={toggleSelectAllVisible} type="checkbox" /></th>
              {columns.map((column) => (
                <th key={column.key}>
                  {column.sortable ? (
                    <button className="dt-employees-sort-button" onClick={() => toggleSort(column.key)} type="button">
                      {column.label}
                      <ChevronsUpDown aria-hidden="true" className={sort.key === column.key ? 'is-active is-' + sort.direction : undefined} size={11} strokeWidth={2.3} />
                    </button>
                  ) : column.label}
                </th>
              ))}
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {visibleEmployees.map((employee) => (
              <tr key={employee.id}>
                <td className="dt-employees-checkbox-cell" data-label="Select"><input aria-label={'Select ' + employee.name} checked={selectedIds.includes(employee.id)} onChange={() => toggleSelectOne(employee.id)} type="checkbox" /></td>
                <td data-label="Employee"><span className={'dt-employees-avatar is-' + employee.tone}>{employee.initials}</span><strong>{employee.name}</strong></td>
                <td data-label="Employee ID"><span className="dt-employees-id">{employee.id}</span></td>
                <td data-label="Email">{employee.email}</td>
                <td data-label="Phone">{employee.phone}</td>
                <td data-label="Department"><span className="dt-employees-department">{employee.department}</span></td>
                <td data-label="Designation"><span className="dt-employees-role">{employee.role}</span></td>
                <td data-label="Manager">{employee.manager}</td>
                <td data-label="Joining Date">{formatJoiningDate(employee.joiningDate)}</td>
                <td data-label="Location">{employee.location}</td>
                <td data-label="Employment Type"><span className="dt-employees-type">{employee.employmentType}</span></td>
                <td data-label="Attendance Today"><span className={'dt-employees-attendance is-' + employee.attendanceToday.toLowerCase().replace(' ', '-')}>{employee.attendanceToday}</span></td>
                <td data-label="Leave Balance">{employee.leaveBalance}d</td>
                <td data-label="Performance">
                  <span className="dt-employees-performance-cell">
                    <i style={{ width: employee.performanceScore + '%' }} />
                    <b>{employee.performanceScore}</b>
                  </span>
                </td>
                <td data-label="Status"><span className={'dt-employees-status is-' + employee.status.toLowerCase().replace(' ', '-')}><i />{employee.status}</span></td>
                <td data-label="Actions">
                  <div className="dt-employees-table-actions">
                    <button aria-label={'View ' + employee.name} onClick={() => onView(employee)} type="button"><Eye size={15} strokeWidth={1.9} aria-hidden="true" /></button>
                    <EmployeeActionMenu
                      employee={employee}
                      isOpen={openMenuId === employee.id}
                      onDeactivate={(id) => { onDeactivate(id); setOpenMenuId(null) }}
                      onDelete={(id) => { onDelete(id); setOpenMenuId(null) }}
                      onToggle={() => setOpenMenuId((current) => (current === employee.id ? null : employee.id))}
                      onView={onView}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleEmployees.length === 0 ? <p className="dt-employees-empty-state">No employees match the current search and filters.</p> : null}
      <footer className="dt-employees-pagination">
        <span>Page {currentPage} of {totalPages}</span>
        <div>
          <button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><ChevronLeft size={14} strokeWidth={2} aria-hidden="true" /></button>
          <button aria-label="Next page" disabled={currentPage === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} type="button"><ChevronRight size={14} strokeWidth={2} aria-hidden="true" /></button>
        </div>
      </footer>
    </motion.section>
  )
}
