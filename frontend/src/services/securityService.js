import api from './api'

export const getSecurityProfile = async () => (await api.get('/security/profile')).data
export const changePassword = async (payload) => api.put('/security/change-password', payload)
export const getSessions = async () => (await api.get('/security/sessions')).data
export const revokeSession = async (id) => api.delete(`/security/sessions/${id}`)
export const revokeOtherSessions = async () => (await api.delete('/security/sessions')).data
export const getLoginHistory = async () => (await api.get('/security/login-history')).data
export const getApiKeys = async () => (await api.get('/security/api-keys')).data
export const createApiKey = async (payload) => (await api.post('/security/api-keys', payload)).data
export const revokeApiKey = async (id) => api.delete(`/security/api-keys/${id}`)
export const getMfa = async () => (await api.get('/security/mfa')).data
export const enableMfa = async () => (await api.post('/security/mfa/enable')).data
export const disableMfa = async () => api.post('/security/mfa/disable')
export const getAuditLogs = async (params = {}) => (await api.get('/security/audit-logs', { params })).data
