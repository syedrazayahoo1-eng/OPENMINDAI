import axios from 'axios'
import {
  buildAuthHeader,
  clearAuthSession,
  getAuthUser,
  setAuthSession,
  shouldRememberSession,
} from '../utils/authToken'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5016/api'
const authPaths = ['/auth/login', '/auth/refresh', '/auth/register']
let refreshRequest = null

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

const refreshClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

const redirectToLogin = () => {
  clearAuthSession()
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.assign('/login')
  }
}

export const refreshAuthSession = async () => {
  const { data } = await refreshClient.post('/auth/refresh', {})
  setAuthSession({
    ...data,
    user: getAuthUser(),
    rememberMe: shouldRememberSession(),
  })
  return data.accessToken || data.token
}

api.interceptors.request.use((config) => {
  Object.assign(config.headers, buildAuthHeader())
  config.headers['X-Correlation-ID'] ??= crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config
    const path = request?.url || ''
    const canRefresh = error.response?.status === 401 && request && !request._retry && !authPaths.some((authPath) => path.endsWith(authPath))

    if (!canRefresh) return Promise.reject(error)

    request._retry = true
    try {
      refreshRequest ??= refreshAuthSession().finally(() => { refreshRequest = null })
      const accessToken = await refreshRequest
      request.headers = { ...request.headers, Authorization: `Bearer ${accessToken}` }
      return api(request)
    } catch (refreshError) {
      redirectToLogin()
      return Promise.reject(refreshError)
    }
  },
)

export default api
