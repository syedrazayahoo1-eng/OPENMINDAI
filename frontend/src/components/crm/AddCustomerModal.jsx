import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Building2, Loader2, Sparkles, X } from 'lucide-react'

const emptyCustomer = { firstName: '', lastName: '', company: '', email: '', phone: '', address: '', city: '', state: '', country: '', leadSource: 'Website', status: 'Lead', tags: '', organizationId: 0 }

export default function AddCustomerModal({ customer, isOpen, onClose, onSave }) {
  const [form, setForm] = useState(emptyCustomer)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setForm(customer ? { ...emptyCustomer, ...customer } : emptyCustomer)
    setError('')
  }, [customer, isOpen])

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setError('')
    try { await onSave(form) } catch (requestError) { setError(requestError.response?.data?.message || Object.values(requestError.response?.data?.errors || {}).flat().find(Boolean) || 'Customer could not be saved.') } finally { setIsSaving(false) }
  }

  return <AnimatePresence>{isOpen ? <motion.div className="dt-crm-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
    <motion.section aria-labelledby="add-customer-title" aria-modal="true" className="dt-crm-modal" initial={{ opacity: 0, scale: 0.97, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 16 }} onMouseDown={(event) => event.stopPropagation()} role="dialog" transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
      <header><div><span><Building2 size={21} strokeWidth={1.85} aria-hidden="true" /></span><div><p>GROW YOUR RELATIONSHIPS</p><h2 id="add-customer-title">{customer ? 'Edit Customer' : 'Add Customer'}</h2></div></div><button aria-label="Close customer modal" disabled={isSaving} onClick={onClose} type="button"><X size={20} strokeWidth={1.9} aria-hidden="true" /></button></header>
      <form onSubmit={submit}>
        <div className="dt-crm-modal-grid">
          <label><span>First Name</span><input name="firstName" onChange={update} required type="text" value={form.firstName} /></label>
          <label><span>Last Name</span><input name="lastName" onChange={update} type="text" value={form.lastName} /></label>
          <label><span>Company</span><input name="company" onChange={update} type="text" value={form.company} /></label>
          <label><span>Email</span><input name="email" onChange={update} type="email" value={form.email} /></label>
          <label><span>Phone</span><input name="phone" onChange={update} type="tel" value={form.phone} /></label>
          <label><span>Lead Source</span><select name="leadSource" onChange={update} value={form.leadSource}><option>Website</option><option>Referral</option><option>Event</option><option>Outbound</option><option>Partner</option></select></label>
          <label><span>Status</span><select name="status" onChange={update} value={form.status}><option>Lead</option><option>Active</option><option>VIP</option><option>Inactive</option></select></label>
          <label><span>Tags</span><input name="tags" onChange={update} type="text" value={form.tags} /></label>
          <label><span>Address</span><input name="address" onChange={update} type="text" value={form.address} /></label>
          <label><span>City</span><input name="city" onChange={update} type="text" value={form.city} /></label>
          <label><span>State</span><input name="state" onChange={update} type="text" value={form.state} /></label>
          <label><span>Country</span><input name="country" onChange={update} type="text" value={form.country} /></label>
        </div>
        {error ? <p className="dt-crm-empty-state">{error}</p> : null}
        <footer><button className="dt-crm-modal-cancel" disabled={isSaving} onClick={onClose} type="button">Cancel</button><button className="dt-crm-modal-submit" disabled={isSaving} type="submit">{isSaving ? <Loader2 className="dt-crm-ai-spin" size={17} /> : <Sparkles size={17} strokeWidth={1.9} aria-hidden="true" />}{isSaving ? 'Saving…' : 'Save Customer'}</button></footer>
      </form>
    </motion.section>
  </motion.div> : null}</AnimatePresence>
}
