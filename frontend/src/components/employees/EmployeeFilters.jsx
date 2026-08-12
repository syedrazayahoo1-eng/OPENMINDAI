import { useRef, useState } from 'react'
import { ChevronDown, Download, Filter, ListChecks, Search, Trash2, Upload, UserRoundX } from 'lucide-react'

const sortOptions = [
  ['name-asc', 'Name (A-Z)'],
  ['name-desc', 'Name (Z-A)'],
  ['joiningDate-desc', 'Newest hires'],
  ['joiningDate-asc', 'Longest tenure'],
  ['performanceScore-desc', 'Top performance'],
  ['leaveBalance-desc', 'Highest leave balance'],
]

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
    label: 'Designation',
    name: 'role',
    options: [
      ['all', 'All designations'],
      ['Leadership', 'Leadership'],
      ['Manager', 'Manager'],
      ['Specialist', 'Specialist'],
      ['Engineer', 'Engineer'],
    ],
  },
  {
    label: 'Manager',
    name: 'manager',
    options: [
      ['all', 'All managers'],
      ['Jonathan Reed', 'Jonathan Reed'],
      ['Elena Ortiz', 'Elena Ortiz'],
      ['Priya Nair', 'Priya Nair'],
      ['Marcus Cole', 'Marcus Cole'],
    ],
  },
  {
    label: 'Type',
    name: 'employmentType',
    options: [
      ['all', 'All types'],
      ['Full-time', 'Full-time'],
      ['Contract', 'Contract'],
      ['Part-time', 'Part-time'],
    ],
  },
  {
    label: 'Status',
    name: 'status',
    options: [
      ['all', 'All statuses'],
      ['Active', 'Active'],
      ['Inactive', 'Inactive'],
      ['On Leave', 'On Leave'],
      ['Probation', 'Probation'],
      ['Remote', 'Remote'],
    ],
  },
  {
    label: 'Joined',
    name: 'joined',
    options: [
      ['all', 'All dates'],
      ['2026', '2026'],
      ['2025', '2025'],
      ['2024', '2024'],
      ['2023', '2023'],
      ['2022', '2022'],
      ['2021', '2021'],
    ],
  },
  {
    label: 'Location',
    name: 'location',
    options: [
      ['all', 'All locations'],
      ['Bengaluru HQ', 'Bengaluru HQ'],
      ['Hyderabad Office', 'Hyderabad Office'],
      ['Remote', 'Remote'],
    ],
  },
]

function toCsv(rows) {
  const header = ['Employee ID', 'Name', 'Department', 'Designation', 'Status'].join(',')
  const lines = rows.map((row) => [row.id, row.name, row.department, row.role, row.status].join(','))
  return [header, ...lines].join('\n')
}

export default function EmployeeFilters({
  employees, filters, importStatus, onBulkDeactivate, onBulkDelete, onFilterChange, onImportFile, onSortChange, search, selectedIds, setSearch, sort,
}) {
  const importInputRef = useRef(null)
  const [isBulkMenuOpen, setIsBulkMenuOpen] = useState(false)

  const handleExport = () => {
    const csv = toCsv(employees)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'employee-directory.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => importInputRef.current?.click()

  const handleImportChange = (event) => {
    const file = event.target.files?.[0]
    if (file) onImportFile(file)
    event.target.value = ''
  }

  return (
    <section className="dt-employees-filters" aria-label="Employee filters">
      <label className="dt-employees-search">
        <Search size={16} strokeWidth={1.9} aria-hidden="true" />
        <span className="dt-employees-visually-hidden">Search employees</span>
        <input onChange={(event) => setSearch(event.target.value)} placeholder="Search employee, ID, department or role" type="search" value={search} />
      </label>
      <div className="dt-employees-filter-list">
        <span className="dt-employees-filter-label"><Filter size={14} strokeWidth={1.9} aria-hidden="true" /> Filters</span>
        {filterDefinitions.map((filter) => (
          <label className="dt-employees-select-filter" key={filter.name}>
            <span>{filter.label}</span>
            <select aria-label={'Filter by ' + filter.label} name={filter.name} onChange={(event) => onFilterChange(filter.name, event.target.value)} value={filters[filter.name]}>
              {filter.options.map(([value, optionLabel]) => <option key={value} value={value}>{optionLabel}</option>)}
            </select>
            <ChevronDown size={13} strokeWidth={2} aria-hidden="true" />
          </label>
        ))}
        <label className="dt-employees-select-filter dt-employees-sort-filter">
          <span>Sort</span>
          <select
            aria-label="Sort employees"
            onChange={(event) => {
              const [key, direction] = event.target.value.split('-')
              onSortChange({ direction, key })
            }}
            value={sort.key + '-' + sort.direction}
          >
            {sortOptions.map(([value, optionLabel]) => <option key={value} value={value}>{optionLabel}</option>)}
          </select>
          <ChevronDown size={13} strokeWidth={2} aria-hidden="true" />
        </label>
      </div>
      <div className="dt-employees-toolbar-actions">
        <button onClick={handleExport} type="button"><Download size={14} strokeWidth={1.9} aria-hidden="true" /> Export</button>
        <button onClick={handleImportClick} type="button"><Upload size={14} strokeWidth={1.9} aria-hidden="true" /> Import</button>
        <input accept=".csv" hidden onChange={handleImportChange} ref={importInputRef} type="file" />
        <div className="dt-employees-bulk-actions">
          <button aria-expanded={isBulkMenuOpen} aria-haspopup="menu" className="dt-employees-bulk-trigger" onClick={() => setIsBulkMenuOpen((current) => !current)} type="button">
            <ListChecks size={14} strokeWidth={1.9} aria-hidden="true" /> Bulk actions {selectedIds.length > 0 ? '(' + selectedIds.length + ')' : ''}
          </button>
          {isBulkMenuOpen ? (
            <div className="dt-employees-bulk-menu" role="menu">
              <button disabled={selectedIds.length === 0} onClick={() => { onBulkDeactivate(); setIsBulkMenuOpen(false) }} type="button"><UserRoundX size={13} strokeWidth={1.9} aria-hidden="true" /> Deactivate selected</button>
              <button className="is-danger" disabled={selectedIds.length === 0} onClick={() => { onBulkDelete(); setIsBulkMenuOpen(false) }} type="button"><Trash2 size={13} strokeWidth={1.9} aria-hidden="true" /> Delete selected</button>
            </div>
          ) : null}
        </div>
        {importStatus ? <small className="dt-employees-import-status">{importStatus}</small> : null}
      </div>
    </section>
  )
}
