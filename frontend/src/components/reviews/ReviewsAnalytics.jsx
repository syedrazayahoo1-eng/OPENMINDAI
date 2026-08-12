import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const ratingTrend = [
  { label: 'Jan', value: 4.3 },
  { label: 'Feb', value: 4.4 },
  { label: 'Mar', value: 4.5 },
  { label: 'Apr', value: 4.4 },
  { label: 'May', value: 4.6 },
  { label: 'Jun', value: 4.6 },
  { label: 'Jul', value: 4.7 },
]

const sentimentTrend = [
  { label: 'Jan', positive: 64, negative: 14 },
  { label: 'Feb', positive: 66, negative: 13 },
  { label: 'Mar', positive: 68, negative: 12 },
  { label: 'Apr', positive: 67, negative: 13 },
  { label: 'May', positive: 70, negative: 11 },
  { label: 'Jun', positive: 71, negative: 10 },
  { label: 'Jul', positive: 72, negative: 10 },
]

const reviewSources = [
  { label: 'Google', value: 6420, color: '#C8972F' },
  { label: 'Yelp', value: 3180, color: '#6E91C8' },
  { label: 'Facebook', value: 2260, color: '#7d5dae' },
  { label: 'Trustpilot', value: 1740, color: '#5d9a72' },
  { label: 'App Store', value: 1262, color: '#D8B25E' },
]

const monthlyReviews = [
  { label: 'Jan', value: 1620 },
  { label: 'Feb', value: 1745 },
  { label: 'Mar', value: 1810 },
  { label: 'Apr', value: 1902 },
  { label: 'May', value: 2040 },
  { label: 'Jun', value: 2188 },
  { label: 'Jul', value: 2318 },
]

function ReviewsChartTooltip({ active, label, payload, suffix = '' }) {
  if (!active || !payload?.length) return null

  return (
    <div className="dt-reviews-chart-tooltip">
      <span>{label}</span>
      {payload.map((entry) => (
        <strong key={entry.dataKey} style={{ color: entry.color }}>{entry.name}: {entry.value}{suffix}</strong>
      ))}
    </div>
  )
}

function AnalyticsCard({ children, eyebrow, title, value }) {
  return (
    <motion.article
      className="dt-reviews-analytics-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="dt-reviews-section-heading">
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

export default function ReviewsAnalytics() {
  return (
    <section className="dt-reviews-analytics-grid">
      <AnalyticsCard eyebrow="OVERALL RATING TREND" title="Average rating is climbing steadily" value="4.7 ★">
        <div className="dt-reviews-chart">
          <ResponsiveContainer height={230} width="100%">
            <AreaChart data={ratingTrend} margin={{ bottom: 0, left: -24, right: 6, top: 10 }}>
              <defs>
                <linearGradient id="dt-reviews-rating-gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#C8972F" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#C8972F" stopOpacity="0.01" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(11, 23, 51, 0.07)" strokeDasharray="3 6" vertical={false} />
              <XAxis axisLine={false} dataKey="label" tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <YAxis axisLine={false} domain={[3.5, 5]} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <Tooltip content={<ReviewsChartTooltip />} cursor={{ stroke: 'rgba(200, 151, 47, 0.16)', strokeWidth: 1 }} />
              <Area activeDot={{ fill: '#C8972F', r: 5, stroke: '#FFFDF9', strokeWidth: 2 }} dataKey="value" fill="url(#dt-reviews-rating-gradient)" name="Rating" stroke="#C8972F" strokeWidth={3} type="monotone" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </AnalyticsCard>

      <AnalyticsCard eyebrow="SENTIMENT TREND" title="Positive sentiment outpacing negative" value="+2% MoM">
        <div className="dt-reviews-chart">
          <ResponsiveContainer height={230} width="100%">
            <LineChart data={sentimentTrend} margin={{ bottom: 0, left: -24, right: 6, top: 10 }}>
              <CartesianGrid stroke="rgba(11, 23, 51, 0.07)" strokeDasharray="3 6" vertical={false} />
              <XAxis axisLine={false} dataKey="label" tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <YAxis axisLine={false} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <Tooltip content={<ReviewsChartTooltip suffix="%" />} cursor={{ stroke: 'rgba(200, 151, 47, 0.16)', strokeWidth: 1 }} />
              <Line dataKey="positive" dot={false} name="Positive" stroke="#5d9a72" strokeWidth={3} type="monotone" />
              <Line dataKey="negative" dot={false} name="Negative" stroke="#b3453f" strokeWidth={3} type="monotone" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </AnalyticsCard>

      <AnalyticsCard eyebrow="REVIEW SOURCES" title="Where your reviews come from" value="5 channels">
        <div className="dt-reviews-chart">
          <ResponsiveContainer height={230} width="100%">
            <PieChart margin={{ bottom: 0, left: 0, right: 0, top: 10 }}>
              <Pie data={reviewSources} dataKey="value" innerRadius={54} nameKey="label" outerRadius={82} paddingAngle={2}>
                {reviewSources.map((source) => <Cell fill={source.color} key={source.label} />)}
              </Pie>
              <Tooltip content={<ReviewsChartTooltip />} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </AnalyticsCard>

      <AnalyticsCard eyebrow="MONTHLY REVIEWS" title="Review volume keeps growing" value="2,318">
        <div className="dt-reviews-chart">
          <ResponsiveContainer height={230} width="100%">
            <BarChart data={monthlyReviews} margin={{ bottom: 0, left: -24, right: 6, top: 10 }}>
              <CartesianGrid stroke="rgba(11, 23, 51, 0.07)" strokeDasharray="3 6" vertical={false} />
              <XAxis axisLine={false} dataKey="label" tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <YAxis axisLine={false} tick={{ fill: '#7B8190', fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <Tooltip content={<ReviewsChartTooltip />} cursor={{ fill: 'rgba(200, 151, 47, 0.05)' }} />
              <Bar dataKey="value" fill="#6E91C8" maxBarSize={30} name="Reviews" radius={[8, 8, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </AnalyticsCard>
    </section>
  )
}
