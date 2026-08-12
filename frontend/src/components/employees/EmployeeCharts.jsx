import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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

const departmentData = [
  { label: 'Revenue', value: 34 },
  { label: 'Engineering', value: 42 },
  { label: 'Growth', value: 24 },
  { label: 'People', value: 17 },
  { label: 'Operations', value: 28 },
  { label: 'Finance', value: 15 },
]

const hiringData = [
  { label: 'Feb', value: 4 },
  { label: 'Mar', value: 7 },
  { label: 'Apr', value: 5 },
  { label: 'May', value: 10 },
  { label: 'Jun', value: 8 },
  { label: 'Jul', value: 14 },
]

const growthData = [
  { label: 'Jan', value: 139 },
  { label: 'Feb', value: 144 },
  { label: 'Mar', value: 151 },
  { label: 'Apr', value: 158 },
  { label: 'May', value: 165 },
  { label: 'Jun', value: 172 },
  { label: 'Jul', value: 186 },
]

const attritionData = [
  { label: 'Q1', value: 4.8 },
  { label: 'Q2', value: 3.7 },
  { label: 'Q3', value: 3.1 },
  { label: 'Q4', value: 2.6 },
]

const locationData = [
  { label: 'Bengaluru HQ', value: 92 },
  { label: 'Hyderabad Office', value: 41 },
  { label: 'Remote', value: 53 },
]

const attendanceTrendData = [
  { label: 'Mon', value: 97 },
  { label: 'Tue', value: 95 },
  { label: 'Wed', value: 96 },
  { label: 'Thu', value: 93 },
  { label: 'Fri', value: 91 },
]

const genderData = [
  { label: 'Male', value: 104 },
  { label: 'Female', value: 78 },
  { label: 'Other', value: 4 },
]

const employmentTypeData = [
  { label: 'Full-time', value: 152 },
  { label: 'Contract', value: 24 },
  { label: 'Part-time', value: 10 },
]

const pieColors = ['#C8972F', '#6E91C8', '#9A7BC8', '#5D9A72', '#D8B25E', '#D8903E']

function EmployeeTooltip({ active, label, payload, suffix = '' }) {
  if (!active || !payload?.length) return null

  return (
    <div className="dt-employees-chart-tooltip">
      <span>{label || payload[0].name}</span>
      <strong>{payload[0].value}{suffix}</strong>
    </div>
  )
}

