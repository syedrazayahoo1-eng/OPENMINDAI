import { motion } from 'framer-motion'
import { Bot, Plus, Sparkles } from 'lucide-react'

export default function AiAgentsHeader({ onCreateAgent }) {
  return (
    <motion.section
      className="dt-agents-header"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="dt-agents-header-glow" aria-hidden="true" />
      <div className="dt-agents-header-copy">
        <span><Sparkles size={15} strokeWidth={1.9} aria-hidden="true" /> ENTERPRISE AI WORKFORCE</span>
        <h1>AI <em>Agents</em></h1>
        <p>Manage, monitor and deploy your enterprise AI workforce.</p>
      </div>
      <div className="dt-agents-header-status">
        <span><Bot size={20} strokeWidth={1.8} aria-hidden="true" /></span>
        <div>
          <small>WORKFORCE STATUS</small>
          <strong>18 agents online</strong>
          <p><i /> All systems operational</p>
        </div>
      </div>
      <button className="dt-agents-create-button" onClick={onCreateAgent} type="button">
        <Plus size={18} strokeWidth={2.15} aria-hidden="true" />
        Create Agent
      </button>
    </motion.section>
  )
}
