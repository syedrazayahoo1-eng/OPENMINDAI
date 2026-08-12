import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, FileText, MoreHorizontal, Pause, Play, RotateCcw, ScrollText, Settings2, Trash2, X } from 'lucide-react'
import { pauseAgent, restartAgent, resumeAgent, updateAgentSettings } from '../../services/agentService'

/*
  { name: 'Sales AI', initials: 'SA', department: 'Sales', status: 'Running', task: 'Replying to priority leads', performance: 98, description: 'Qualifies inbound opportunities and keeps priority conversations moving.', lastActive: 'Just now', models: 'GPT-4.1, Azure AI Search', tone: 'gold' },
  { name: 'Marketing AI', initials: 'MA', department: 'Growth', status: 'Running', task: 'Scheduling the Q3 campaign', performance: 96, description: 'Coordinates campaign content, audience segments, and launch schedules.', lastActive: '2 minutes ago', models: 'GPT-4.1, DALL·E', tone: 'purple' },
  { name: 'HR AI', initials: 'HR', department: 'People', status: 'Paused', task: 'Reviewing leave requests', performance: 89, description: 'Supports people operations with policy-aware employee workflows.', lastActive: '18 minutes ago', models: 'GPT-4.1 mini, Azure AI Search', tone: 'blue' },
  { name: 'Attendance AI', initials: 'AT', department: 'Operations', status: 'Running', task: 'Monitoring team check-ins', performance: 99, description: 'Tracks attendance signals and flags exceptions for the operations team.', lastActive: 'Just now', models: 'GPT-4.1 mini, Azure AI Search', tone: 'green' },
  { name: 'Finance AI', initials: 'FA', department: 'Finance', status: 'Training', task: 'Learning the Q3 budget model', performance: 92, description: 'Assists with reporting, variance reviews, and budget preparation.', lastActive: '7 minutes ago', models: 'GPT-4.1, Azure AI Search', tone: 'gold' },
  { name: 'Support AI', initials: 'SU', department: 'Customer Success', status: 'Running', task: 'Resolving priority tickets', performance: 97, description: 'Provides fast, context-aware support for customer service requests.', lastActive: 'Just now', models: 'GPT-4.1 mini, Azure AI Search', tone: 'blue' },
  { name: 'CEO Assistant', initials: 'CA', department: 'Executive', status: 'Running', task: 'Preparing the morning brief', performance: 95, description: 'Synthesizes key business updates into concise executive briefings.', lastActive: '4 minutes ago', models: 'GPT-4.1, Azure AI Search', tone: 'purple' },
  { name: 'Operations AI', initials: 'OA', department: 'Operations', status: 'Offline', task: 'Scheduled maintenance window', performance: 87, description: 'Coordinates recurring operational tasks and maintenance planning.', lastActive: '1 hour ago', models: 'GPT-4.1 mini, Azure AI Search', tone: 'green' },
*/

const statusClass = (status) => status.toLowerCase()

