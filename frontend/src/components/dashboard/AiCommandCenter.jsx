import { motion } from 'framer-motion'
import { Activity, Bot, CheckCircle2, Clock3, Gauge, MessageSquareText, Radio, Star, Workflow, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getAgents } from '../../services/agentService'
import { getReviews } from '../../services/reviewservice'
import { getWorkflows } from '../../services/workflowService'
import useLiveMonitoring from '../../hooks/useLiveMonitoring'
import NotificationPanel from './NotificationPanel'

const maxItems = 4

const getId = (value) => value?.id ?? value?.agentId ?? value?.workflowId
const toDate = (value) => value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'
const append = (items, item) => [item, ...items].slice(0, maxItems)

function statusTone(status) {
  const normalized = String(status ?? '').toLowerCase()
  if (normalized.includes('fail') || normalized.includes('error')) return 'red'
  if (normalized.includes('run') || normalized.includes('active') || normalized.includes('completed')) return 'green'
  if (normalized.includes('pause') || normalized.includes('wait')) return 'gold'
  return 'blue'
}

export default function AiCommandCenter() {
  const [agents, setAgents] = useState([])
  const [workflows, setWorkflows] = useState([])
  const [reviews, setReviews] = useState([])
  const [logs, setLogs] = useState([])
  const [notifications, setNotifications] = useState([])
  const [health, setHealth] = useState('Connecting')

  useEffect(() => {
    let active = true
    Promise.allSettled([getAgents(), getWorkflows(), getReviews()]).then(([agentResult, workflowResult, reviewResult]) => {
      if (!active) return
      if (agentResult.status === 'fulfilled') setAgents(Array.isArray(agentResult.value) ? agentResult.value : [])
      if (workflowResult.status === 'fulfilled') setWorkflows(Array.isArray(workflowResult.value) ? workflowResult.value : [])
      if (reviewResult.status === 'fulfilled') setReviews(Array.isArray(reviewResult.value) ? reviewResult.value : [])
      setHealth('Operational')
    })
    return () => { active = false }
  }, [])

  const addNotification = (title, detail) => setNotifications((current) => append(current, { title, detail, isNew: true }))

  useLiveMonitoring({
    AgentStatusChanged: (event) => {
      const id = getId(event)
      setAgents((current) => current.map((agent) => String(agent.id) === String(id) ? { ...agent, ...event, id } : agent))
      addNotification(`${event.name ?? 'AI Agent'} ${event.status ?? 'updated'}`, 'Live agent status update.')
      setHealth('Operational')
    },
    WorkflowStatusChanged: (event) => {
      const id = getId(event)
      setWorkflows((current) => current.map((workflow) => String(workflow.id) === String(id) ? { ...workflow, ...event, id, status: event.status ?? workflow.status } : workflow))
      addNotification(`Workflow ${event.status ?? 'updated'}`, event.currentStep ? `Current step: ${event.currentStep}` : 'Live workflow status update.')
      setHealth('Operational')
    },
    WorkflowProgress: (event) => {
      const id = getId(event)
      setWorkflows((current) => current.map((workflow) => String(workflow.id) === String(id) ? { ...workflow, ...event, id, status: event.status ?? workflow.status } : workflow))
      setHealth('Operational')
    },
    WorkflowExecutionLog: (event) => {
      setLogs((current) => append(current, event))
      addNotification(event.stepName ?? 'Workflow execution', event.message ?? 'Execution event received.')
      setHealth('Operational')
    },
    ReviewUpdated: (event) => {
      const id = getId(event)
      if (event.deleted) {
        setReviews((current) => current.filter((review) => String(review.id) !== String(id)))
        addNotification('Google review removed', 'A review was removed from the live feed.')
        setHealth('Operational')
        return
      }
      setReviews((current) => {
        const existing = current.some((review) => String(review.id) === String(id))
        return existing
          ? current.map((review) => String(review.id) === String(id) ? { ...review, ...event, id } : review)
          : [{ ...event, id }, ...current].slice(0, maxItems)
      })
      addNotification('Google review updated', `${event.reviewerName ?? event.customerName ?? 'Customer'} review is ready.`)
      setHealth('Operational')
    },
    Notification: (event) => {
      addNotification(event.title ?? 'DIGITECH notification', event.message ?? 'A live update was received.')
    },
    ConnectionStateChanged: (event) => {
      setHealth(event.status === 'connected' ? 'Operational' : event.status === 'reconnecting' ? 'Reconnecting' : 'Degraded')
    },
    PresenceChanged: () => setHealth('Operational'),
  })

  const runningWorkflows = workflows.filter((workflow) => String(workflow.status ?? '').toLowerCase() === 'running')
  const activeAgents = agents.filter((agent) => !['paused', 'inactive'].includes(String(agent.status ?? '').toLowerCase()))
  const healthIcon = health === 'Operational' ? CheckCircle2 : health === 'Degraded' ? XCircle : Activity

  return (
    <motion.aside className="dt-dashboard-ai-command" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
      <div className="dt-dashboard-ai-command-glow" aria-hidden="true" />
      <header className="dt-dashboard-ai-command-head">
        <span className="dt-dashboard-ai-command-mark"><Bot size={23} strokeWidth={1.75} aria-hidden="true" /></span>
        <div><p>DIGITECH AI</p><h2>Command Center</h2></div>
        <span className="dt-dashboard-ai-live"><i /> Live</span>
      </header>

      <section className="dt-dashboard-ai-score">
        <div>
          <p>System health</p>
          <strong>{health}</strong>
          <span>{(() => { const Icon = healthIcon; return <Icon size={14} strokeWidth={2.1} aria-hidden="true" /> })()} SignalR event stream</span>
        </div>
        <span>{activeAgents.length + runningWorkflows.length}<small> live</small></span>
      </section>

      <section className="dt-dashboard-ai-automations">
        <div className="dt-dashboard-ai-section-title"><p>Live AI Agent Monitor</p><Radio size={16} strokeWidth={1.9} aria-hidden="true" /></div>
        {agents.slice(0, 3).map((agent) => <div className="dt-dashboard-ai-automation-row" key={agent.id}>
          <span className={`is-${statusTone(agent.status)}`}><i /></span><strong>{agent.name ?? 'Unnamed Agent'}</strong><small>{agent.status ?? 'Ready'}</small>
        </div>)}
        {!agents.length && <div className="dt-dashboard-ai-automation-row"><span className="is-blue"><i /></span><strong>No agents deployed</strong><small>Ready</small></div>}
      </section>

      <section className="dt-dashboard-ai-automations">
        <div className="dt-dashboard-ai-section-title"><p>Workflow Monitor</p><Workflow size={16} strokeWidth={1.9} aria-hidden="true" /></div>
        {workflows.slice(0, 3).map((workflow) => <div className="dt-dashboard-ai-automation-row" key={workflow.id}>
          <span className={`is-${statusTone(workflow.status)}`}><i /></span><strong>{workflow.name ?? 'Untitled Workflow'}</strong><small>{workflow.progress != null ? `${workflow.progress}%` : workflow.status ?? 'Draft'}</small>
        </div>)}
        {!workflows.length && <div className="dt-dashboard-ai-automation-row"><span className="is-blue"><i /></span><strong>No workflows available</strong><small>Draft</small></div>}
      </section>

      <section className="dt-dashboard-ai-insights">
        <div className="dt-dashboard-ai-section-title"><p>Google Review Feed</p><MessageSquareText size={16} strokeWidth={1.9} aria-hidden="true" /></div>
        {reviews.slice(0, 2).map((review) => <article key={review.id}>
          <span><Star size={17} strokeWidth={1.9} aria-hidden="true" /></span><div><strong>{review.customerName ?? review.reviewerName ?? 'Google reviewer'} · {review.rating ?? 0}/5</strong><p>{review.review ?? review.reviewText ?? 'Review received'}</p></div>
        </article>)}
        {!reviews.length && <article><span><MessageSquareText size={17} strokeWidth={1.9} aria-hidden="true" /></span><div><strong>No reviews synced</strong><p>New Google reviews appear here live.</p></div></article>}
      </section>

      <section className="dt-dashboard-ai-insights">
        <div className="dt-dashboard-ai-section-title"><p>Execution Feed</p><Gauge size={16} strokeWidth={1.9} aria-hidden="true" /></div>
        {logs.slice(0, 2).map((log, index) => <article key={`${log.executionId ?? 'execution'}-${log.createdAt ?? index}`}>
          <span><Clock3 size={17} strokeWidth={1.9} aria-hidden="true" /></span><div><strong>{log.stepName ?? 'Workflow step'} · {log.level ?? 'Info'}</strong><p>{log.message ?? 'Execution event received'} · {toDate(log.createdAt)}</p></div>
        </article>)}
        {!logs.length && <article><span><Clock3 size={17} strokeWidth={1.9} aria-hidden="true" /></span><div><strong>Awaiting execution events</strong><p>Live workflow logs will stream here.</p></div></article>}
      </section>

      <NotificationPanel notifications={notifications.length ? notifications : [{ title: 'Live monitoring connected', detail: ' Command Center is ready for events.', isNew: true }]} />
    </motion.aside>
  )
}
