import { ChevronDown, Search, SlidersHorizontal } from 'lucide-react'

function SelectFilter({ label, options }) {
  return <label className="dt-crm-select-filter"><span>{label}</span><select defaultValue=""><option value="">All {label.toLowerCase()}</option>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={14} strokeWidth={1.9} aria-hidden="true" /></label>
}

export default function CustomerFilters({ customers, search, setSearch }) {
  const values = (field) => [...new Set(customers.map((customer) => customer[field]).filter(Boolean))].sort()
  return <section className="dt-crm-filters">
    <label className="dt-crm-customer-search"><Search size={17} strokeWidth={1.9} aria-hidden="true" /><span className="dt-crm-visually-hidden">Search customers</span><input onChange={(event) => setSearch(event.target.value)} placeholder="Search customers, companies or contacts…" type="search" value={search} /></label>
    <div className="dt-crm-filter-list"><span className="dt-crm-filter-label"><SlidersHorizontal size={15} strokeWidth={1.9} aria-hidden="true" /> Filters</span><SelectFilter label="Company" options={values('company')} /><SelectFilter label="Status" options={values('status')} /><SelectFilter label="Lead Source" options={values('leadSource')} /></div>
  </section>
}
