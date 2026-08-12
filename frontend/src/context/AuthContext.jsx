import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  clearStoredSession,
  continueWithProvider,
  loginUser,
  registerUser,
  requestPasswordReset,
  restoreStoredSession,
  resendVerificationEmail,
  resetPassword,
  storeSession,
  logoutUser,
  verifyEmailAddress,
  verifyOTP,
} from '../services/authService'
import { getAuthUser } from '../utils/authToken'
import AuthStoreContext from './authStoreContext'

let pendingSessionRestore = null

const restoreSessionOnce = () => {
  if (!pendingSessionRestore) {
    pendingSessionRestore = restoreStoredSession().finally(() => {
      pendingSessionRestore = null
    })
  }

  return pendingSessionRestore
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [isBootstrapping, setIsBootstrapping] = useState(() => Boolean(getAuthUser()))

  useEffect(() => {
    let active = true
    if (!getAuthUser()) {
      setIsBootstrapping(false)
      return () => { active = false }
    }

    restoreSessionOnce()
      .then((nextSession) => {
        if (active && nextSession) setSession(nextSession)
      })
      .catch(() => {
        if (active) {
          clearStoredSession()
          setSession(null)
        }
      })
      .finally(() => {
        if (active) setIsBootstrapping(false)
      })

    return () => { active = false }
  }, [])

  const commitSession = useCallback((nextSession) => {
    storeSession(nextSession)
    setSession(nextSession)
    return nextSession
  }, [])

  const signIn = useCallback(async (credentials, { rememberDevice = false } = {}) => {
    const result = await loginUser(credentials.email, credentials.password, rememberDevice)

    if (!result.requiresVerification) {
      setSession(result)
    }

    return result
  }, [])

  const signUp = useCallback((details) => registerUser(details), [])

  const signOut = useCallback(async () => {
    try {
      await logoutUser()
    } finally {
      setSession(null)
    }
  }, [])

  const verifyEmail = useCallback(async (payload) => {
    const nextSession = await verifyEmailAddress(payload)
    setSession(nextSession)
    return nextSession
  }, [])

  const signInWithProvider = useCallback(async (provider) => {
    const nextSession = await continueWithProvider(provider)
    setSession(nextSession)
    return nextSession
  }, [])

  const value = useMemo(() => ({
    user: session?.user ?? null,
    session,
    isAuthenticated: Boolean(session?.token && session?.user),
    isBootstrapping,
    loading: isBootstrapping,
    login: commitSession,
    logout: signOut,
    signIn,
    signUp,
    signOut,
    requestPasswordReset,
    resendVerificationEmail,
    verifyOtp: verifyOTP,
    resetPassword,
    verifyEmail,
    signInWithProvider,
  }), [commitSession, isBootstrapping, session, signIn, signInWithProvider, signOut, signUp, verifyEmail])

  return <AuthStoreContext.Provider value={value}>{children}</AuthStoreContext.Provider>
}
