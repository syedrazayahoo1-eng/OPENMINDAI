import { AnimatePresence, motion } from 'framer-motion'
import { Building2, CalendarDays, Mail, Phone, StickyNote, X } from 'lucide-react'

export default function CustomerDrawer({ customer, onClose }) {
  if (!customer) return <AnimatePresence />
  const name = [customer.firstName, customer.lastName].filter(Boolean).join(' ')
  const initials = `${customer.firstName?.[0] || ''}${customer.lastName?.[0] || ''}` || '?'
  const activities = customer.activities || []
  const notes = customer.notes || []
  return <AnimatePresence><motion.div className="dt-crm-drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
    <motion.aside aria-label={name + ' customer profile'} className="dt-crm-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} onMouseDown={(event) => event.stopPropagation()} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
      <header><div><span className="dt-crm-drawer-avatar is-gold">{initials}</span><div><p>CUSTOMER PROFILE</p><h2>{name}</h2><small>{customer.company || 'No company recorded'}</small></div></div><button aria-label="Close customer profile" onClick={onClose} type="button"><X size={20} strokeWidth={1.9} aria-hidden="true" /></button></header>
      <div className="dt-crm-drawer-content">
        <section><h3>Customer Details</h3><div className="dt-crm-drawer-details"><p><Building2 size={15} strokeWidth={1.9} aria-hidden="true" /><span>Company</span><strong>{customer.company || '—'}</strong></p><p><Mail size={15} strokeWidth={1.9} aria-hidden="true" /><span>Contact</span><strong>{customer.email || '—'}</strong></p><p><Phone size={15} strokeWidth={1.9} aria-hidden="true" /><span>Phone</span><strong>{customer.phone || '—'}</strong></p><p><CalendarDays size={15} strokeWidth={1.9} aria-hidden="true" /><span>Status</span><strong>{customer.status}</strong></p></div></section>
        <section><h3>Activities</h3><div className="dt-crm-drawer-timeline">{activities.length ? activities.map((activity) => <article key={activity.id}><i /><div><strong>{activity.type}</strong><p>{activity.description}</p><small>{activity.dueDate ? new Date(activity.dueDate).toLocaleString() : 'No due date'}</small></div></article>) : <p className="dt-crm-empty-state">No activities recorded.</p>}</div></section>
        <section><h3>Notes</h3><div className="dt-crm-drawer-timeline">{notes.length ? notes.map((note) => <article key={note.id}><StickyNote size={15} /><div><p>{note.content}</p><small>{new Date(note.createdAt).toLocaleString()}</small></div></article>) : <p className="dt-crm-empty-state">No notes recorded.</p>}</div></section>
      </div>
    </motion.aside>
  </motion.div></AnimatePresence>
}
