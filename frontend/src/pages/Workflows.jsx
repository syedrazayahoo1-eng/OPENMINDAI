import { Activity, Clock3, Eye, GitBranch, Pencil, Play, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import DashboardLayout from '../layouts/DashboardLayout'
import { createWorkflow, deleteWorkflow, getWorkflow, getWorkflowRuntime, getWorkflows, runWorkflow, updateWorkflow } from '../services/workflowService'
import useLiveMonitoring from '../hooks/useLiveMonitoring'
import '../components/agents/aiAgents.css'

const blankWorkflow = { name: '', description: '', isActive: true }
const statusClass = (status) => status === 'Completed' ? 'is-green' : status === 'Failed' ? 'is-red' : status === 'Running' ? 'is-gold' : ''
const executionTime = (execution) => {
  if (!execution?.startedAt) return 'Not started'
  const end = execution.completedAt ? new Date(execution.completedAt) : new Date()
  return `${Math.max(0, Math.round((end - new Date(execution.startedAt)) / 1000))}s`
}

export default function Workflows() {
  const [workflows, setWorkflows] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(null)
  const [details, setDetails] = useState(null)
  const [runtime, setRuntime] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const load = async () => { try { setLoading(true); setWorkflows(await getWorkflows()) } catch { toast.error('Unable to load workflows.') } finally { setLoading(false) } }
  const loadRuntime = async (id) => { try { setRuntime(await getWorkflowRuntime(id)) } catch { setRuntime(null) } }
  useEffect(() => { load() }, [])
  useEffect(() => {
    if (!details) return undefined
    loadRuntime(details.id)
    const timer = window.setInterval(() => loadRuntime(details.id), 1000)
    return () => window.clearInterval(timer)
  }, [details?.id])
  const save = async (event) => { event.preventDefault(); try { if (form.id) await updateWorkflow(form.id, form); else await createWorkflow(form); toast.success(form.id ? 'Workflow updated.' : 'Workflow created.'); setForm(null); await load() } catch { toast.error('Unable to save workflow.') } }
  const openDetails = async (id) => { try { setDetails(await getWorkflow(id)) } catch { toast.error('Unable to load workflow details.') } }
  const run = async (id) => { try { await runWorkflow(id); toast.success('Workflow queued.'); await Promise.all([load(), loadRuntime(id)]) } catch { toast.error('Unable to run workflow.') } }
  const remove = async () => { try { await deleteWorkflow(deleting.id); toast.success('Workflow deleted.'); setDeleting(null); await load() } catch { toast.error('Unable to delete workflow.') } }
  useLiveMonitoring({ WorkflowStatusChanged: (event) => { load(); if (details?.id === event.workflowId) loadRuntime(event.workflowId) }, WorkflowProgress: (event) => { if (details?.id === event.workflowId) loadRuntime(event.workflowId) }, WorkflowExecutionLog: (event) => { if (details?.id === event.workflowId) loadRuntime(event.workflowId) } })

  return <DashboardLayout><div className="dt-agents"><section className="dt-agents-header"><div className="dt-agents-header-glow" /><div className="dt-agents-header-copy"><span><GitBranch size={15} /> WORKFLOW AUTOMATION</span><h1>Work<em>flows</em></h1><p>Manage your enterprise automation workflows.</p></div><button className="dt-agents-create-button" onClick={() => setForm(blankWorkflow)} type="button"><Plus size={18} /> New Workflow</button></section><section className="dt-agents-workforce"><header className="dt-agents-section-heading"><div><p>WORKFLOW LIBRARY</p><h2>All Workflows</h2></div></header>{loading ? <p className="dt-agent-notice">Loading workflows…</p> : workflows.length === 0 ? <div className="dt-agent-log-list"><h3>No workflows created</h3><p>Create a workflow to begin orchestrating your operational automations.</p></div> : <div className="dt-agents-deployment-list">{workflows.map((workflow) => <article key={workflow.id}><span className="dt-agents-deployment-icon is-gold"><GitBranch size={17} /></span><div><strong>{workflow.name}</strong><p>{workflow.description || 'No description provided'}</p></div><span className={`dt-agents-deployment-status ${statusClass(workflow.status || 'Draft')}`}>{workflow.status || 'Draft'}</span><button aria-label={`Run ${workflow.name}`} onClick={() => run(workflow.id)} type="button"><Play size={16} /></button><button aria-label={`View ${workflow.name}`} onClick={() => openDetails(workflow.id)} type="button"><Eye size={16} /></button><button aria-label={`Edit ${workflow.name}`} onClick={() => setForm(workflow)} type="button"><Pencil size={16} /></button><button aria-label={`Delete ${workflow.name}`} onClick={() => setDeleting(workflow)} type="button"><Trash2 size={16} /></button></article>)}</div>}</section></div>{form && <div className="dt-agent-modal-backdrop" onMouseDown={() => setForm(null)}><section className="dt-agent-modal" onMouseDown={(event) => event.stopPropagation()}><header><div><span><GitBranch size={21} /></span><div><p>WORKFLOW CONFIGURATION</p><h2>{form.id ? 'Edit Workflow' : 'New Workflow'}</h2></div></div><button onClick={() => setForm(null)} type="button"><X size={20} /></button></header><form onSubmit={save}><label className="dt-agent-modal-instructions"><span>Workflow name</span><input required type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label className="dt-agent-modal-instructions"><span>Description</span><textarea rows="4" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label><label className="dt-agent-modal-toggle"><span>Active</span><input checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} type="checkbox" /><i /></label><footer><button className="dt-agent-modal-cancel" onClick={() => setForm(null)} type="button">Cancel</button><button className="dt-agent-modal-submit" type="submit">Save Workflow</button></footer></form></section></div>}{details && <div className="dt-agent-modal-backdrop" onMouseDown={() => { setDetails(null); setRuntime(null) }}><section className="dt-agent-modal" onMouseDown={(event) => event.stopPropagation()}><header><div><span><Activity size={21} /></span><div><p>WORKFLOW RUNTIME</p><h2>{details.name}</h2></div></div><button onClick={() => { setDetails(null); setRuntime(null) }} type="button"><X size={20} /></button></header><div className="dt-agent-log-list"><p>{details.description || 'No description provided'}</p><p><strong>Current Status:</strong> {runtime?.workflowStatus || details.status || 'Draft'}</p><p><Clock3 size={15} /> <strong>Execution Time:</strong> {executionTime(runtime?.execution)}</p><p><strong>Current Step:</strong> {runtime?.execution?.currentStep || 'Waiting'}</p><p><strong>Progress:</strong> {runtime?.execution?.progress ?? 0}%</p><progress max="100" style={{ width: '100%', accentColor: '#c8972f' }} value={runtime?.execution?.progress ?? 0} /><h3>Execution Log</h3>{runtime?.logs?.length ? runtime.logs.map((log) => <p key={log.id}><strong>{new Date(log.createdAt).toLocaleTimeString()} · {log.stepName}:</strong> {log.message}</p>) : <p>No execution logs yet.</p>}</div></section></div>}{deleting && <div className="dt-agent-modal-backdrop" onMouseDown={() => setDeleting(null)}><section className="dt-agent-modal" onMouseDown={(event) => event.stopPropagation()}><header><div><span><Trash2 size={21} /></span><div><p>DELETE WORKFLOW</p><h2>Confirm deletion</h2></div></div><button onClick={() => setDeleting(null)} type="button"><X size={20} /></button></header><div className="dt-agent-log-list"><p>Delete “{deleting.name}”? This cannot be undone.</p><footer><button className="dt-agent-modal-cancel" onClick={() => setDeleting(null)} type="button">Cancel</button><button className="dt-agent-modal-submit" onClick={remove} type="button">Delete Workflow</button></footer></div></section></div>}</DashboardLayout>
}
