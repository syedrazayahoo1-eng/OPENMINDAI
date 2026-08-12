import api from './api'

export const getOrganization = () => api.get('/organization').then(({ data }) => data)
export const createOrganization = (input) => api.post('/organization', input).then(({ data }) => data)
export const updateOrganization = (_, input) => api.put('/organization', input).then(({ data }) => data)
export const deleteOrganization = (id) => api.delete(`/organization/${id}`)
