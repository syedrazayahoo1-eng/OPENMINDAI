import { ChevronDown, Filter, Search } from 'lucide-react'

const filterDefinitions = [
  {
    label: 'Department',
    name: 'department',
    options: [
      ['all', 'All departments'],
      ['Revenue', 'Revenue'],
      ['Growth', 'Growth'],
      ['Engineering', 'Engineering'],
      ['People', 'People'],
      ['Finance', 'Finance'],
      ['Operations', 'Operations'],
    ],
  },
  {
    label: 'Leave type',
    name: 'leaveType',
    options: [
      ['all', 'All leave types'],
      ['Annual Leave', 'Annual Leave'],
      ['Sick Leave', 'Sick Leave'],
      ['Casual Leave', 'Casual Leave'],
      ['Maternity', 'Maternity'],
      ['Paternity', 'Paternity'],
      ['Work From Home', 'Work From Home'],
    ],
  },
  {
    label: 'Status',
    name: 'status',
    options: [
      ['all', 'All statuses'],
      ['Pending', 'Pending'],
      ['Approved', 'Approved'],
      ['Rejected', 'Rejected'],
      ['Cancelled', 'Cancelled'],
    ],
  },
  {
    label: 'Date range',
    name: 'dateRange',
    options: [
      ['all', 'All dates'],
      ['Jul 2026', 'Jul 2026'],
      ['Aug 2026', 'Aug 2026'],
      ['Sep 2026', 'Sep 2026'],
      ['Oct 2026', 'Oct 2026'],
    ],
  },
  {
    label: 'Manager',
    name: 'manager',
    options: [
      ['all', 'All managers'],
      ['Jonathan Reed', 'Jonathan Reed'],
      ['Elena Ortiz', 'Elena Ortiz'],
      ['Marcus Cole', 'Marcus Cole'],
      ['Priya Nair', 'Priya Nair'],
    ],
  },
]

export default function LeaveFilters({ filters, onFilterChange, search, setSearch }) {
  return (
    <section className="dt-leaves-filters" aria-label="Leave request filters">
      <label className="dt-leaves-search">
        <Search size={16} strokeWidth={1.9} aria-hidden="true" />
        <span className="dt-leaves-visually-hidden">Search leave requests</span>
        <input onChange={(event) => setSearch(event.target.value)} placeholder="Search employee, ID, department or leave type" type="search" value={search} />
      </label>
      <div className="dt-leaves-filter-list">
        <span className="dt-leaves-filter-label"><Filter size={14} strokeWidth={1.9} aria-hidden="true" /> Filters</span>
        {filterDefinitions.map((filter) => (
          <label className="dt-leaves-select-filter" key={filter.name}>
            <span>{filter.label}</span>
            <select aria-label={'Filter by ' + filter.label} name={filter.name} onChange={(event) => onFilterChange(filter.name, event.target.value)} value={filters[filter.name]}>
              {filter.options.map(([value, optionLabel]) => <option key={value} value={value}>{optionLabel}</option>)}
            </select>
            <ChevronDown size={13} strokeWidth={2} aria-hidden="true" />
          </label>
        ))}
      </div>
    </section>
  )
}
