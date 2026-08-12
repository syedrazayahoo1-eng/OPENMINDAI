import api from './api'
export const getAnalytics = async (name, params) => (await api.get(`/analytics/${name}`, { params })).data
