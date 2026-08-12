import { motion } from 'framer-motion'
import { Building2, CircleCheck, MapPin, Tag, UserPlus, Users } from 'lucide-react'

export default function CrmSummary({ customers, total }) {
  const companies = new Set(customers.map((customer) => customer.company).filter(Boolean)).size
  const leads = customers.filter((customer) => customer.status === 'Lead').length
  const active = customers.filter((customer) => customer.status === 'Active').length
  const locations = new Set(customers.map((customer) => customer.city).filter(Boolean)).size
  const tagged = customers.filter((customer) => customer.tags).length
  const summaryItems = [
    { label: 'Total Customers', value: total.toLocaleString(), detail: 'Persisted customer records', icon: Users, tone: 'blue' },
    { label: 'Loaded Leads', value: leads.toLocaleString(), detail: 'In current directory results', icon: UserPlus, tone: 'gold' },
    { label: 'Companies', value: companies.toLocaleString(), detail: 'In current directory results', icon: Building2, tone: 'purple' },
    { label: 'Active Customers', value: active.toLocaleString(), detail: 'In current directory results', icon: CircleCheck, tone: 'green' },
    { label: 'Locations', value: locations.toLocaleString(), detail: 'Cities in current directory results', icon: MapPin, tone: 'gold' },
    { label: 'Tagged Customers', value: tagged.toLocaleString(), detail: 'With recorded customer tags', icon: Tag, tone: 'green' },
  ]

  return (
    <section className="dt-crm-summary-grid" aria-label="Customer relationship summary">
      {summaryItems.map(({ detail, icon: Icon, label, tone, value }, index) => (
        <motion.article className="dt-crm-summary-card" key={label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}>
          <div><span className={'dt-crm-summary-icon is-' + tone}><Icon size={19} strokeWidth={1.85} aria-hidden="true" /></span><span className={'dt-crm-summary-live is-' + tone}><i /> Live</span></div>
          <p>{label}</p><strong>{value}</strong><small className={'is-' + tone}>{detail}</small>
        </motion.article>
      ))}
    </section>
  )
}
