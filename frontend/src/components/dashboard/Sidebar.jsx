import {
  Bot,
  Building2,
  CalendarDays,
  CheckSquare,
  FileText,
  Gauge,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Megaphone,
  Settings,
  Sparkles,
  Star,
  UserRoundCheck,
  Users,
  Volume2,
  X,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import DashboardBrand from './DashboardBrand'

const primaryNavigation = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Chat', icon: MessageSquare, to: '/chat' },
  { label: 'AI Agents', icon: Bot, to: '/agents' },
  { label: 'Automation', icon: Sparkles, to: '/workflows' },
  { label: 'Workflow Builder', icon: Sparkles, to: '/workflow-builder' },
  { label: 'CRM', icon: Building2, to: '/crm' },
  { label: 'Attendance', icon: UserRoundCheck, to: '/attendance' },
  { label: 'Employee Management', icon: Users, to: '/employees' },
  { label: 'Leave Management', icon: CalendarDays, to: '/leaves' },
  { label: 'Marketing', icon: Megaphone, to: '/marketing/google-business-posts' },
  { label: 'AI Image Studio', icon: Sparkles, to: '/marketing/ai-image-studio' },
]

const workspaceNavigation = [
  { label: 'Reviews', icon: Star, to: '/reviews' },
  { label: 'Analytics', icon: Gauge, to: '/analytics' },
  { label: 'Documents', icon: FileText, to: '/dashboard/documents' },
  { label: 'Settings', icon: Settings, to: '/dashboard/settings' },
  { label: 'Brand Voice', icon: Volume2, to: '/settings/brand-voice' },
]

function NavigationItem({ item, onClose }) {
  const Icon = item.icon
  const content = (
    <>
      <span className="dt-dashboard-sidebar-icon"><Icon size={18} strokeWidth={1.8} aria-hidden="true" /></span>
      <span>{item.label}</span>
      {item.label === 'AI Agents' ? <small>New</small> : null}
    </>
  )

  if (item.to) {
    return (
      <NavLink
        className={({ isActive }) => 'dt-dashboard-nav-item' + (isActive ? ' is-active' : '')}
        onClick={onClose}
        to={item.to}
      >
        {content}
      </NavLink>
    )
  }

  return (
    <button className="dt-dashboard-nav-item" type="button">
      {content}
    </button>
  )
}

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <button
        aria-label="Close dashboard navigation"
        className={'dt-dashboard-sidebar-scrim' + (isOpen ? ' is-visible' : '')}
        onClick={onClose}
        type="button"
      />
      <aside className={'dt-dashboard-sidebar' + (isOpen ? ' is-open' : '')} aria-label="Dashboard navigation">
        <div className="dt-dashboard-sidebar-head">
          <DashboardBrand />
          <button aria-label="Close navigation" className="dt-dashboard-sidebar-close" onClick={onClose} type="button">
            <X size={19} strokeWidth={1.9} aria-hidden="true" />
          </button>
        </div>

        <div className="dt-dashboard-workspace-card">
          <span className="dt-dashboard-workspace-card-icon"><Building2 size={18} strokeWidth={1.8} aria-hidden="true" /></span>
          <span>
            <strong>Enterprise workspace</strong>
            <small>All systems operational</small>
          </span>
          <i aria-hidden="true" />
        </div>

        <nav className="dt-dashboard-sidebar-nav">
          <p>OPERATIONS</p>
          {primaryNavigation.map((item) => <NavigationItem item={item} key={item.label} onClose={onClose} />)}
          <p className="dt-dashboard-sidebar-group-label">WORKSPACE</p>
          {workspaceNavigation.map((item) => <NavigationItem item={item} key={item.label} onClose={onClose} />)}
        </nav>

        <div className="dt-dashboard-sidebar-foot">
          <div className="dt-dashboard-security-status">
            <span><CheckSquare size={15} strokeWidth={2} aria-hidden="true" /></span>
            <div>
              <strong>Enterprise secure</strong>
              <small>Zero-trust protection active</small>
            </div>
          </div>
          <button className="dt-dashboard-logout" onClick={handleLogout} type="button">
            <LogOut size={17} strokeWidth={1.85} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
