import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLoader from '../components/auth/AuthLoader'
import FloatingInput from '../components/auth/FloatingInput'
import GlassAuthCard from '../components/auth/GlassAuthCard'
import PasswordInput from '../components/auth/PasswordInput'
import SocialLoginButtons from '../components/auth/SocialLoginButtons'
import useAuth from '../hooks/useAuth'
import useAuthForm from '../hooks/useAuthForm'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateLogin = (values) => {
  const errors = {}
  if (!emailPattern.test(values.email)) errors.email = 'Enter a valid work email address.'
  if (!values.password) errors.password = 'Enter your password.'
  return errors
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, signIn, signInWithProvider } = useAuth()
  const form = useAuthForm({ email: '', password: '' }, validateLogin)
  const [rememberDevice, setRememberDevice] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const destination = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(destination, { replace: true })
    }
  }, [destination, isAuthenticated, navigate])

  const submit = async (event) => {
    event.preventDefault()
    form.markAllTouched()
    setServerError('')

    if (!form.isValid) return

    setIsSubmitting(true)

    try {
      const result = await signIn(form.values, { rememberDevice })

      if (result.requiresVerification) {
        navigate('/verify-email', { state: { email: result.email } })
        return
      }

      navigate(destination, { replace: true })
    } catch (error) {
      setServerError(error.message || 'Unable to sign you in right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectProvider = async (provider) => {
    setServerError('')
    setIsSubmitting(true)

    try {
      await signInWithProvider(provider)
      navigate(destination, { replace: true })
    } catch (error) {
      setServerError(error.message || 'Unable to continue with that provider.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <GlassAuthCard
      eyebrow="Welcome back"
      title="Sign in to DIGITECH"
      description="Use your enterprise workspace credentials to continue."
      footer={<><span>New to DIGITECH? </span><Link to="/register">Create an account</Link></>}
    >
      <form className="dt2-auth-form" onSubmit={submit} noValidate>
        <FloatingInput
          name="email"
          label="Work email"
          type="email"
          value={form.values.email}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.touched.email ? form.errors.email : ''}
          icon={Mail}
          autoComplete="email"
          disabled={isSubmitting}
        />
        <PasswordInput
          name="password"
          label="Password"
          value={form.values.password}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.touched.password ? form.errors.password : ''}
          disabled={isSubmitting}
        />
        <div className="dt2-auth-form-row">
          <label className="dt2-auth-checkbox">
            <input type="checkbox" checked={rememberDevice} onChange={(event) => setRememberDevice(event.target.checked)} disabled={isSubmitting} />
            Remember this device
          </label>
          <Link className="dt2-auth-text-button" to="/forgot-password">Forgot password?</Link>
        </div>

        <AnimatePresence>
          {serverError ? (
            <motion.p className="dt2-auth-error-banner" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
              <CircleAlert size={17} strokeWidth={1.9} aria-hidden="true" />
              {serverError}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <button className="dt2-auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <AuthLoader label="Signing in" /> : 'Sign in to DIGITECH'}
        </button>

        <SocialLoginButtons onSelect={selectProvider} disabled={isSubmitting} />
      </form>
    </GlassAuthCard>
  )
}