function ChartCard({ children, eyebrow, title, value }) {
  return (
    <motion.article
      className="dt-employees-chart-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="dt-employees-section-heading">
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

export default function EmployeeCharts() {
  return (
    <section className="dt-employees-charts-grid">
      <ChartCard eyebrow="DEPARTMENT DISTRIBUTION" title="Teams at a glance" value="12 teams">
        <div className="dt-employees-chart is-donut">
          <ResponsiveContainer height={230} width="100%">
            <PieChart>
              <Tooltip content={<EmployeeTooltip />} />
              <Pie cx="50%" cy="50%" data={departmentData} dataKey="value" innerRadius={58} outerRadius={83} paddingAngle={3} stroke="none">
                {departmentData.map((entry, index) => <Cell fill={pieColors[index]} key={entry.label} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="dt-employees-donut-center"><strong>186</strong><span>people</span></div>
        </div>
        <div className="dt-employees-department-legend">
          {departmentData.slice(0, 4).map((item, index) => <span key={item.label}><i style={{ background: pieColors[index] }} />{item.label}</span>)}
        </div>
      </ChartCard>

      <ChartCard eyebrow="HIRING TREND" title="Intentional team growth" value="+14 hires">
        <div className="dt-employees-chart">
          <ResponsiveContainer height={230} width="100%">
            <AreaChart data={hiringData} margin={{ bottom: 0, left: -24, right: 6, top: 10 }}>
              <defs>
                <linearGradient id="dt-employees-hiring-gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#C8972F" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#C8972F" stopOpacity="0.01" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(11, 23, 51, 0.07)" strokeDasharray="3 6" vertical={false} />
              <XAxis axisLine={false} dataKey="label" tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <YAxis axisLine={false} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <Tooltip content={<EmployeeTooltip />} cursor={{ stroke: 'rgba(200, 151, 47, 0.16)', strokeWidth: 1 }} />
              <Area activeDot={{ fill: '#C8972F', r: 5, stroke: '#FFFDF9', strokeWidth: 2 }} dataKey="value" fill="url(#dt-employees-hiring-gradient)" stroke="#C8972F" strokeWidth={3} type="monotone" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard eyebrow="EMPLOYEE GROWTH" title="A steadily expanding workforce" value="+33.8%">
        <div className="dt-employees-chart">
          <ResponsiveContainer height={230} width="100%">
            <LineChart data={growthData} margin={{ bottom: 0, left: -24, right: 6, top: 10 }}>
              <CartesianGrid stroke="rgba(11, 23, 51, 0.07)" strokeDasharray="3 6" vertical={false} />
              <XAxis axisLine={false} dataKey="label" tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <YAxis axisLine={false} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <Tooltip content={<EmployeeTooltip />} cursor={{ stroke: 'rgba(110, 145, 200, 0.2)', strokeWidth: 1 }} />
              <Line activeDot={{ fill: '#6E91C8', r: 5, stroke: '#FFFDF9', strokeWidth: 2 }} dataKey="value" dot={false} stroke="#6E91C8" strokeWidth={3} type="monotone" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard eyebrow="ATTRITION RATE" title="Retention is strengthening" value="2.6%">
        <div className="dt-employees-chart">
          <ResponsiveContainer height={230} width="100%">
            <BarChart data={attritionData} margin={{ bottom: 0, left: -24, right: 6, top: 10 }}>
              <CartesianGrid stroke="rgba(11, 23, 51, 0.07)" strokeDasharray="3 6" vertical={false} />
              <XAxis axisLine={false} dataKey="label" tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <YAxis axisLine={false} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <Tooltip content={<EmployeeTooltip suffix="%"/>} cursor={{ fill: 'rgba(200, 151, 47, 0.05)' }} />
              <Bar dataKey="value" fill="#5D9A72" maxBarSize={34} radius={[8, 8, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard eyebrow="EMPLOYEES BY LOCATION" title="Where the team works from" value="3 sites">
        <div className="dt-employees-chart">
          <ResponsiveContainer height={230} width="100%">
            <BarChart data={locationData} layout="vertical" margin={{ bottom: 0, left: 10, right: 16, top: 10 }}>
              <CartesianGrid horizontal={false} stroke="rgba(11, 23, 51, 0.07)" strokeDasharray="3 6" />
              <XAxis axisLine={false} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} type="number" />
              <YAxis axisLine={false} dataKey="label" tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} type="category" width={100} />
              <Tooltip content={<EmployeeTooltip />} cursor={{ fill: 'rgba(110, 145, 200, 0.06)' }} />
              <Bar dataKey="value" fill="#6E91C8" maxBarSize={20} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard eyebrow="ATTENDANCE TREND" title="Weekly presence stays strong" value="94.4% avg">
        <div className="dt-employees-chart">
          <ResponsiveContainer height={230} width="100%">
            <AreaChart data={attendanceTrendData} margin={{ bottom: 0, left: -24, right: 6, top: 10 }}>
              <defs>
                <linearGradient id="dt-employees-attendance-gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#5D9A72" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#5D9A72" stopOpacity="0.01" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(11, 23, 51, 0.07)" strokeDasharray="3 6" vertical={false} />
              <XAxis axisLine={false} dataKey="label" tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <YAxis axisLine={false} domain={[80, 100]} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <Tooltip content={<EmployeeTooltip suffix="%" />} cursor={{ stroke: 'rgba(93, 154, 114, 0.16)', strokeWidth: 1 }} />
              <Area activeDot={{ fill: '#5D9A72', r: 5, stroke: '#FFFDF9', strokeWidth: 2 }} dataKey="value" fill="url(#dt-employees-attendance-gradient)" stroke="#5D9A72" strokeWidth={3} type="monotone" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard eyebrow="GENDER DISTRIBUTION" title="A balanced, growing team" value="186 people">
        <div className="dt-employees-chart is-donut">
          <ResponsiveContainer height={230} width="100%">
            <PieChart>
              <Tooltip content={<EmployeeTooltip />} />
              <Pie cx="50%" cy="50%" data={genderData} dataKey="value" innerRadius={58} outerRadius={83} paddingAngle={3} stroke="none">
                {genderData.map((entry, index) => <Cell fill={pieColors[index]} key={entry.label} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="dt-employees-department-legend">
          {genderData.map((item, index) => <span key={item.label}><i style={{ background: pieColors[index] }} />{item.label}</span>)}
        </div>
      </ChartCard>

      <ChartCard eyebrow="EMPLOYMENT TYPE" title="Mostly full-time, by design" value="81.7% full-time">
        <div className="dt-employees-chart is-donut">
          <ResponsiveContainer height={230} width="100%">
            <PieChart>
              <Tooltip content={<EmployeeTooltip />} />
              <Pie cx="50%" cy="50%" data={employmentTypeData} dataKey="value" innerRadius={58} outerRadius={83} paddingAngle={3} stroke="none">
                {employmentTypeData.map((entry, index) => <Cell fill={pieColors[index]} key={entry.label} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="dt-employees-department-legend">
          {employmentTypeData.map((item, index) => <span key={item.label}><i style={{ background: pieColors[index] }} />{item.label}</span>)}
        </div>
      </ChartCard>
    </section>
  )
}
