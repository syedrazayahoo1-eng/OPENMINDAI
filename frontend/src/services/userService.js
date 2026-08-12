import api from './api'

export const getUsers = async (params = {}) => (await api.get('/users', { params })).data
export const getUser = async (id) => (await api.get(`/users/${id}`)).data
export const inviteUser = async (payload) => (await api.post('/users/invite', payload)).data
export const updateUser = async (id, payload) => (await api.put(`/users/${id}`, payload)).data
export const deleteUser = async (id) => api.delete(`/users/${id}`)
export const activateUser = async (id) => (await api.patch(`/users/${id}/activate`)).data
export const deactivateUser = async (id) => (await api.patch(`/users/${id}/deactivate`)).data
export const assignUserRoles = async (id, roleIds) => (await api.patch(`/users/${id}/roles`, { roleIds })).data
export const getRoles = async () => (await api.get('/roles')).data
