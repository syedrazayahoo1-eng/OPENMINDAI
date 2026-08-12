import { Download, Trash2, Wand2, X } from 'lucide-react'

export default function BulkActions({ count, onClear }) {
  if (!count) return null

  return (
    <div className="dt-reviews-bulk-bar">
      <strong>{count} review{count > 1 ? 's' : ''} selected</strong>
      <div className="dt-reviews-bulk-actions">
        <button type="button"><Wand2 size={13} strokeWidth={1.9} aria-hidden="true" /> AI Reply Selected</button>
        <button type="button"><Download size={13} strokeWidth={1.9} aria-hidden="true" /> Export</button>
        <button className="is-danger" type="button"><Trash2 size={13} strokeWidth={1.9} aria-hidden="true" /> Delete</button>
        <button onClick={onClear} type="button"><X size={13} strokeWidth={1.9} aria-hidden="true" /> Clear</button>
      </div>
    </div>
  )
}
