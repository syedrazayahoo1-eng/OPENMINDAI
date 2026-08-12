import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export default function AuthStatePanel({ title, description, action }) {
  return (
    <motion.div
      className="dt2-auth-state-panel"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <span className="dt2-auth-state-icon"><CheckCircle2 size={30} strokeWidth={1.8} aria-hidden="true" /></span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action ? <div className="dt2-auth-state-action">{action}</div> : null}
    </motion.div>
  )
}
