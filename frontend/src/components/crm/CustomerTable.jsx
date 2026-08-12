import { motion } from 'framer-motion'
import { Eye, Pencil, Trash2 } from 'lucide-react'

function CustomerActions({ customer, onDelete, onEdit, onView }) {
  const name = `${customer.firstName} ${customer.lastName}`.trim()
  return <div className="dt-crm-table-actions">
    <button aria-label={'View ' + name} onClick={() => onView(customer)} type="button"><Eye size={15} strokeWidth={1.9} aria-hidden="true" /></button>
    <button aria-label={'Edit ' + name} onClick={() => onEdit(customer)} type="button"><Pencil size={14} strokeWidth={1.9} aria-hidden="true" /></button>
    <button aria-label={'Delete ' + name} onClick={() => onDelete(customer)} type="button"><Trash2 size={14} strokeWidth={1.9} aria-hidden="true" /></button>
  </div>
}

export default function CustomerTable({ customers, error, isLoading, onDelete, onEdit, onView }) {
  return (
    <motion.section className="dt-crm-customers" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
      <header className="dt-crm-section-heading"><div><p>CUSTOMER DIRECTORY</p><h2>Every customer relationship, intelligently connected.</h2></div></header>
      <div className="dt-crm-table-scroll">
        <table>
          <thead><tr><th>Customer</th><th>Company</th><th>Email</th><th>Phone</th><th>Status</th><th>Lead Source</th><th>Updated</th><th aria-label="Actions" /></tr></thead>
          <tbody>
            {customers.map((customer) => {
              const name = [customer.firstName, customer.lastName].filter(Boolean).join(' ')
              const initials = `${customer.firstName?.[0] || ''}${customer.lastName?.[0] || ''}` || '?'
              const tone = ['gold', 'purple', 'blue', 'green'][customer.id % 4]
              return <tr key={customer.id}>
                <td data-label="Customer"><span className={'dt-crm-customer-avatar is-' + tone}>{initials}</span><strong>{name}</strong></td>
                <td data-label="Company"><span className="dt-crm-company-name">{customer.company || '—'}</span></td>
                <td className="dt-crm-email" data-label="Email">{customer.email || '—'}</td>
                <td data-label="Phone">{customer.phone || '—'}</td>
                <td data-label="Status"><span className={'dt-crm-status is-' + customer.status.toLowerCase()}><i />{customer.status}</span></td>
                <td data-label="Lead Source">{customer.leadSource || '—'}</td>
                <td data-label="Updated"><span className="dt-crm-last-activity">{new Date(customer.updatedAt).toLocaleDateString()}</span></td>
                <td data-label="Actions"><CustomerActions customer={customer} onDelete={onDelete} onEdit={onEdit} onView={onView} /></td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
      {isLoading ? <p className="dt-crm-empty-state">Loading customers…</p> : null}
      {!isLoading && error ? <p className="dt-crm-empty-state">{error}</p> : null}
      {!isLoading && !error && customers.length === 0 ? <p className="dt-crm-empty-state">No customers yet. Add your first customer to begin.</p> : null}
    </motion.section>
  )
}
