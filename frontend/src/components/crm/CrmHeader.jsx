import { motion } from 'framer-motion'
import { Plus, Sparkles, UsersRound } from 'lucide-react'

export default function CrmHeader({ customerCount, onAddCustomer }) {
  return <motion.section className="dt-crm-header" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
    <div className="dt-crm-header-glow" aria-hidden="true" />
    <div className="dt-crm-header-copy"><span><Sparkles size={15} strokeWidth={1.9} aria-hidden="true" /> ENTERPRISE CUSTOMER INTELLIGENCE</span><h1>Customer Relationship <em>Management</em></h1><p>Manage customers, companies, deals and AI insights from one place.</p></div>
    <div className="dt-crm-header-status"><span><UsersRound size={20} strokeWidth={1.85} aria-hidden="true" /></span><div><small>CUSTOMER DIRECTORY</small><strong>{customerCount} customer{customerCount === 1 ? '' : 's'}</strong><p><i /> Live directory total</p></div></div>
    <button className="dt-crm-add-button" onClick={onAddCustomer} type="button"><Plus size={18} strokeWidth={2.2} aria-hidden="true" />Add Customer</button>
  </motion.section>
}
