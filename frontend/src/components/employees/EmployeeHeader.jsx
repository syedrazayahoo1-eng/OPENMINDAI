import { motion } from 'framer-motion'
import { BadgeCheck, Plus, Sparkles } from 'lucide-react'

export default function EmployeeHeader({ onAddEmployee }) {
  return (
    <motion.header
      className="dt-employees-header"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="dt-employees-header-glow" aria-hidden="true" />
      <div className="dt-employees-header-copy">
        <span><Sparkles size={13} strokeWidth={2} aria-hidden="true" /> PEOPLE OPERATIONS</span>
        <h1>Employee <em>Management</em></h1>
        <p>Manage your workforce, departments, roles and employee lifecycle from one place.</p>
      </div>
      <div className="dt-employees-header-status">
        <span><BadgeCheck size={18} strokeWidth={1.9} aria-hidden="true" /></span>
        <div>
          <small>WORKFORCE STATUS</small>
          <strong>People operations healthy</strong>
          <p><i aria-hidden="true" /> 96.2% profile completeness</p>
        </div>
      </div>
      <button className="dt-employees-add-button" onClick={onAddEmployee} type="button">
        <Plus size={17} strokeWidth={2.25} aria-hidden="true" />
        Add Employee
      </button>
    </motion.header>
  )
}
