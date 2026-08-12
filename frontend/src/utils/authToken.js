const ACCESS_TOKEN_KEY = 'digitech_auth_token'
const USER_KEY = 'digitech_auth_user'
const REMEMBER_ME_KEY = 'digitech_remember_me'

const sessionStorageAvailable = () => typeof window !== 'undefined' && window.sessionStorage
const localStorageAvailable = () => typeof window !== 'undefined' && window.localStorage

const getValue = (key) => (localStorageAvailable() ? localStorage.getItem(key) : null) || (sessionStorageAvailable() ? sessionStorage.getItem(key) : null)

const removeValue = (key) => {
  if (localStorageAvailable()) localStorage.removeItem(key)
  if (sessionStorageAvailable()) sessionStorage.removeItem(key)
}

const setValue = (key, value, persistent) => {
  removeValue(key)
  const storage = persistent ? localStorage : sessionStorage
  storage.setItem(key, value)
}

export function getAuthToken() {
  return accessToken
}


export function shouldRememberSession() {
  return getValue(REMEMBER_ME_KEY) === 'true'
}

export function setAuthToken(token) {
  if (token) accessToken = token
}

export function setAuthUser(user, rememberMe = shouldRememberSession()) {
  if (user) setValue(USER_KEY, JSON.stringify(user), rememberMe)
}

let accessToken = null
export function setAuthSession({ accessToken: nextAccessToken, token, user, rememberMe = false }) {
  const resolvedAccessToken = nextAccessToken || token
  if (!resolvedAccessToken) {
    throw new Error('The authentication response did not include a complete session.')
  }

  clearAuthSession()
  accessToken = resolvedAccessToken
  setValue(REMEMBER_ME_KEY, String(rememberMe), rememberMe)
  if (user) setValue(USER_KEY, JSON.stringify(user), rememberMe)
}

export function getAuthUser() {
  try {
    const stored = getValue(USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function clearAuthSession() {
  accessToken = null
  ;[ACCESS_TOKEN_KEY, USER_KEY, REMEMBER_ME_KEY].forEach(removeValue)
}

export function buildAuthHeader() {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
