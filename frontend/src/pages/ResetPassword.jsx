import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLoader from '../components/auth/AuthLoader'
import AuthStatePanel from '../components/auth/AuthStatePanel'
import FloatingInput from '../components/auth/FloatingInput'
import GlassAuthCard from '../components/auth/GlassAuthCard'
import PasswordInput from '../components/auth/PasswordInput'
import PasswordStrengthMeter from '../components/auth/PasswordStrengthMeter'
import useAuth from '../hooks/useAuth'
import useAuthForm from '../hooks/useAuthForm'
import { getPendingResetEmail } from '../services/authService'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateReset = (values) => {
  const errors = {}
  if (!emailPattern.test(values.email)) errors.email = 'Enter a valid work email address.'
  if (values.password.length < 8) errors.password = 'Use at least 8 characters.'
  if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords do not match.'
  return errors
}

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const { resetPassword } = useAuth()
  const form = useAuthForm({
    email: location.state?.email || getPendingResetEmail(),
    password: '',
    confirmPassword: '',
  }, validateReset)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    form.markAllTouched()
    setServerError('')

    if (!form.isValid) return

    setIsSubmitting(true)

    try {
      await resetPassword({ email: form.values.email, password: form.values.password })
      setIsComplete(true)
    } catch (error) {
      setServerError(error.message || 'We could not update your password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <GlassAuthCard
      eyebrow="Secure reset"
      title={isComplete ? 'Password updated' : 'Create a new password'}
      description={isComplete ? 'Your account is secured with your new password.' : 'Choose a strong password that you have not used before.'}
      footer={isComplete ? null : <Link to="/login">Back to sign in</Link>}
    >
      {isComplete ? (
        <AuthStatePanel
          title="You are all set"
          description="Your password has been updated successfully. You can now sign in with your new credentials."
          action={<button className="dt2-auth-submit" type="button" onClick={() => navigate('/login', { replace: true })}>Continue to sign in</button>}
        />
      ) : (
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
            label="New password"
            value={form.values.password}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.password ? form.errors.password : ''}
            autoComplete="new-password"
            disabled={isSubmitting}
          />
          <PasswordStrengthMeter password={form.values.password} />
          <PasswordInput
            name="confirmPassword"
            label="Confirm new password"
            value={form.values.confirmPassword}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.confirmPassword ? form.errors.confirmPassword : ''}
            autoComplete="new-password"
            disabled={isSubmitting}
          />

          <AnimatePresence>
            {serverError ? (
              <motion.p className="dt2-auth-error-banner" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                <CircleAlert size={17} strokeWidth={1.9} aria-hidden="true" />
                {serverError}
              </motion.p>
            ) : null}
          </AnimatePresence>

          <button className="dt2-auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <AuthLoader label="Updating password" /> : 'Update password'}
          </button>
        </form>
      )}
    </GlassAuthCard>
  )
}
