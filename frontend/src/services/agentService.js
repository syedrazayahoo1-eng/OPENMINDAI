import api from './api'

export const getAgents = async () => (await api.get('/agents')).data
export const getAgent = async (id) => (await api.get(`/agents/${id}`)).data
export const createAgent = async (agent) => (await api.post('/agents', agent)).data
export const pauseAgent = async (id) => (await api.post(`/agents/${id}/pause`)).data
export const resumeAgent = async (id) => (await api.post(`/agents/${id}/resume`)).data
export const updateAgentSettings = async (id, settings) => api.put(`/agents/${id}/settings`, settings)
export const restartAgent = async (id) => (await api.post(`/agents/${id}/restart`)).data
export const deleteAgent = async (id) => api.delete(`/agents/${id}`)
export const getAgentLogs = async (id) => (await api.get(`/agents/${id}/logs`)).data
export const clearAgentConversations = async (id) => api.delete(`/agents/${id}/conversation`)

export const exportAgent = async (id) => {
  const response = await api.post(`/agents/${id}/export`, null, { responseType: 'blob' })
  const url = URL.createObjectURL(response.data)
  const link = document.createElement('a')
  link.href = url
  link.download = `${id}-export.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
