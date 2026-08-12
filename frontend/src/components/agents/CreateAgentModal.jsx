import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Database, FileUp, ShieldCheck, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { createAgent } from '../../services/agentService'

function Toggle({ checked, label, onChange }) {
  return (
    <label className="dt-agent-modal-toggle">
      <span>{label}</span>
      <input checked={checked} onChange={onChange} type="checkbox" />
      <i aria-hidden="true" />
    </label>
  )
}

export default function CreateAgentModal({ isOpen, onClose, onCreated }) {
  const [temperature, setTemperature] = useState('0.3')
  const [permissions, setPermissions] = useState({
    voice: true,
    calls: false,
    email: true,
    whatsapp: false,
  })

  const updatePermission = (key) => {
    setPermissions((current) => ({ ...current, [key]: !current[key] }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    await createAgent({
      name: form.get('name'),
      department: form.get('department'),
      models: form.get('models'),
      description: form.get('description'),
      temperature: Number(temperature),
      maxTokens: 2048,
    })
    await onCreated()
    window.alert('Agent deployed successfully.')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="dt-agent-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.section
            aria-labelledby="create-agent-title"
            aria-modal="true"
            className="dt-agent-modal"
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <header>
              <div>
                <span><Bot size={21} strokeWidth={1.85} aria-hidden="true" /></span>
                <div>
                  <p>EXPAND YOUR WORKFORCE</p>
                  <h2 id="create-agent-title">Create AI Agent</h2>
                </div>
              </div>
              <button aria-label="Close create agent modal" onClick={onClose} type="button"><X size={20} strokeWidth={1.9} aria-hidden="true" /></button>
            </header>

            <form onSubmit={handleSubmit}>
              <div className="dt-agent-modal-form-grid">
                <label>
                  <span>Agent Name</span>
                  <input defaultValue="Growth Operations Agent" name="name" required type="text" />
                </label>
                <label>
                  <span>Department</span>
                  <select defaultValue="Growth" name="department">
                    <option>Growth</option>
                    <option>Revenue</option>
                    <option>People</option>
                    <option>Finance</option>
                    <option>Customer Success</option>
                    <option>Operations</option>
                  </select>
                </label>
                <label>
                  <span>Model</span>
                  <select defaultValue="GPT-5.5" name="models">
                    <option>GPT-5.5</option>
                    <option>Azure OpenAI</option>
                    <option>Claude</option>
                    <option>Gemini</option>
                  </select>
                </label>
                <label>
                  <span>Memory</span>
                  <select defaultValue="Workspace memory">
                    <option>Workspace memory</option>
                    <option>Department memory</option>
                    <option>Session only</option>
                  </select>
                </label>
              </div>

              <label className="dt-agent-modal-instructions">
                <span>Instructions</span>
                <textarea defaultValue="Coordinate growth operations, identify opportunities and surface timely actions for the team." name="description" rows="4" />
              </label>

              <div className="dt-agent-modal-settings">
                <label className="dt-agent-modal-temperature">
                  <span>Temperature <strong>{temperature}</strong></span>
                  <input max="1" min="0" onChange={(event) => setTemperature(event.target.value)} step="0.1" type="range" value={temperature} />
                </label>
                <label className="dt-agent-modal-upload">
                  <span><Database size={17} strokeWidth={1.85} aria-hidden="true" /> Knowledge Base</span>
                  <input accept=".pdf,.doc,.docx,.txt" type="file" />
                  <small><FileUp size={15} strokeWidth={1.85} aria-hidden="true" /> Upload documents</small>
                </label>
              </div>

              <fieldset className="dt-agent-modal-permissions">
                <legend><ShieldCheck size={16} strokeWidth={1.85} aria-hidden="true" /> Permissions</legend>
                <div>
                  <Toggle checked={permissions.voice} label="Enable Voice" onChange={() => updatePermission('voice')} />
                  <Toggle checked={permissions.calls} label="Enable Calls" onChange={() => updatePermission('calls')} />
                  <Toggle checked={permissions.email} label="Enable Email" onChange={() => updatePermission('email')} />
                  <Toggle checked={permissions.whatsapp} label="Enable WhatsApp" onChange={() => updatePermission('whatsapp')} />
                </div>
              </fieldset>

              <footer>
                <button className="dt-agent-modal-cancel" onClick={onClose} type="button">Cancel</button>
                <button className="dt-agent-modal-submit" type="submit"><Sparkles size={17} strokeWidth={1.9} aria-hidden="true" /> Deploy Agent</button>
              </footer>
            </form>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
