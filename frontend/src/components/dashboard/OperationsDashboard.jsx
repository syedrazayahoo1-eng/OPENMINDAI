import { memo, useEffect, useMemo, useState } from 'react'
import { Activity, AlertTriangle, BrainCircuit, Database, Radio, Server } from 'lucide-react'
import api from '../../services/api'
import useLiveMonitoring from '../../hooks/useLiveMonitoring'
import ChartWidget from './ChartWidget'

const services = ['database', 'redis', 'signalR', 'azureAi', 'googleBusiness', 'smtp', 'teams']
const label = (name) => ({ database: 'Database', redis: 'Redis', signalR: 'SignalR', azureAi: 'Azure AI', googleBusiness: 'Google Business', smtp: 'SMTP', teams: 'Teams' })[name] || name
const status = (value) => String(value || '').includes('not-configured') || String(value || '').includes('in-memory') || String(value || '').includes('local') ? 'warning' : 'healthy'
const format = (value) => `${Math.round(Number(value || 0))} ms`
const displayServiceStatus = (value) => {
  if (value == null) return 'Awaiting status'
  if (typeof value !== 'object') return String(value)
  return `${value.connections ?? 0} connections · ${value.users ?? 0} users`
}

function OperationsDashboard() {
  const [report, setReport] = useState(null)
  const [history, setHistory] = useState([])
  const [error, setError] = useState(null)
  useEffect(() => { let active = true; api.get('/monitoring/report').then(({ data }) => active && setReport(data)).catch(() => active && setError('Monitoring data is temporarily unavailable.')); return () => { active = false } }, [])
  useLiveMonitoring({ MonitoringUpdated: (next) => { setReport(next); setHistory((items) => [...items, { label: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }), value: next?.system?.averageApiResponseMs || 0 }].slice(-12)) } })
  const cards = useMemo(() => services.map((name) => ({ name, value: report?.services?.[name] })), [report])
  const metrics = report ? [
    ['Active Users', report.system?.activeUsers], ['Online AI Agents', report.system?.activeUsers], ['Running Workflows', report.workflows?.running], ['Queued Workflows', report.workflows?.queued], ['Completed Workflows', report.workflows?.completed], ['Failed Workflows', report.workflows?.failed], ['AI Response', format(report.ai?.averageResponseMs)], ['API Response', format(report.system?.averageApiResponseMs)],
  ] : []
  return <section className="dt-operations" aria-label="Live operations dashboard"><header><div><p>LIVE OPERATIONS</p><h2>Enterprise Monitoring</h2></div><span><i /> SignalR live</span></header>{error && <p className="dt-operations-error">{error}</p>}<div className="dt-operations-metrics">{metrics.map(([name, value]) => <article key={name}><small>{name}</small><strong>{value ?? 0}</strong></article>)}</div><div className="dt-operations-grid"><section className="dt-operations-health"><h3><Server size={17} /> System health</h3>{cards.map(({ name, value }) => <article key={name}><span className={`is-${status(value)}`} /><div><strong>{label(name)}</strong><small>{displayServiceStatus(value)}</small></div><time>{format(name === 'azureAi' ? report?.ai?.averageResponseMs : report?.system?.averageApiResponseMs)}</time></article>)}</section><section className="dt-operations-chart"><h3><Activity size={17} /> API response time</h3><ChartWidget accent="#6E91C8" chartType="line" data={history.length ? history : [{ label: 'Now', value: report?.system?.averageApiResponseMs || 0 }]} /><div className="dt-operations-summary"><span><BrainCircuit size={15} /> AI {format(report?.ai?.averageResponseMs)}</span><span><Database size={15} /> Memory {Math.round((report?.system?.memoryBytes || 0) / 1048576)} MB</span><span><Radio size={15} /> {report?.system?.signalRConnections || 0} connections</span></div></section><section className="dt-operations-alerts"><h3><AlertTriangle size={17} /> Alert center</h3>{(report?.warnings || []).slice(0, 5).map((item, index) => <article key={`${item.occurredAt}-${index}`}><b className={item.type === 'Exception' ? 'critical' : 'warning'}>{item.type === 'Exception' ? 'Critical' : 'Warning'}</b><div><strong>{item.source || item.dependency || item.type}</strong><p>{item.message || `${item.path || 'Service'} ${item.durationMs ? `${Math.round(item.durationMs)} ms` : ''}`}</p><small>{item.occurredAt ? new Date(item.occurredAt).toLocaleString() : 'Now'}</small></div></article>)}{!report?.warnings?.length && <p>No operational alerts.</p>}</section></div></section>
}
export default memo(OperationsDashboard)
