import {
  Bot,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  DollarSign,
  FileCheck,
  HeartPulse,
  MessageSquare,
  UserPlus,
  Users,
  Workflow,
} from 'lucide-react'
import ActivityCard from '../components/dashboard/ActivityCard'
import AiCommandCenter from '../components/dashboard/AiCommandCenter'
import AnalyticsCard from '../components/dashboard/AnalyticsCard'
import ChartWidget from '../components/dashboard/ChartWidget'
import DashboardHero from '../components/dashboard/DashboardHero'
import OperationsDashboard from '../components/dashboard/OperationsDashboard'
import KpiCard from '../components/dashboard/KpiCard'
import DashboardLayout from '../layouts/DashboardLayout'
import useLiveMonitoring from '../hooks/useLiveMonitoring'
import { useState } from 'react'

const kpis = [
  { label: 'Active AI Agents', value: '24', change: '+8.2%', changeLabel: 'vs. last week', icon: Bot, accent: '#C8972F', trend: [15, 17, 16, 20, 18, 22, 24] },
  { label: 'Employees Present', value: '142', change: '+3.8%', changeLabel: 'of 156 team members', icon: Users, accent: '#5D86C8', trend: [117, 121, 125, 119, 132, 138, 142] },
  { label: 'Revenue Today', value: '₹2.84L', change: '+18.4%', changeLabel: 'vs. yesterday', icon: DollarSign, accent: '#B78845', trend: [124, 151, 142, 185, 208, 221, 245] },
  { label: 'Automations Running', value: '38', change: '+4', changeLabel: '100% healthy', icon: Workflow, accent: '#6A9A76', trend: [28, 29, 31, 32, 32, 36, 38] },
  { label: 'Customer Leads', value: '1,248', change: '+12.3%', changeLabel: 'qualified this month', icon: UserPlus, accent: '#9A7BC8', trend: [740, 825, 888, 1018, 1080, 1162, 1248] },
  { label: 'Business Health', value: '92/100', change: '+4.6%', changeLabel: 'enterprise score', icon: HeartPulse, accent: '#D49958', trend: [76, 80, 79, 84, 87, 89, 92] },
]

const revenueData = [
  { label: 'Mon', value: 164 },
  { label: 'Tue', value: 198 },
  { label: 'Wed', value: 183 },
  { label: 'Thu', value: 236 },
  { label: 'Fri', value: 251 },
  { label: 'Sat', value: 284 },
  { label: 'Sun', value: 316 },
]

const attendanceData = [
  { label: 'Mon', value: 132 },
  { label: 'Tue', value: 139 },
  { label: 'Wed', value: 136 },
  { label: 'Thu', value: 142 },
  { label: 'Fri', value: 145 },
]

const aiUsageData = [
  { label: 'Writing', value: 36, color: '#C8972F' },
  { label: 'Analysis', value: 28, color: '#D8B25E' },
  { label: 'Support', value: 21, color: '#7395CC' },
  { label: 'Automation', value: 15, color: '#A586C8' },
]

const automationData = [
  { label: 'Jan', value: 18 },
  { label: 'Feb', value: 24 },
  { label: 'Mar', value: 23 },
  { label: 'Apr', value: 31 },
  { label: 'May', value: 36 },
  { label: 'Jun', value: 38 },
]

const performanceData = [
  { label: 'W1', value: 64 },
  { label: 'W2', value: 71 },
  { label: 'W3', value: 75 },
  { label: 'W4', value: 83 },
  { label: 'W5', value: 91 },
  { label: 'W6', value: 88 },
]

const tasks = [
  { label: 'Review Q3 workforce plan', detail: 'Finance & People Operations', meta: 'Today', icon: ClipboardCheck, tone: 'gold' },
  { label: 'Approve campaign creative', detail: 'Marketing workspace', meta: '2 pending', icon: FileCheck, tone: 'purple' },
  { label: 'Customer success briefing', detail: 'Priority client update', meta: '14:30', icon: CalendarCheck, tone: 'blue' },
]

const activity = [
  { label: 'AI closed 18 customer requests', detail: 'Support automation · 98% confidence', meta: '12 min', icon: Bot, tone: 'gold' },
  { label: 'Monthly finance report generated', detail: 'Finance workspace · Ready for review', meta: '38 min', icon: DollarSign, tone: 'green' },
  { label: 'New enterprise lead assigned', detail: 'CRM · Northstar inbound team', meta: '1 hr', icon: UserPlus, tone: 'purple' },
]

