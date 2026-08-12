import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Eye, MoreHorizontal, Reply, Trash2, UserPlus } from 'lucide-react'

export default function ReviewActionMenu({ review, onView, onReply, onAssign, onResolve, onDelete }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleOutsideClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const run = (action) => () => {
    setIsOpen(false)
    action(review)
  }

  return (
    <div className="dt-reviews-action-menu" ref={menuRef}>
      <button aria-label={'More actions for ' + review.name} onClick={() => setIsOpen((open) => !open)} type="button">
        <MoreHorizontal size={16} strokeWidth={1.9} aria-hidden="true" />
      </button>
      {isOpen ? (
        <div className="dt-reviews-action-dropdown" role="menu">
          <button onClick={run(onView)} type="button"><Eye size={14} strokeWidth={1.9} aria-hidden="true" /> View Review</button>
          <button onClick={run(onReply)} type="button"><Reply size={14} strokeWidth={1.9} aria-hidden="true" /> Reply</button>
          <button onClick={run(onAssign)} type="button"><UserPlus size={14} strokeWidth={1.9} aria-hidden="true" /> Assign Agent</button>
          <button onClick={run(onResolve)} type="button"><CheckCircle2 size={14} strokeWidth={1.9} aria-hidden="true" /> Mark Resolved</button>
          <button className="is-danger" onClick={run(onDelete)} type="button"><Trash2 size={14} strokeWidth={1.9} aria-hidden="true" /> Delete</button>
        </div>
      ) : null}
    </div>
  )
}
