import { useCallback, useEffect, useState } from 'react'
import AgentActivity from '../components/agents/AgentActivity'
import AgentAnalytics from '../components/agents/AgentAnalytics'
import AgentTemplates from '../components/agents/AgentTemplates'
import AgentWorkforceTable from '../components/agents/AgentWorkforceTable'
import AgentsSummary from '../components/agents/AgentsSummary'
import AiAgentsHeader from '../components/agents/AiAgentsHeader'
import CreateAgentModal from '../components/agents/CreateAgentModal'
import RecentDeployments from '../components/agents/RecentDeployments'
import '../components/agents/aiAgents.css'
import DashboardLayout from '../layouts/DashboardLayout'
import { getAgents } from '../services/agentService'
import useLiveMonitoring from '../hooks/useLiveMonitoring'

export default function AIAgents() {
  const [isCreateAgentOpen, setIsCreateAgentOpen] = useState(false)
  const [agents, setAgents] = useState([])
  const openCreateAgent = () => setIsCreateAgentOpen(true)
  const loadAgents = useCallback(async () => {
    const records = await getAgents()
    setAgents(records)
  }, [])

  useEffect(() => { loadAgents().catch(() => setAgents([])) }, [loadAgents])
  useLiveMonitoring({ AgentStatusChanged: () => { loadAgents().catch(() => setAgents([])) } })

  return (
    <DashboardLayout>
      <div className="dt-agents">
        <AiAgentsHeader onCreateAgent={openCreateAgent} />
        <AgentsSummary />
        <section className="dt-agents-workforce-grid">
          <AgentWorkforceTable agents={agents} onRefresh={loadAgents} />
          <AgentActivity />
        </section>
        <AgentAnalytics />
        <AgentTemplates onCreateAgent={openCreateAgent} />
        <RecentDeployments />
      </div>
      <CreateAgentModal isOpen={isCreateAgentOpen} onClose={() => setIsCreateAgentOpen(false)} onCreated={loadAgents} />
    </DashboardLayout>
  )
}
