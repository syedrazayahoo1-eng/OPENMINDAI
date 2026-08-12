import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'

const definitions = {
  notifications: { title: 'Notification Preferences', fields: [['Email notifications', true], ['Browser notifications', true], ['Workflow alerts', true], ['CRM alerts', true], ['Marketing alerts', false]], types: ['checkbox', 'checkbox', 'checkbox', 'checkbox', 'checkbox'] },
  ai: { title: 'AI Configuration', fields: [['Model', 'gpt-4.1'], ['Temperature', '0.7'], ['Max Tokens', '2048'], ['System Prompt', 'You are a helpful enterprise AI assistant.'], ['Provider', 'Azure OpenAI']], types: ['text', 'number', 'number', 'textarea', 'text'] },
}

const integrations = ['Google Business', 'Microsoft Teams', 'SMTP', 'Azure OpenAI', 'Redis', 'Blob Storage']

export default function SettingsModule() {
  const key = useLocation().pathname.split('/').pop()
  const config = definitions[key]
  const initial = useMemo(() => Object.fromEntries((config?.fields || []).map(([label, value]) => [label, value])), [config])
  const [values, setValues] = useState(initial)
  const [saved, setSaved] = useState(false)
  const save = (event) => { event.preventDefault(); setSaved(true); sessionStorage.setItem(`digitech_settings_${key}`, JSON.stringify(values)) }
  if (key === 'users') return <DashboardLayout><main className="dt-dashboard-content"><section className="dt-dashboard-hero"><div className="dt-dashboard-hero-copy"><span className="dt-dashboard-hero-kicker">ACCESS CONTROL</span><h1>Users & Roles</h1><p>User management is available through the enterprise administration service.</p><Link className="dt-dashboard-primary-button" to="/dashboard/settings">Back to Settings</Link></div></section></main></DashboardLayout>
  if (key === 'integrations') return <DashboardLayout><main className="dt-dashboard-content"><section className="dt-dashboard-hero"><div className="dt-dashboard-hero-copy"><span className="dt-dashboard-hero-kicker">CONNECTED SERVICES</span><h1>Integrations</h1><p>Review service availability and reconnect configured providers.</p></div></section><section className="dt-dashboard-business-grid">{integrations.map((name) => <article className="dt-dashboard-performance-note" key={name}><div><h2>{name}</h2><p>Connection status is managed by the configured provider.</p><button className="dt-dashboard-primary-button" type="button">Reconnect</button></div></article>)}</section></main></DashboardLayout>
  if (key === 'security') return <DashboardLayout><main className="dt-dashboard-content"><section className="dt-dashboard-hero"><div className="dt-dashboard-hero-copy"><span className="dt-dashboard-hero-kicker">SECURITY CENTER</span><h1>Security</h1><p>Manage password security, active sessions, MFA, API keys, and audit records.</p><Link className="dt-dashboard-primary-button" to="/dashboard/settings">Review security controls</Link></div></section></main></DashboardLayout>
  return <DashboardLayout><main className="dt-dashboard-content"><section className="dt-dashboard-hero"><div className="dt-dashboard-hero-copy"><span className="dt-dashboard-hero-kicker">WORKSPACE SETTINGS</span><h1>{config.title}</h1><p>Changes are validated and saved for this workspace.</p></div></section><form className="dt-dashboard-business-grid" onSubmit={save}>{config.fields.map(([label], index) => <label className="dt-dashboard-performance-note" key={label}><span>{label}</span>{config.types[index] === 'textarea' ? <textarea required onChange={(event) => setValues({ ...values, [label]: event.target.value })} value={values[label]} /> : config.types[index] === 'checkbox' ? <input checked={Boolean(values[label])} onChange={(event) => setValues({ ...values, [label]: event.target.checked })} type="checkbox" /> : <input required min={config.types[index] === 'number' ? '0' : undefined} onChange={(event) => setValues({ ...values, [label]: event.target.value })} type={config.types[index]} value={values[label]} />}</label>)}<button className="dt-dashboard-primary-button" type="submit">Save settings</button>{saved ? <p>Settings saved.</p> : null}</form></main></DashboardLayout>
}
