import { motion } from 'framer-motion'
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const deploymentData = [
  { name: 'Active', value: 18, color: '#C8972F' },
  { name: 'Training', value: 4, color: '#6E91C8' },
  { name: 'Paused', value: 3, color: '#6A9A76' },
  { name: 'Offline', value: 2, color: '#A4AAB5' },
]

const performanceData = [
  { label: 'Mon', tasks: 624 },
  { label: 'Tue', tasks: 712 },
  { label: 'Wed', tasks: 684 },
  { label: 'Thu', tasks: 842 },
  { label: 'Fri', tasks: 936 },
  { label: 'Sat', tasks: 1012 },
  { label: 'Sun', tasks: 1284 },
]

function AgentChartTooltip({ active, label, payload }) {
  if (!active || !payload?.length) return null

  return (
    <div className="dt-agents-chart-tooltip">
      <span>{label || payload[0].name}</span>
      <strong>{payload[0].value.toLocaleString('en-IN')} tasks</strong>
    </div>
  )
}

export default function AgentAnalytics() {
  return (
    <section className="dt-agents-analytics-grid">
      <motion.article
        className="dt-agents-analytics-card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="dt-agents-section-heading">
          <div>
            <p>DEPLOYMENT OVERVIEW</p>
            <h2>Agent availability</h2>
          </div>
          <span className="dt-agents-pill">27 total</span>
        </header>
        <div className="dt-agents-deployment-chart">
          <ResponsiveContainer height={245} width="100%">
            <PieChart>
              <Tooltip content={<AgentChartTooltip />} />
              <Pie
                cx="50%"
                cy="50%"
                data={deploymentData}
                dataKey="value"
                innerRadius="60%"
                outerRadius="82%"
                paddingAngle={4}
                stroke="none"
              >
                {deploymentData.map((entry) => <Cell fill={entry.color} key={entry.name} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="dt-agents-deployment-center"><strong>18</strong><span>active</span></div>
        </div>
        <div className="dt-agents-deployment-legend">
          {deploymentData.map((item) => (
            <span key={item.name}><i style={{ background: item.color }} />{item.name}<strong>{item.value}</strong></span>
          ))}
        </div>
      </motion.article>

      <motion.article
        className="dt-agents-analytics-card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="dt-agents-section-heading">
          <div>
            <p>LIVE PERFORMANCE</p>
            <h2>Tasks completed</h2>
          </div>
          <span className="dt-agents-positive-text">+22.7%</span>
        </header>
        <div className="dt-agents-line-chart">
          <ResponsiveContainer height={245} width="100%">
            <LineChart data={performanceData} margin={{ bottom: 0, left: -20, right: 6, top: 12 }}>
              <CartesianGrid stroke="rgba(11, 23, 51, 0.07)" strokeDasharray="3 6" vertical={false} />
              <XAxis axisLine={false} dataKey="label" tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <YAxis axisLine={false} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <Tooltip content={<AgentChartTooltip />} cursor={{ stroke: 'rgba(200, 151, 47, 0.16)', strokeWidth: 1 }} />
              <Line activeDot={{ fill: '#C8972F', r: 5, stroke: '#FFFDF9', strokeWidth: 2 }} dataKey="tasks" dot={false} stroke="#C8972F" strokeWidth={3} type="monotone" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="dt-agents-performance-footer">
          <span><i /> 1,284 tasks completed today</span>
          <small>Past 7 days</small>
        </div>
      </motion.article>
    </section>
  )
}
