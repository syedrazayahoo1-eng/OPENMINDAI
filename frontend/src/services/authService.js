import api from './api'
import { refreshAuthSession } from './api'
import {
  clearAuthSession,
  getAuthToken,
  getAuthUser,
  setAuthSession,
} from '../utils/authToken'

// UI-flow-only keys (no backend endpoint exists for these yet — see notes below)
const RESET_EMAIL_KEY = 'digitech_v2_reset_email'
const VERIFY_EMAIL_KEY = 'digitech_v2_verify_email'

const wait = (duration = 300) => new Promise((resolve) => setTimeout(resolve, duration))

const normaliseEmail = (email) => email.trim().toLowerCase()

const extractErrorMessage = (error, fallback) => {
  const data = error?.response?.data

  if (typeof data === 'string' && data.trim()) return data
  if (data?.message) return data.message
  if (data?.title) return data.title

  if (data?.errors) {
    const firstField = Object.values(data.errors)[0]
    if (Array.isArray(firstField) && firstField[0]) return firstField[0]
  }

  return error?.message || fallback
}

const buildUser = ({ fullName, email, companyName }) => ({
  name: fullName,
  fullName,
  email,
  companyName,
})

const buildSession = ({ accessToken, token, user, fullName, email, companyName, rememberMe = false }) => ({
  token: accessToken || token,
  rememberMe,
  user: user || buildUser({ fullName, email, companyName }),
  issuedAt: new Date().toISOString(),
})

export const getStoredSession = () => {
  const token = getAuthToken()
  const user = getAuthUser()

  return token && user ? { token, user, issuedAt: new Date().toISOString() } : null
}

export const storeSession = (session) => setAuthSession(session)

export const clearStoredSession = () => {
  clearAuthSession()
}

export const restoreStoredSession = async () => {
  const user = getAuthUser()
  if (!user) return null

  const token = await refreshAuthSession()
  return { token, user, issuedAt: new Date().toISOString() }
}

export const logoutUser = async () => {
  try {
    await api.post('/auth/logout', {})
  } finally {
    clearAuthSession()
  }
}

export const revokeAllDevices = async () => {
  try {
    await api.post('/auth/revoke')
  } finally {
    clearAuthSession()
  }
}

export const loginUser = async (email, password, rememberMe = false) => {
  try {
    const { data } = await api.post('/auth/login', {
      email: normaliseEmail(email),
      password,
      rememberMe,
    })

    const session = buildSession({ ...data, rememberMe })
    storeSession(session)
    return session
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'We could not verify that email and password combination.'), { cause: error })
  }
}

export const registerUser = async ({ name, email, password, companyName }) => {
  const formattedEmail = normaliseEmail(email)
  const trimmedName = name.trim()

  // Register.jsx does not currently collect a company name, but the backend
  // requires one. Falling back to a sensible default so registration keeps
  // working without changing the Register.jsx form. Recommend adding a
  // "Company name" field to Register.jsx when you're ready — at that point
  // just pass it through here instead of using this fallback.
  const resolvedCompanyName = companyName?.trim() || `${trimmedName}'s Workspace`

  try {
    await api.post('/auth/register', {
      fullName: trimmedName,
      email: formattedEmail,
      password,
      companyName: resolvedCompanyName,
    })
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'An account with that email already exists. Please sign in instead.'), { cause: error })
  }

  // The register endpoint does not return a session, so sign the new
  // account in immediately to obtain a real JWT and store a real session.
  await loginUser(formattedEmail, password, true)

  sessionStorage.setItem(VERIFY_EMAIL_KEY, formattedEmail)

  return { email: formattedEmail }
}

// -----------------------------------------------------------------------
// Everything below (email verification OTP, forgot/reset password, social
// login) has NO corresponding backend endpoint in the spec provided — only
// /api/auth/login and /api/auth/register exist. Register.jsx and
// VerifyEmail.jsx still navigate through the OTP screen unconditionally
// (that flow isn't something authService can change without touching those
// components), so the functions below keep that screen working as a
// client-side confirmation step on top of the real session that was
// already established by loginUser()/registerUser() above. They do not
// call the backend. Wire these to real endpoints once they exist.
// -----------------------------------------------------------------------

export const verifyEmailAddress = async ({ email } = {}) => {
  await wait(400)

  const session = getStoredSession()

  if (!session) {
    throw new Error('We could not find an active session for that account. Please sign in again.')
  }

  if (email) {
    sessionStorage.removeItem(VERIFY_EMAIL_KEY)
  }

  return session
}

export const verifyOTP = async ({ email, purpose = 'password-reset' } = {}) => {
  await wait(400)

  const formattedEmail = normaliseEmail(email || '')

  if (purpose === 'email-verification') {
    return verifyEmailAddress({ email: formattedEmail })
  }

  sessionStorage.setItem(RESET_EMAIL_KEY, formattedEmail)
  return { email: formattedEmail }
}

export const resendVerificationEmail = async (email) => {
  await wait(400)
  return { email: normaliseEmail(email) }
}

export const requestPasswordReset = async (email) => {
  await wait(400)

  const formattedEmail = normaliseEmail(email)
  sessionStorage.setItem(RESET_EMAIL_KEY, formattedEmail)
  return { email: formattedEmail }
}

export const resetPassword = async () => {
  await wait(400)
  throw new Error('Password reset is not available yet. Please contact your administrator or sign in with your current password.')
}

export const continueWithProvider = async (provider) => {
  await wait(300)

  const providerName = provider === 'microsoft' ? 'Microsoft' : 'Google'
  throw new Error(`Sign in with ${providerName} isn't available yet. Please use your email and password.`)
}

export const getPendingResetEmail = () => sessionStorage.getItem(RESET_EMAIL_KEY) || ''

export const getPendingVerificationEmail = () => sessionStorage.getItem(VERIFY_EMAIL_KEY) || ''
