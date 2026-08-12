import { motion } from 'framer-motion'
import { ArrowRight, CircleDot, Sparkles, UserRoundCheck } from 'lucide-react'

export default function CrmAssistant({ customers, onView }) {
  const leads = customers.filter((customer) => customer.status === 'Lead')
  const active = customers.filter((customer) => customer.status === 'Active')
  const priorityCustomers = [...leads, ...active].slice(0, 2)
  return <motion.aside className="dt-crm-assistant" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
    <div className="dt-crm-assistant-glow" aria-hidden="true" />
    <header className="dt-crm-assistant-head"><span><Sparkles size={22} strokeWidth={1.85} aria-hidden="true" /></span><div><p>DIGITECH AI</p><h2>CRM Assistant</h2></div><small><i /> Live</small></header>
    <section className="dt-crm-assistant-section"><div className="dt-crm-assistant-title"><p>Customer follow-up queue</p></div>{priorityCustomers.length ? priorityCustomers.map((customer) => <article className="dt-crm-followup" key={customer.id}><span className="is-gold">{customer.firstName?.slice(0, 1)}</span><div><strong>{[customer.firstName, customer.lastName].filter(Boolean).join(' ')}</strong><p>{customer.status} · {customer.company || 'No company recorded'}</p></div><button aria-label={'Open ' + customer.firstName} onClick={() => onView(customer)} type="button"><ArrowRight size={15} strokeWidth={2} aria-hidden="true" /></button></article>) : <p className="dt-crm-empty-state">No customers need follow-up yet.</p>}</section>
    <section className="dt-crm-assistant-section"><div className="dt-crm-assistant-title"><p>Directory insights</p></div><article className="dt-crm-recommendation"><span><CircleDot size={16} strokeWidth={1.85} aria-hidden="true" /></span><p>{leads.length} lead{leads.length === 1 ? '' : 's'} currently recorded.</p></article><article className="dt-crm-recommendation"><span><UserRoundCheck size={16} strokeWidth={1.85} aria-hidden="true" /></span><p>{active.length} active customer{active.length === 1 ? '' : 's'} currently recorded.</p></article></section>
  </motion.aside>
}