const approvals = [
  { label: 'Vendor onboarding package', detail: 'Submitted by Operations', meta: 'High', icon: CheckCircle2, tone: 'gold' },
  { label: 'Two new access requests', detail: 'Workspace security review', meta: '2 items', icon: Users, tone: 'blue' },
  { label: 'Automation deployment', detail: 'Review routing workflow', meta: 'Ready', icon: Workflow, tone: 'green' },
]

export default function Dashboard() {
  const [liveStatus, setLiveStatus] = useState('Updated moments ago')
  const connection = useLiveMonitoring({ WorkflowStatusChanged: (event) => setLiveStatus(`Workflow ${event.status}`), AgentStatusChanged: (event) => setLiveStatus(`${event.name} ${event.status}`), ReviewUpdated: () => setLiveStatus('Reviews updated'), ConnectionStateChanged: (event) => setLiveStatus(event.status === 'connected' ? `Live · ${event.diagnostics?.activeUsers ?? 1} user${event.diagnostics?.activeUsers === 1 ? '' : 's'}` : `Live connection ${event.status}`) })
  return (
    <DashboardLayout>
      <div className="dt-dashboard-content">
        <DashboardHero />

        <section className="dt-dashboard-kpi-section">
          <div className="dt-dashboard-section-heading">
            <div>
              <p>LIVE ENTERPRISE OVERVIEW</p>
              <h2>Everything is moving in the right direction.</h2>
            </div>
            <span title={connection.error || 'SignalR connection diagnostics'}><i /> {liveStatus}</span>
          </div>
          <div className="dt-dashboard-kpi-grid">
            {kpis.map((kpi, index) => <KpiCard {...kpi} index={index} key={kpi.label} />)}
          </div>
        </section>
        <OperationsDashboard />

        <section className="dt-dashboard-command-grid">
          <div className="dt-dashboard-analytics-stack">
            <div className="dt-dashboard-feature-analytics">
              <AnalyticsCard action="Last 7 days" eyebrow="REVENUE PERFORMANCE" title="Revenue is tracking ahead of plan">
                <div className="dt-dashboard-analytics-metric">
                  <strong>₹12.84L</strong>
                  <span>+18.2% this week</span>
                </div>
                <ChartWidget accent="#C8972F" data={revenueData} valuePrefix="₹" />
              </AnalyticsCard>
              <AnalyticsCard action="This week" eyebrow="TEAM PRESENCE" title="Attendance">
                <div className="dt-dashboard-analytics-metric">
                  <strong>91.0%</strong>
                  <span>142 people today</span>
                </div>
                <ChartWidget accent="#6E91C8" chartType="bar" data={attendanceData} />
              </AnalyticsCard>
            </div>

            <div className="dt-dashboard-small-analytics">
              <AnalyticsCard action="Details" eyebrow="AI ADOPTION" title="AI Usage">
                <ChartWidget chartType="donut" data={aiUsageData} />
                <div className="dt-dashboard-chart-legend">
                  {aiUsageData.map((item) => <span key={item.label}><i style={{ background: item.color }} />{item.label}</span>)}
                </div>
              </AnalyticsCard>
              <AnalyticsCard action="Monthly" eyebrow="AUTOMATION" title="Automation Growth">
                <ChartWidget accent="#6A9A76" chartType="line" data={automationData} />
              </AnalyticsCard>
            </div>
          </div>

          <AiCommandCenter />
        </section>

        <section className="dt-dashboard-business-grid">
          <ActivityCard action="Open tasks" eyebrow="YOUR FOCUS" items={tasks} title="Today’s Tasks" />
          <ActivityCard action="View activity" eyebrow="ENTERPRISE PULSE" items={activity} title="Recent Activity" />
          <ActivityCard action="Review all" eyebrow="ACTIONS REQUIRED" items={approvals} title="Pending Approvals" />
        </section>

        <section className="dt-dashboard-monthly-section">
          <AnalyticsCard action="View report" eyebrow="MONTHLY PERFORMANCE" title="Business performance continues to compound">
            <div className="dt-dashboard-monthly-summary">
              <div>
                <strong>+28.4%</strong>
                <p>Growth across your enterprise operations</p>
              </div>
              <span>Operating above the July target</span>
            </div>
            <ChartWidget accent="#B88642" chartType="area" data={performanceData} suffix="%" />
          </AnalyticsCard>
          <div className="dt-dashboard-performance-note">
            <MessageSquare size={21} strokeWidth={1.85} aria-hidden="true" />
            <div>
              <p>AI recommendation</p>
              <strong>Prioritise the 9 high-intent leads identified today.</strong>
            </div>
            <button type="button">Review now</button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
