import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

const fieldStyle = { width: '100%', boxSizing: 'border-box', border: '1px solid rgba(11,23,51,.14)', borderRadius: '.65rem', background: '#fffdfa', color: '#0b1733', font: 'inherit', padding: '.65rem .75rem' }
const labelStyle = { display: 'grid', gap: '.4rem', color: '#0b1733', fontSize: '.79rem', fontWeight: 800 }

const defaultConfig = (node) => ({ name: node.name, description: '', department: node.category === 'AI' ? node.name.replace(' AI', '') : '', prompt: '', temperature: .7, enabled: true, triggerType: node.name, schedule: '', webhookUrl: '', expression: '', delay: '', switchRules: '', emailAddress: '', teamsWebhookUrl: '', databaseTarget: '', httpUrl: '', httpMethod: 'POST', postId: '', replyTemplate: '', ...(node.config || {}) })

function Field({ label, value, onChange, textarea = false, type = 'text' }) {
  return <label style={labelStyle}>{label}{textarea ? <textarea onChange={(event) => onChange(event.target.value)} rows="3" style={{ ...fieldStyle, resize: 'vertical' }} value={value} /> : <input onChange={(event) => onChange(type === 'number' ? Number(event.target.value) : event.target.value)} style={fieldStyle} type={type} value={value} />}</label>
}

export default function WorkflowPropertiesPanel({ node, onClose, onSave }) {
  const [draft, setDraft] = useState(() => defaultConfig(node))
  useEffect(() => setDraft(defaultConfig(node)), [node.id])
  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }))
  const save = () => onSave({ name: draft.name.trim() || node.name, config: draft })
  const close = () => { save(); onClose() }
  const isTrigger = node.category === 'Triggers'
  const isLogic = node.category === 'Logic'
  const isAction = node.category === 'Actions'
  const actionFields = node.name === 'Send Email' || node.name === 'Email'
    ? [['Email Address', 'emailAddress']]
    : node.name === 'Send Teams Message' || node.name === 'Teams'
      ? [['Teams Webhook URL', 'teamsWebhookUrl']]
      : node.name === 'Database' || node.name === 'Database Query'
        ? [['Read-only SQL Query', 'databaseTarget']]
        : node.name === 'HTTP Request' || node.name === 'Webhook'
          ? [['HTTPS URL', 'httpUrl'], ['HTTP Method', 'httpMethod']]
          : node.name === 'Publish Google Business Post'
            ? [['Google Business Post ID', 'postId']]
            : [['Google Reply Template', 'replyTemplate']]

  return <aside aria-label="Node properties" style={{ position: 'absolute', zIndex: 10, top: 0, right: 0, width: 'min(100%, 23rem)', height: '100%', boxSizing: 'border-box', overflowY: 'auto', borderLeft: '1px solid rgba(11,23,51,.11)', background: 'rgba(255,253,249,.98)', boxShadow: '-14px 0 32px rgba(11,23,51,.12)', padding: '1.1rem', animation: 'dt-properties-slide-in 220ms ease-out' }}>
    <style>{'@keyframes dt-properties-slide-in { from { transform: translateX(100%); opacity: .4; } to { transform: translateX(0); opacity: 1; } } @media (max-width: 680px) { [aria-label="Node properties"] { width: 100% !important; } }'}</style>
    <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '.75rem', marginBottom: '1.25rem' }}><div><p style={{ margin: 0, color: '#a77619', fontSize: '.68rem', fontWeight: 850, letterSpacing: '.1em' }}>{node.category.toUpperCase()} NODE</p><h2 style={{ margin: '.3rem 0 0', color: '#0b1733', fontSize: '1.15rem' }}>Properties</h2></div><button aria-label="Close properties" onClick={close} style={{ border: 0, background: 'transparent', color: '#0b1733', cursor: 'pointer', padding: '.2rem' }} type="button"><X size={19} /></button></header>
    <div style={{ display: 'grid', gap: '.95rem' }}>
      <Field label="Name" onChange={(value) => update('name', value)} value={draft.name} />
      <Field label="Description" onChange={(value) => update('description', value)} textarea value={draft.description} />
      {node.category === 'AI' && <><Field label="Department" onChange={(value) => update('department', value)} value={draft.department} /><Field label="AI Prompt" onChange={(value) => update('prompt', value)} textarea value={draft.prompt} /><Field label="Temperature" onChange={(value) => update('temperature', value)} type="number" value={draft.temperature} /></>}
      {isTrigger && <><Field label="Trigger Name" onChange={(value) => update('name', value)} value={draft.name} /><Field label="Trigger Type" onChange={(value) => update('triggerType', value)} value={draft.triggerType} />{node.name === 'Schedule' ? <Field label="Schedule" onChange={(value) => update('schedule', value)} value={draft.schedule} /> : node.name === 'Webhook' ? <Field label="Webhook URL" onChange={(value) => update('webhookUrl', value)} value={draft.webhookUrl} /> : null}</>}
      {isLogic && <>{node.name === 'Condition' && <Field label="Condition Expression" onChange={(value) => update('expression', value)} textarea value={draft.expression} />}{node.name === 'Delay' && <Field label="Delay Duration" onChange={(value) => update('delay', value)} value={draft.delay} />}{node.name === 'Switch' && <Field label="Switch Rules" onChange={(value) => update('switchRules', value)} textarea value={draft.switchRules} />}</>}
      {isAction && actionFields.map(([label, field]) => <Field key={field} label={label} onChange={(value) => update(field, value)} textarea={field === 'replyTemplate' || field === 'databaseTarget'} value={draft[field]} />)}
      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#0b1733', fontSize: '.82rem', fontWeight: 800 }}>Enabled<input checked={draft.enabled} onChange={(event) => update('enabled', event.target.checked)} style={{ accentColor: '#c8972f', width: '2.2rem', height: '1.15rem' }} type="checkbox" /></label>
      <button onClick={save} style={{ border: 0, borderRadius: '.7rem', background: 'linear-gradient(135deg, #f4dc93, #c8972f)', color: '#0b1733', cursor: 'pointer', font: 'inherit', fontWeight: 850, padding: '.75rem 1rem' }} type="button">Save Changes</button>
    </div>
  </aside>
}
