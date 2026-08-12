import { motion } from 'framer-motion'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function ChartCard({ data, title, value }) {
  return <motion.article className="dt-crm-analytics-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
    <header className="dt-crm-section-heading"><div><p>LIVE CRM DATA</p><h2>{title}</h2></div><span>{value}</span></header>
    {data.length ? <div className="dt-crm-chart"><ResponsiveContainer height={244} width="100%"><BarChart data={data} margin={{ bottom: 0, left: -24, right: 6, top: 10 }}><CartesianGrid stroke="rgba(11, 23, 51, 0.07)" strokeDasharray="3 6" vertical={false} /><XAxis axisLine={false} dataKey="label" tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} /><YAxis allowDecimals={false} axisLine={false} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} /><Tooltip cursor={{ fill: 'rgba(200, 151, 47, 0.05)' }} /><Bar dataKey="value" fill="#6E91C8" maxBarSize={30} radius={[8, 8, 4, 4]} /></BarChart></ResponsiveContainer></div> : <p className="dt-crm-empty-state">No customer data is available yet.</p>}
  </motion.article>
}

const countBy = (customers, selector) => Object.entries(customers.reduce((counts, customer) => { const key = selector(customer) || 'Unspecified'; counts[key] = (counts[key] || 0) + 1; return counts }, {})).map(([label, value]) => ({ label, value }))

export default function CrmAnalytics({ customers }) {
  const statusData = countBy(customers, (customer) => customer.status)
  const sourceData = countBy(customers, (customer) => customer.leadSource)
  const cityData = countBy(customers, (customer) => customer.city)
  return <section className="dt-crm-analytics-grid"><ChartCard data={statusData} title="Customers by status" value={customers.length} /><ChartCard data={sourceData} title="Customers by lead source" value={sourceData.length} /><ChartCard data={cityData} title="Customers by location" value={cityData.length} /></section>
}
