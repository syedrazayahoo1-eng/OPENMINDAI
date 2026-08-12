import api from './api'

const customerService = {
  async getCustomers(params = {}) {
    const { data } = await api.get('/customers', { params })
    return data
  },
  async getCustomer(id) {
    const { data } = await api.get(`/customers/${id}`)
    return data
  },
  async createCustomer(payload) {
    const { data } = await api.post('/customers', payload)
    return data
  },
  async updateCustomer(id, payload) {
    const { data } = await api.put(`/customers/${id}`, payload)
    return data
  },
  async deleteCustomer(id) {
    await api.delete(`/customers/${id}`)
  },
}

export default customerService
