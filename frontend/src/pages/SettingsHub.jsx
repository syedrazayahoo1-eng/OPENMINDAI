import { Bell, Bot, Building2, KeyRound, Link2, Palette, ShieldCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'

const settings = [
  ['Organization', 'Manage workspace identity and organization preferences.', Building2, '/settings/organization'],
  ['Users & Roles', 'Control team access, roles, and responsibilities.', Users, '/settings/users'],
  ['Permission Matrix', 'Manage the actions available to every workspace role.', KeyRound, '/settings/permissions'],
  ['Brand Voice', 'Configure the voice used across AI-generated content.', Palette, '/settings/brand-voice'],
  ['Notifications', 'Choose how operational updates are delivered.', Bell, '/settings/notifications'],
  ['Integrations', 'Manage connected business services and providers.', Link2, '/settings/integrations'],
  ['Security', 'Review authentication and workspace security settings.', ShieldCheck, '/settings/security'],
  ['AI Configuration', 'Configure AI capabilities and operational defaults.', Bot, '/settings/ai'],
]

export default function SettingsHub() {
  return <DashboardLayout><main className="dt-dashboard-content"><section className="dt-dashboard-hero"><div className="dt-dashboard-hero-copy"><span className="dt-dashboard-hero-kicker">WORKSPACE ADMINISTRATION</span><h1>Settings</h1><p>Manage your organization, users, intelligence, and connected services from one place.</p></div></section><section className="dt-dashboard-business-grid">{settings.map(([title, description, Icon, to]) => <Link className="dt-dashboard-performance-note" key={title} to={to}><span className="dt-dashboard-sidebar-icon"><Icon size={20} /></span><div><h2>{title}</h2><p>{description}</p></div></Link>)}</section></main></DashboardLayout>
}