export default function AgentWorkforceTable({ agents: apiAgents, onRefresh }) {
  const [agentRecords, setAgentRecords] = useState([])
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [activeModal, setActiveModal] = useState(null)
  const [form, setForm] = useState(null)
  const [menuAgent, setMenuAgent] = useState(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    setAgentRecords(apiAgents.map((agent) => ({ ...agent, task: agent.currentTask, lastActive: agent.lastActiveAt, models: agent.models })))
  }, [apiAgents])

  useEffect(() => {
    if (!selectedAgent || !activeModal) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setActiveModal(null)
        setSelectedAgent(null)
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [activeModal, selectedAgent])

  useEffect(() => {
    if (activeModal !== 'settings' || !selectedAgent) {
      setForm(null)
      return
    }

    setForm({
      ...selectedAgent,
      originalName: selectedAgent.name,
      temperature: selectedAgent.temperature ?? 0.7,
      maxTokens: selectedAgent.maxTokens ?? 2048,
    })
  }, [activeModal, selectedAgent])

  const showNotice = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2600)
  }

  const openDetails = (agent) => {
    setMenuAgent(null)
    setSelectedAgent(agent)
    setActiveModal('details')
  }

  const openSettings = (agent) => {
    setMenuAgent(null)
    setSelectedAgent(agent)
    setActiveModal('settings')
  }

  const togglePause = async (agent) => {
    await (agent.status === 'Paused' ? resumeAgent(agent.id) : pauseAgent(agent.id))
    await onRefresh()
  }

  const updateSettings = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  const saveSettings = async (event) => {
    event.preventDefault()
    if (!form) return

    await updateAgentSettings(form.id, {
      name: form.name,
      department: form.department,
      status: form.status,
      currentTask: form.task,
      models: form.models,
      description: form.description,
      temperature: Number(form.temperature),
      maxTokens: Number(form.maxTokens),
    })
    await onRefresh()

    setActiveModal(null)
    setSelectedAgent(null)
  }

  const closeModal = () => {
    setActiveModal(null)
    setSelectedAgent(null)
  }

  return (
    <>
      <motion.section
        className="dt-agents-workforce"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="dt-agents-section-heading">
          <div>
            <p>ACTIVE WORKFORCE</p>
            <h2>Your AI Agents</h2>
          </div>
          <button type="button" onClick={onRefresh}>
            View all agents
          </button>
        </header>

        <div className="dt-agents-table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">AGENT</th>
                <th scope="col">DEPARTMENT</th>
                <th scope="col">STATUS</th>
                <th scope="col">CURRENT TASK</th>
                <th scope="col">PERFORMANCE</th>
                <th scope="col">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {agentRecords.length === 0 && <tr><td colSpan="6">No agents deployed</td></tr>}
              {agentRecords.map((agent) => {
                const status = agent.status
                const canTogglePause = status === 'Running' || status === 'Paused'

                return (
                  <tr
                    key={agent.name}
                    role="link"
                    tabIndex={0}
                    onClick={() => openDetails(agent)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        openDetails(agent)
                      }
                    }}
                  >
                    <td data-label="AGENT">
                      <span className={'dt-agents-agent-avatar is-' + agent.tone}>
                        {agent.initials}
                      </span>
                      {agent.name}
                    </td>

                    <td className="dt-agents-department" data-label="DEPARTMENT">
                      {agent.department}
                    </td>

                    <td data-label="STATUS">
                      <span className={'dt-agents-status is-' + statusClass(status)}>
                        <i />
                        {status}
                      </span>
                    </td>

                    <td
                      className="dt-agents-current-task"
                      data-label="CURRENT TASK"
                      title={agent.task}
                    >
                      {agent.task}
                    </td>

                    <td data-label="PERFORMANCE">
                      <span
                        className="dt-agents-performance"
                        style={{ '--dt-agent-performance': agent.performance + '%' }}
                      >
                        <span><i /></span>
                        <strong>{agent.performance}%</strong>
                      </span>
                    </td>

                    <td data-label="ACTIONS">
                      <div
                        className="dt-agents-table-actions"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <button
                          aria-label={'View ' + agent.name}
                          type="button"
                          onClick={() => openDetails(agent)}
                        >
                          <Eye size={14} strokeWidth={1.9} aria-hidden="true" />
                        </button>

                        {canTogglePause && (
                          <button
                            aria-label={(status === 'Paused' ? 'Resume ' : 'Pause ') + agent.name}
                            title={status === 'Paused' ? 'Resume' : 'Pause'}
                            type="button"
                            onClick={() => togglePause(agent)}
                          >
                            {status === 'Paused'
                              ? <Play size={14} strokeWidth={1.9} aria-hidden="true" />
                              : <Pause size={14} strokeWidth={1.9} aria-hidden="true" />}
                          </button>
                        )}

                        <button
                          aria-label={'Configure ' + agent.name}
                          type="button"
                          onClick={() => openSettings(agent)}
                        >
                          <Settings2 size={14} strokeWidth={1.9} aria-hidden="true" />
                        </button>

                        <span className="dt-agent-more-wrap">
                          <button
                            aria-expanded={menuAgent?.name === agent.name}
                            aria-label={'More options for ' + agent.name}
                            type="button"
                            onClick={() => setMenuAgent(
                              menuAgent?.name === agent.name ? null : agent
                            )}
                          >
                            <MoreHorizontal size={15} strokeWidth={1.9} aria-hidden="true" />
                          </button>

                          {menuAgent?.name === agent.name && (
                            <span className="dt-agent-more-menu">
                              <button type="button" onClick={() => openDetails(agent)}>
                                <Eye size={14} strokeWidth={1.9} aria-hidden="true" />
                                View details
                              </button>

                              <button type="button" onClick={() => openSettings(agent)}>
                                <Settings2 size={14} strokeWidth={1.9} aria-hidden="true" />
                                Settings
                              </button>

                              <button
                                disabled={!canTogglePause}
                                type="button"
                                onClick={() => {
                                  togglePause(agent)
                                  setMenuAgent(null)
                                }}
                              >
                                {status === 'Paused'
                                  ? <Play size={14} strokeWidth={1.9} aria-hidden="true" />
                                  : <Pause size={14} strokeWidth={1.9} aria-hidden="true" />}
                                {status === 'Paused' ? 'Resume' : 'Pause'}
                              </button>

                              <button type="button" onClick={async () => { await restartAgent(agent.id); await onRefresh(); setMenuAgent(null) }}>
                                <FileText size={14} strokeWidth={1.9} aria-hidden="true" />
                                Export report
                              </button>

                              <button type="button" onClick={() => { showNotice('Agent logs are available from workflow execution history.'); setMenuAgent(null) }}>
                                <ScrollText size={14} strokeWidth={1.9} aria-hidden="true" />
                                View logs
                              </button>

                              <button type="button" onClick={async () => { await restartAgent(agent.id); await onRefresh(); setMenuAgent(null) }}>
                                <RotateCcw size={14} strokeWidth={1.9} aria-hidden="true" />
                                Restart agent
                              </button>

                              <button type="button" onClick={() => setMenuAgent(null)}>
                                <Trash2 size={14} strokeWidth={1.9} aria-hidden="true" />
                                Clear conversation
                              </button>
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {notice && <p className="dt-agent-notice" role="status">{notice}</p>}

        <AnimatePresence>
          {activeModal === 'details' && selectedAgent && (
            <motion.div
              className="dt-agent-detail-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={closeModal}
            >
              <motion.section
                className="dt-agent-detail"
                aria-label={selectedAgent.name + ' details'}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                onMouseDown={(event) => event.stopPropagation()}
              >
                <button
                  className="dt-agent-detail-close"
                  aria-label="Close agent details"
                  type="button"
                  onClick={closeModal}
                >
                  <X size={17} strokeWidth={2} aria-hidden="true" />
                </button>

                <p>AGENT OVERVIEW</p>
                <h2>{selectedAgent.name}</h2>

                <dl>
                  <div><dt>Agent name</dt><dd>{selectedAgent.name}</dd></div>
                  <div><dt>Department</dt><dd>{selectedAgent.department}</dd></div>
                  <div><dt>Status</dt><dd>{selectedAgent.status}</dd></div>
                  <div><dt>Current task</dt><dd>{selectedAgent.task}</dd></div>
                  <div><dt>Performance</dt><dd>{selectedAgent.performance}%</dd></div>
                  <div><dt>Last active</dt><dd>{selectedAgent.lastActive}</dd></div>
                  <div><dt>Assigned models</dt><dd>{selectedAgent.models}</dd></div>
                </dl>

                <div className="dt-agent-log-list">
                  <h3>Description</h3>
                  <p>{selectedAgent.description}</p>
                </div>
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {activeModal === 'settings' && form && createPortal(
        <motion.div
          className="dt-agent-detail-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={closeModal}
        >
          <motion.div
            className="agent-modal"
            aria-label={form.name + ' settings'}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="agent-modal-header">
              <div>
                <p>AGENT SETTINGS</p>
                <h2>Agent Settings</h2>
              </div>

              <button
                aria-label="Close agent settings"
                type="button"
                onClick={closeModal}
              >
                <X size={17} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <div className="agent-modal-body">
              <label>
                Agent name
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => updateSettings('name', event.target.value)}
                />
              </label>

              <label>
                Department
                <input
                  type="text"
                  value={form.department}
                  onChange={(event) => updateSettings('department', event.target.value)}
                />
              </label>

              <label>
                Current task
                <input
                  type="text"
                  value={form.task}
                  onChange={(event) => updateSettings('task', event.target.value)}
                />
              </label>

              <label>
                Model
                <input
                  type="text"
                  value={form.models}
                  onChange={(event) => updateSettings('models', event.target.value)}
                />
              </label>

              <label className="dt-agent-modal-temperature">
                <span>Temperature</span>
                <strong>{form.temperature}</strong>
                <input
                  min="0"
                  max="1"
                  step="0.1"
                  type="range"
                  value={form.temperature}
                  onChange={(event) => updateSettings(
                    'temperature',
                    Number(event.target.value)
                  )}
                />
              </label>

              <label>
                Max tokens
                <input
                  inputMode="numeric"
                  type="text"
                  value={form.maxTokens}
                  onChange={(event) => updateSettings('maxTokens', event.target.value)}
                />
              </label>

              <label className="dt-agent-modal-toggle">
                <span>Status: {form.status}</span>
                <input
                  checked={form.status === 'Running'}
                  type="checkbox"
                  onChange={(event) => updateSettings(
                    'status',
                    event.target.checked ? 'Running' : 'Paused'
                  )}
                />
                <i aria-hidden="true" />
              </label>
            </div>

            <div className="agent-modal-footer">
              <button
                className="dt-agent-modal-cancel"
                type="button"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                className="dt-agent-settings-save"
                type="button"
                onClick={saveSettings}
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}
    </>
  )
}
