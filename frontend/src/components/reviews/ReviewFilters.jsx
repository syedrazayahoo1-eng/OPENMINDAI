import { CalendarDays, ChevronDown, Download, RefreshCw, Search, SlidersHorizontal } from 'lucide-react'
import BusinessSelector from './BusinessSelector'

function SelectFilter({ label, options, value, onChange }) {
  return (
    <label className="dt-reviews-select-filter">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">All {label.toLowerCase()}</option>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
      <ChevronDown size={14} strokeWidth={1.9} aria-hidden="true" />
    </label>
  )
}

export default function ReviewFilters({ filters, setFilters, onRefresh, onExport }) {
  const update = (key) => (value) => setFilters((current) => ({ ...current, [key]: value }))

  return (
    <section className="dt-reviews-filters">
      <label className="dt-reviews-customer-search">
        <Search size={17} strokeWidth={1.9} aria-hidden="true" />
        <span className="dt-reviews-visually-hidden">Search reviews</span>
        <input
          onChange={(event) => update('search')(event.target.value)}
          placeholder="Search reviews, customers or companies…"
          type="search"
          value={filters.search}
        />
      </label>
      <div className="dt-reviews-filter-list">
        <span className="dt-reviews-filter-label"><SlidersHorizontal size={15} strokeWidth={1.9} aria-hidden="true" /> Filters</span>
        <BusinessSelector onChange={update('business')} value={filters.business} />
        <SelectFilter label="Rating" options={['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star']} value={filters.rating} onChange={update('rating')} />
        <SelectFilter label="Source" options={['Google', 'Facebook', 'Yelp', 'Trustpilot', 'App Store']} value={filters.source} onChange={update('source')} />
        <SelectFilter label="Status" options={['New', 'In Progress', 'Resolved', 'Escalated']} value={filters.status} onChange={update('status')} />
        <button className="dt-reviews-date-filter" type="button"><CalendarDays size={14} strokeWidth={1.9} aria-hidden="true" /> Date Range</button>
        <button className="dt-reviews-date-filter" onClick={onExport} type="button"><Download size={14} strokeWidth={1.9} aria-hidden="true" /> Export</button>
        <button className="dt-reviews-date-filter" onClick={onRefresh} type="button"><RefreshCw size={14} strokeWidth={1.9} aria-hidden="true" /> Refresh</button>
      </div>
    </section>
  )
}
