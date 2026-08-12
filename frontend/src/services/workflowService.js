import api from './api'

export const getWorkflows = async () => (await api.get('/workflows')).data
export const getWorkflow = async (id) => (await api.get(`/workflows/${id}`)).data
export const createWorkflow = async (workflow) => (await api.post('/workflows', workflow)).data
export const updateWorkflow = async (id, workflow) => (await api.put(`/workflows/${id}`, workflow)).data
export const deleteWorkflow = async (id) => api.delete(`/workflows/${id}`)
export const runWorkflow = async (id) => (await api.post(`/workflows/${id}/run`)).data
export const getWorkflowRuntime = async (id) => (await api.get(`/workflows/${id}/runtime`)).data
