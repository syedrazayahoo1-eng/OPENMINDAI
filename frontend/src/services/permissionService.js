import api from './api'

export const getPermissionGroups = async () => (await api.get('/permissions')).data
export const getRoles = async () => (await api.get('/roles')).data
export const getRolePermissions = async (roleId) => (await api.get(`/roles/${roleId}/permissions`)).data
export const updateRolePermissions = async (roleId, permissionIds) => (await api.put(`/roles/${roleId}/permissions`, { permissionIds })).data
