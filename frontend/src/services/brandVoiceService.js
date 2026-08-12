import api from './api'

export const getBrandVoice = async () => {
  const { data } = await api.get('/brandvoice')
  return data
}

export const updateBrandVoice = async (brandVoice) => {
  const { data } = await api.put('/brandvoice', brandVoice)
  return data
}
