import { useId } from 'react'
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

function ChartTooltip({ active, label, payload, suffix = '', valuePrefix = '' }) {
  if (!active || !payload?.length) return null

  const value = payload[0].value

  return (
    <div className="dt-dashboard-chart-tooltip">
      <span>{label || payload[0].name}</span>
      <strong>{valuePrefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}{suffix}</strong>
    </div>
  )
}

export default function ChartWidget({
  accent = '#C8972F',
  chartType = 'area',
  data,
  dataKey = 'value',
  labelKey = 'label',
  suffix,
  valuePrefix,
}) {
  const gradientId = 'dt-dashboard-gradient-' + useId().replace(/:/g, '')
  const chartHeight = 248
  const tooltip = <Tooltip content={<ChartTooltip suffix={suffix} valuePrefix={valuePrefix} />} cursor={{ stroke: 'rgba(200, 151, 47, 0.16)', strokeWidth: 1 }} />

  if (chartType === 'donut') {
    return (
      <div className="dt-dashboard-chart dt-dashboard-chart--donut">
        <ResponsiveContainer height={chartHeight} width="100%">
          <PieChart>
            <Tooltip content={<ChartTooltip suffix={suffix} valuePrefix={valuePrefix} />} />
            <Pie
              cx="50%"
              cy="50%"
              data={data}
              dataKey={dataKey}
              innerRadius="62%"
              outerRadius="82%"
              paddingAngle={4}
              stroke="none"
            >
              {data.map((entry) => <Cell fill={entry.color} key={entry[labelKey]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="dt-dashboard-donut-center">
          <strong>86%</strong>
          <span>adoption</span>
        </div>
      </div>
    )
  }

  if (chartType === 'bar') {
    return (
      <div className="dt-dashboard-chart">
        <ResponsiveContainer height={chartHeight} width="100%">
          <BarChart data={data} margin={{ bottom: 0, left: -20, right: 4, top: 8 }}>
            <CartesianGrid stroke="rgba(11, 23, 51, 0.07)" strokeDasharray="3 6" vertical={false} />
            <XAxis axisLine={false} dataKey={labelKey} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
            <YAxis axisLine={false} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
            {tooltip}
            <Bar dataKey={dataKey} fill={accent} maxBarSize={28} radius={[8, 8, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (chartType === 'line') {
    return (
      <div className="dt-dashboard-chart">
        <ResponsiveContainer height={chartHeight} width="100%">
          <LineChart data={data} margin={{ bottom: 0, left: -20, right: 4, top: 8 }}>
            <CartesianGrid stroke="rgba(11, 23, 51, 0.07)" strokeDasharray="3 6" vertical={false} />
            <XAxis axisLine={false} dataKey={labelKey} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
            <YAxis axisLine={false} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
            {tooltip}
            <Line activeDot={{ fill: accent, r: 5, stroke: '#FFFDF9', strokeWidth: 2 }} dataKey={dataKey} dot={false} stroke={accent} strokeWidth={3} type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="dt-dashboard-chart">
      <ResponsiveContainer height={chartHeight} width="100%">
        <AreaChart data={data} margin={{ bottom: 0, left: -20, right: 4, top: 8 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity="0.32" />
              <stop offset="100%" stopColor={accent} stopOpacity="0.015" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(11, 23, 51, 0.07)" strokeDasharray="3 6" vertical={false} />
          <XAxis axisLine={false} dataKey={labelKey} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
          <YAxis axisLine={false} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
          {tooltip}
          <Area activeDot={{ fill: accent, r: 5, stroke: '#FFFDF9', strokeWidth: 2 }} dataKey={dataKey} fill={'url(#' + gradientId + ')'} stroke={accent} strokeWidth={3} type="monotone" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
