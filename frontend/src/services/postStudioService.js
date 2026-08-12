import api from './api'

export const getPosts = async () => (await api.get('/posts')).data
export const getPost = async (id) => (await api.get(`/posts/${id}`)).data
export const generatePost = async (payload) => (await api.post('/posts/generate', payload)).data
export const createPost = async (payload) => (await api.post('/posts', payload)).data
export const updatePost = async (id, payload) => (await api.put(`/posts/${id}`, payload)).data
export const deletePost = async (id) => api.delete(`/posts/${id}`)
export const publishPost = async (id) => (await api.post(`/posts/${id}/publish`)).data
export const schedulePost = async (id, scheduledTime) => (await api.post(`/posts/${id}/schedule`, { scheduledTime })).data
export const getBusinessLocations = async () => (await api.get('/google/locations')).data
export const getPostHistory = async () => (await api.get('/posts/history')).data
export const getScheduledPosts = async () => (await api.get('/posts/scheduled')).data
export const cancelPost = async (id) => api.delete(`/posts/${id}/cancel`)
export const retryPost = async (id) => (await api.post(`/posts/${id}/retry`)).data
export const duplicatePost = async (id) => (await api.post(`/posts/${id}/duplicate`)).data
