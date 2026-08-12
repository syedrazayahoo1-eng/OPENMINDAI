import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const monthlyLeaveData = [
  { label: 'Feb', value: 12 },
  { label: 'Mar', value: 18 },
  { label: 'Apr', value: 15 },
  { label: 'May', value: 23 },
  { label: 'Jun', value: 28 },
  { label: 'Jul', value: 31 },
]

const departmentLeaveData = [
  { label: 'Revenue', value: 8 },
  { label: 'Engineering', value: 6 },
  { label: 'Growth', value: 5 },
  { label: 'Operations', value: 4 },
  { label: 'People', value: 3 },
]

const leaveTypeData = [
  { label: 'Annual', value: 46 },
  { label: 'Sick', value: 18 },
  { label: 'Casual', value: 15 },
  { label: 'WFH', value: 13 },
  { label: 'Parental', value: 8 },
]

const pieColors = ['#C8972F', '#6E91C8', '#9A7BC8', '#5D9A72', '#D8903E']

function LeaveTooltip({ active, label, payload, suffix = '' }) {
  if (!active || !payload?.length) return null

  return (
    <div className="dt-leaves-chart-tooltip">
      <span>{label || payload[0].name}</span>
      <strong>{payload[0].value}{suffix}</strong>
    </div>
  )
}

function ChartCard({ children, eyebrow, title, value }) {
  return (
    <motion.article
      className="dt-leaves-chart-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="dt-leaves-section-heading">
        <div>
          <p>{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <span>{value}</span>
      </header>
      {children}
    </motion.article>
  )
}

export default function LeaveCharts() {
  return (
    <section className="dt-leaves-charts-grid">
      <ChartCard eyebrow="MONTHLY LEAVE TRENDS" title="Planned time away is rising" value="+10.7%">
        <div className="dt-leaves-chart">
          <ResponsiveContainer height={230} width="100%">
            <AreaChart data={monthlyLeaveData} margin={{ bottom: 0, left: -24, right: 6, top: 10 }}>
              <defs>
                <linearGradient id="dt-leaves-monthly-gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#C8972F" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#C8972F" stopOpacity="0.01" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(11, 23, 51, 0.07)" strokeDasharray="3 6" vertical={false} />
              <XAxis axisLine={false} dataKey="label" tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <YAxis axisLine={false} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <Tooltip content={<LeaveTooltip />} cursor={{ stroke: 'rgba(200, 151, 47, 0.16)', strokeWidth: 1 }} />
              <Area activeDot={{ fill: '#C8972F', r: 5, stroke: '#FFFDF9', strokeWidth: 2 }} dataKey="value" fill="url(#dt-leaves-monthly-gradient)" stroke="#C8972F" strokeWidth={3} type="monotone" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard eyebrow="DEPARTMENT DISTRIBUTION" title="Leave by operating team" value="26 days">
        <div className="dt-leaves-chart">
          <ResponsiveContainer height={230} width="100%">
            <BarChart data={departmentLeaveData} layout="vertical" margin={{ bottom: 0, left: 4, right: 18, top: 10 }}>
              <CartesianGrid horizontal={false} stroke="rgba(11, 23, 51, 0.07)" strokeDasharray="3 6" />
              <XAxis axisLine={false} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} type="number" />
              <YAxis axisLine={false} dataKey="label" tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} type="category" width={76} />
              <Tooltip content={<LeaveTooltip suffix=" days"/>} cursor={{ fill: 'rgba(200, 151, 47, 0.05)' }} />
              <Bar dataKey="value" fill="#6E91C8" maxBarSize={18} radius={[0, 7, 7, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard eyebrow="LEAVE TYPE BREAKDOWN" title="How teams use their leave" value="122 requests">
        <div className="dt-leaves-chart is-donut">
          <ResponsiveContainer height={230} width="100%">
            <PieChart>
              <Tooltip content={<LeaveTooltip suffix="%"/>} />
              <Pie cx="50%" cy="50%" data={leaveTypeData} dataKey="value" innerRadius={58} outerRadius={83} paddingAngle={3} stroke="none">
                {leaveTypeData.map((entry, index) => <Cell fill={pieColors[index]} key={entry.label} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="dt-leaves-donut-center"><strong>58%</strong><span>annual</span></div>
        </div>
        <div className="dt-leaves-type-legend">
          {leaveTypeData.slice(0, 4).map((item, index) => <span key={item.label}><i style={{ background: pieColors[index] }} />{item.label}</span>)}
        </div>
      </ChartCard>
    </section>
  )
}
