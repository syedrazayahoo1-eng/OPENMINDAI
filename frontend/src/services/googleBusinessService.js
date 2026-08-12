import api from './api'

export const getGoogleBusinessOverview = async () => (await api.get('/google-business/overview')).data
export const syncGoogleBusinessReviews = async () => (await api.post('/google-business/sync')).data
export const connectGoogleBusiness = () => { window.location.assign(`${api.defaults.baseURL}/google-business/oauth/connect?redirectUri=${encodeURIComponent(`${window.location.origin}/reviews`)}`) }
export const generateGoogleBusinessPost = async (payload) => (await api.post('/googlebusiness/posts/generate', payload)).data
export const generateGoogleBusinessImage = async (payload) => (await api.post('/googlebusiness/images/generate', payload)).data
