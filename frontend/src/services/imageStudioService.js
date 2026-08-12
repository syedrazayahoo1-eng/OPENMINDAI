import api from './api'

export const getGeneratedImages = async (skip = 0, take = 24) => (await api.get('/images', { params: { skip, take } })).data
export const generateImages = async (payload) => (await api.post('/images/generate', payload)).data
export const deleteGeneratedImage = async (id) => api.delete(`/images/${id}`)
export const downloadGeneratedImage = async (id) => (await api.post(`/images/${id}/download`, null, { responseType: 'blob' })).data
