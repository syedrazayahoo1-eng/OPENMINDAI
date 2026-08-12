import { motion } from 'framer-motion'
import { useId } from 'react'

export default function GlassAuthCard({ eyebrow, icon, title, description, children, footer, className = '' }) {
  const titleId = useId()

  return (
    <motion.section
      className={`dt2-auth-card ${className}`.trim()}
      aria-labelledby={titleId}
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="dt2-auth-card-sheen" aria-hidden="true" />
      <header className="dt2-auth-card-header">
        {icon ? <span className="dt2-auth-card-icon" aria-hidden="true">{icon}</span> : null}
        {eyebrow ? <p className="dt2-auth-card-eyebrow">{eyebrow}</p> : null}
        <h1 id={titleId}>{title}</h1>
        {description ? <p>{description}</p> : null}
      </header>
      <div className="dt2-auth-card-body">{children}</div>
      {footer ? <footer className="dt2-auth-card-footer">{footer}</footer> : null}
    </motion.section>
  )
}
