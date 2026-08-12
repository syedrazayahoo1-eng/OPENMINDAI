import { Bell, Bot, ChevronDown, Menu, Settings, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrganization } from '../../services/organizationService'
import DashboardBrand from './DashboardBrand'
import NotificationPanel from './NotificationPanel'
import SearchBar from './SearchBar'

export default function TopNavigation({ onMenuToggle }) {
  const navigate = useNavigate()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [organizationName, setOrganizationName] = useState('')
  const notificationRef = useRef(null)

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setNotificationsOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setNotificationsOpen(false)
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  useEffect(() => {
    let active = true
    const loadOrganization = async () => {
      try {
        const organization = await getOrganization()
        if (active) setOrganizationName(organization.displayName?.trim() || organization.name?.trim() || '')
      } catch {
        if (active) setOrganizationName('')
      }
    }
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') loadOrganization()
    }

    loadOrganization()
    const refreshInterval = window.setInterval(loadOrganization, 5000)
    window.addEventListener('focus', loadOrganization)
    document.addEventListener('visibilitychange', refreshWhenVisible)

    return () => {
      active = false
      window.clearInterval(refreshInterval)
      window.removeEventListener('focus', loadOrganization)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
    }
  }, [])

  const openAssistant = () => navigate('/chat')

  return (
    <header className="dt-dashboard-topnav">
      <div className="dt-dashboard-topnav-leading">
        <button aria-label="Open dashboard navigation" className="dt-dashboard-menu-button" onClick={onMenuToggle} type="button">
          <Menu size={20} strokeWidth={1.9} aria-hidden="true" />
        </button>
        <DashboardBrand />
        <button className="dt-dashboard-workspace-selector" type="button">
          <span>{organizationName || 'Workspace'}</span>
          <ChevronDown size={16} strokeWidth={1.9} aria-hidden="true" />
        </button>
      </div>

      <div className="dt-dashboard-topnav-search">
        <SearchBar />
      </div>

      <div className="dt-dashboard-topnav-actions">
        <button className="dt-dashboard-ai-shortcut" onClick={openAssistant} type="button">
          <span><Sparkles size={16} strokeWidth={1.9} aria-hidden="true" /></span>
          <span>AI Assistant</span>
        </button>
        <div ref={notificationRef}>
          <button aria-expanded={notificationsOpen} aria-label="Notifications" className="dt-dashboard-icon-button has-notification" onClick={() => setNotificationsOpen((open) => !open)} type="button">
            <Bell size={18} strokeWidth={1.85} aria-hidden="true" />
            <i aria-hidden="true" />
          </button>
          {notificationsOpen ? <NotificationPanel floating onViewAll={() => setNotificationsOpen(false)} /> : null}
        </div>
        <button aria-label="Workspace settings" className="dt-dashboard-icon-button" onClick={() => navigate('/dashboard/settings')} type="button">
          <Settings size={18} strokeWidth={1.85} aria-hidden="true" />
        </button>
        <button className="dt-dashboard-profile" type="button">
          <span className="dt-dashboard-profile-avatar">ST</span>
          <span className="dt-dashboard-profile-copy">
            <strong>Sarah Thompson</strong>
            <small>Administrator</small>
          </span>
          <ChevronDown size={16} strokeWidth={1.9} aria-hidden="true" />
        </button>
        <button aria-label="Open AI Assistant" className="dt-dashboard-mobile-ai" onClick={openAssistant} type="button">
          <Bot size={19} strokeWidth={1.9} aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
