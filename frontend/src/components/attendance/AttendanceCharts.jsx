import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const dailyData = [
  { label: '09:00', value: 28 },
  { label: '10:00', value: 84 },
  { label: '11:00', value: 122 },
  { label: '12:00', value: 142 },
  { label: '13:00', value: 145 },
  { label: '14:00', value: 142 },
]

const weeklyData = [
  { label: 'Mon', value: 91 },
  { label: 'Tue', value: 94 },
  { label: 'Wed', value: 89 },
  { label: 'Thu', value: 93 },
  { label: 'Fri', value: 96 },
  { label: 'Sat', value: 78 },
  { label: 'Sun', value: 72 },
]

const monthlyData = [
  { label: 'Jan', value: 89 },
  { label: 'Feb', value: 91 },
  { label: 'Mar', value: 90 },
  { label: 'Apr', value: 93 },
  { label: 'May', value: 95 },
  { label: 'Jun', value: 94 },
  { label: 'Jul', value: 96 },
]

const departmentData = [
  { label: 'Revenue', value: 97 },
  { label: 'People', value: 94 },
  { label: 'Finance', value: 92 },
  { label: 'Operations', value: 96 },
  { label: 'Growth', value: 90 },
]

function AttendanceTooltip({ active, label, payload, suffix = '' }) {
  if (!active || !payload?.length) return null

  return (
    <div className="dt-attendance-chart-tooltip">
      <span>{label}</span>
      <strong>{payload[0].value}{suffix}</strong>
    </div>
  )
}

function ChartCard({ children, eyebrow, title, value }) {
  return (
    <motion.article
      className="dt-attendance-chart-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="dt-attendance-section-heading">
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

export default function AttendanceCharts() {
  return (
    <section className="dt-attendance-charts-grid">
      <ChartCard eyebrow="DAILY ATTENDANCE" title="Live check-in movement" value="142 present">
        <div className="dt-attendance-chart">
          <ResponsiveContainer height={230} width="100%">
            <AreaChart data={dailyData} margin={{ bottom: 0, left: -24, right: 6, top: 10 }}>
              <defs>
                <linearGradient id="dt-attendance-daily-gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#C8972F" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#C8972F" stopOpacity="0.01" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(11, 23, 51, 0.07)" strokeDasharray="3 6" vertical={false} />
              <XAxis axisLine={false} dataKey="label" tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <YAxis axisLine={false} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <Tooltip content={<AttendanceTooltip />} cursor={{ stroke: 'rgba(200, 151, 47, 0.16)', strokeWidth: 1 }} />
              <Area activeDot={{ fill: '#C8972F', r: 5, stroke: '#FFFDF9', strokeWidth: 2 }} dataKey="value" fill="url(#dt-attendance-daily-gradient)" stroke="#C8972F" strokeWidth={3} type="monotone" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard eyebrow="WEEKLY ATTENDANCE" title="Team consistency" value="92.4%">
        <div className="dt-attendance-chart">
          <ResponsiveContainer height={230} width="100%">
            <BarChart data={weeklyData} margin={{ bottom: 0, left: -24, right: 6, top: 10 }}>
              <CartesianGrid stroke="rgba(11, 23, 51, 0.07)" strokeDasharray="3 6" vertical={false} />
              <XAxis axisLine={false} dataKey="label" tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <YAxis axisLine={false} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <Tooltip content={<AttendanceTooltip suffix="%"/>} cursor={{ fill: 'rgba(200, 151, 47, 0.05)' }} />
              <Bar dataKey="value" fill="#6E91C8" maxBarSize={28} radius={[8, 8, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard eyebrow="MONTHLY ATTENDANCE" title="Attendance is trending up" value="+2.4%">
        <div className="dt-attendance-chart">
          <ResponsiveContainer height={230} width="100%">
            <LineChart data={monthlyData} margin={{ bottom: 0, left: -24, right: 6, top: 10 }}>
              <CartesianGrid stroke="rgba(11, 23, 51, 0.07)" strokeDasharray="3 6" vertical={false} />
              <XAxis axisLine={false} dataKey="label" tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <YAxis axisLine={false} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <Tooltip content={<AttendanceTooltip suffix="%"/>} cursor={{ stroke: 'rgba(200, 151, 47, 0.16)', strokeWidth: 1 }} />
              <Line activeDot={{ fill: '#5D9A72', r: 5, stroke: '#FFFDF9', strokeWidth: 2 }} dataKey="value" dot={false} stroke="#5D9A72" strokeWidth={3} type="monotone" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard eyebrow="DEPARTMENT ATTENDANCE" title="Where teams are strongest" value="96.2%">
        <div className="dt-attendance-chart">
          <ResponsiveContainer height={230} width="100%">
            <BarChart data={departmentData} layout="vertical" margin={{ bottom: 0, left: 6, right: 18, top: 10 }}>
              <CartesianGrid horizontal={false} stroke="rgba(11, 23, 51, 0.07)" strokeDasharray="3 6" />
              <XAxis axisLine={false} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} type="number" />
              <YAxis axisLine={false} dataKey="label" tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} type="category" width={76} />
              <Tooltip content={<AttendanceTooltip suffix="%"/>} cursor={{ fill: 'rgba(200, 151, 47, 0.05)' }} />
              <Bar dataKey="value" fill="#D8B25E" maxBarSize={18} radius={[0, 7, 7, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </section>
  )
}
