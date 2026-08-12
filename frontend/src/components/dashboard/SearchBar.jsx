import { Search } from 'lucide-react'

export default function SearchBar() {
  return (
    <label className="dt-dashboard-search">
      <Search size={17} strokeWidth={1.9} aria-hidden="true" />
      <span className="dt-dashboard-visually-hidden">Search the workspace</span>
      <input aria-label="Search the workspace" placeholder="Search workspace…" type="search" />
      <kbd>⌘ K</kbd>
    </label>
  )
}
