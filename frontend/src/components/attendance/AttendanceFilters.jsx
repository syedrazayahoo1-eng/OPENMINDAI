import { CalendarDays, ChevronDown, Search, SlidersHorizontal } from 'lucide-react'

function SelectFilter({ label, options }) {
  return (
    <label className="dt-attendance-select-filter">
      <span>{label}</span>
      <select defaultValue="">
        <option value="">All {label.toLowerCase()}</option>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
      <ChevronDown size={14} strokeWidth={1.9} aria-hidden="true" />
    </label>
  )
}

export default function AttendanceFilters({ search, setSearch }) {
  return (
    <section className="dt-attendance-filters">
      <label className="dt-attendance-search">
        <Search size={17} strokeWidth={1.9} aria-hidden="true" />
        <span className="dt-attendance-visually-hidden">Search employees</span>
        <input onChange={(event) => setSearch(event.target.value)} placeholder="Search employee, ID or department…" type="search" value={search} />
      </label>
      <div className="dt-attendance-filter-list">
        <span className="dt-attendance-filter-label"><SlidersHorizontal size={15} strokeWidth={1.9} aria-hidden="true" /> Filters</span>
        <SelectFilter label="Department" options={['Revenue', 'Growth', 'People', 'Finance', 'Operations']} />
        <button className="dt-attendance-date-filter" type="button"><CalendarDays size={14} strokeWidth={1.9} aria-hidden="true" /> Date</button>
        <SelectFilter label="Status" options={['Present', 'Absent', 'Late', 'Leave', 'Remote']} />
        <SelectFilter label="Location" options={['Bengaluru HQ', 'Remote', 'Mumbai Office', 'Hyderabad Office']} />
        <SelectFilter label="Shift" options={['General', 'Morning', 'Evening', 'Flexible']} />
        <SelectFilter label="Employee ID" options={['EM-1048', 'EM-1021', 'EM-1094']} />
      </div>
    </section>
  )
}
