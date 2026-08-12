import { ChevronDown, Store } from 'lucide-react'

const businesses = ['All Locations', 'Pizza Palace', 'Coffee Hub', 'Royal Restaurant', 'Burger House']

export default function BusinessSelector({ value, onChange }) {
  return (
    <label className="dt-reviews-select-filter">
      <span><Store size={11} strokeWidth={2} aria-hidden="true" /> Business</span>
      <select onChange={(event) => onChange(event.target.value)} value={value}>
        {businesses.map((business) => <option key={business}>{business}</option>)}
      </select>
      <ChevronDown size={14} strokeWidth={1.9} aria-hidden="true" />
    </label>
  )
}
