import { ChevronDown, GitBranch, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import WorkflowCanvas from '../components/workflows/WorkflowCanvas'
import DashboardLayout from '../layouts/DashboardLayout'
import { createWorkflow, getWorkflow, updateWorkflow } from '../services/workflowService'
import useLiveMonitoring from '../hooks/useLiveMonitoring'
import '../components/agents/aiAgents.css'

const palette = {
  Triggers: ['Manual', 'Schedule', 'Webhook', 'New Google Review', 'New CRM Lead', 'New Customer', 'New Email', 'New Form Submission'],
  AI: ['Review Reply AI', 'Marketing AI', 'Sales AI', 'HR AI', 'CEO Assistant', 'Custom AI Agent'],
  Logic: ['Condition', 'Delay', 'Switch', 'Loop', 'Wait', 'Merge', 'Split'],
  Actions: ['Publish Google Business Post', 'Reply To Review', 'Send Email', 'Send Teams Message', 'HTTP Request', 'Update CRM', 'Create Lead', 'Create Ticket', 'Database', 'Run AI Agent'],
}

export default function WorkflowBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [open, setOpen] = useState(Object.keys(palette))
  const [workflow, setWorkflow] = useState(null)
  const [definition, setDefinition] = useState({ nodes: [], edges: [] })
  const [loading, setLoading] = useState(Boolean(id))
  const [saving, setSaving] = useState(false)
  const [liveStatus, setLiveStatus] = useState('Draft')
  const toggle = (category) => setOpen((items) => items.includes(category) ? items.filter((item) => item !== category) : [...items, category])
  const startNodeDrag = (event, category, name) => {
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('application/workflow-node', JSON.stringify({ category, name }))
    event.dataTransfer.setData('text/plain', name)
  }

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const saved = await getWorkflow(id)
        setWorkflow(saved)
        setDefinition(saved.definition ? JSON.parse(saved.definition) : { nodes: [], edges: [] })
      } catch { toast.error('Unable to load workflow.') } finally { setLoading(false) }
    }
    load()
  }, [id])
  useLiveMonitoring({ WorkflowStatusChanged: (event) => { if (Number(id) === event.workflowId) setLiveStatus(event.status) } })

  const saveWorkflow = async () => {
    try {
      setSaving(true)
      const payload = { name: workflow?.name || 'Untitled Workflow', description: workflow?.description || '', isActive: workflow?.isActive ?? true, definition: JSON.stringify(definition) }
      const saved = id ? await updateWorkflow(id, payload) : await createWorkflow(payload)
      setWorkflow(saved)
      toast.success('Workflow saved.')
      if (!id) navigate(`/workflow-builder/${saved.id}`, { replace: true })
    } catch { toast.error('Unable to save workflow.') } finally { setSaving(false) }
  }

  return <DashboardLayout><div className="dt-agents"><section className="dt-agents-header"><div className="dt-agents-header-glow" /><div className="dt-agents-header-copy"><span><GitBranch size={15} /> WORKFLOW AUTOMATION</span><h1>Workflow <em>Builder</em></h1><p>{workflow?.name || 'Design your workflow on the enterprise canvas.'} {id && `• ${liveStatus}`}</p></div><button className="dt-agents-create-button" disabled={saving || loading} onClick={saveWorkflow} type="button"><Save size={18} /> {saving ? 'Saving...' : 'Save Workflow'}</button></section><section className="dt-agents-workforce-grid"><aside className="dt-agents-activity"><header className="dt-agents-section-heading"><div><p>NODE PALETTE</p><h2>Workflow nodes</h2></div></header><div className="dt-agents-activity-timeline">{Object.entries(palette).map(([category, nodes]) => <div key={category}><button aria-expanded={open.includes(category)} onClick={() => toggle(category)} style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', border: 0, background: 'transparent', color: '#0b1733', cursor: 'pointer', fontWeight: 800, padding: '.65rem 0' }} type="button">{category}<ChevronDown size={15} style={{ transform: open.includes(category) ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 180ms ease' }} /></button>{open.includes(category) && nodes.map((name) => <article draggable key={name} onDragStart={(event) => startNodeDrag(event, category, name)} style={{ cursor: 'grab', transition: 'transform 180ms ease, opacity 180ms ease' }}><span className="dt-agents-timeline-icon is-gold"><GitBranch size={16} /></span><p>{name}</p></article>)}</div>)}</div></aside><WorkflowCanvas definition={definition} onChange={setDefinition} /></section></div></DashboardLayout>
}
