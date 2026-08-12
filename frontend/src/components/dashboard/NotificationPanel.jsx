import { BellRing, CheckCircle2, ChevronRight, Inbox } from 'lucide-react'

export default function NotificationPanel({ floating = false, notifications = [], onViewAll }) {
  if (floating) {
    return <section className="dt-dashboard-notification-dropdown" role="dialog" aria-label="Notifications">
      <header><div><span><BellRing size={17} aria-hidden="true" /></span><div><strong>Notifications</strong><small>{notifications.filter((item) => item.isNew).length} unread</small></div></div></header>
      <div className="dt-dashboard-notification-dropdown-list">{notifications.length ? notifications.map((notification, index) => <article key={`${notification.title}-${index}`}><span className={notification.isNew ? 'is-new' : ''}><CheckCircle2 size={16} aria-hidden="true" /></span><div><strong>{notification.title}</strong><p>{notification.detail}</p><time>{notification.time || 'Just now'}</time></div>{notification.isNew ? <i aria-label="Unread" /> : null}</article>) : <div className="dt-dashboard-notification-empty"><Inbox size={22} aria-hidden="true" /><strong>You’re all caught up</strong><p>New operational updates will appear here.</p></div>}</div>
      <footer><button onClick={onViewAll} type="button">View all notifications <ChevronRight size={15} aria-hidden="true" /></button></footer>
    </section>
  }

  return (
    <section className="dt-dashboard-notification-panel">
      <header>
        <span><BellRing size={16} strokeWidth={1.9} aria-hidden="true" /></span>
        <div>
          <p>RECENT NOTIFICATIONS</p>
          <strong>Stay in the loop</strong>
        </div>
      </header>
      <div>
        {notifications.map((notification) => (
          <article key={notification.title}>
            <span className={notification.isNew ? 'is-new' : ''}><CheckCircle2 size={14} strokeWidth={2} aria-hidden="true" /></span>
            <p><strong>{notification.title}</strong>{notification.detail}</p>
            <ChevronRight size={15} strokeWidth={1.9} aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  )
}
