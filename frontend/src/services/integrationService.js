import api from './api'
export const getIntegration = async (provider) => (await api.get(`/integrations/${provider}`)).data
export const saveIntegration = async (provider, settings) => (await api.put(`/integrations/${provider}`, { settings })).data
export const testIntegration = async (provider) => (await api.post(`/integrations/${provider}/test`)).data
export const getGoogleBusinessIntegration = async () => (await api.get('/integrations/google-business')).data
export const reconnectGoogleBusiness = async () => (await api.post('/integrations/google-business/reconnect')).data
