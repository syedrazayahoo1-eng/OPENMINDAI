import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLoader from '../components/auth/AuthLoader'
import FloatingInput from '../components/auth/FloatingInput'
import GlassAuthCard from '../components/auth/GlassAuthCard'
import PasswordInput from '../components/auth/PasswordInput'
import PasswordStrengthMeter from '../components/auth/PasswordStrengthMeter'
import SocialLoginButtons from '../components/auth/SocialLoginButtons'
import useAuth from '../hooks/useAuth'
import useAuthForm from '../hooks/useAuthForm'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateRegistration = (values) => {
  const errors = {}
  if (values.name.trim().length < 2) errors.name = 'Enter your full name.'
  if (!emailPattern.test(values.email)) errors.email = 'Enter a valid work email address.'
  if (values.password.length < 8) errors.password = 'Use at least 8 characters.'
  if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords do not match.'
  return errors
}

export default function Register() {
  const navigate = useNavigate()
  const { signInWithProvider, signUp } = useAuth()
  const form = useAuthForm({ name: '', email: '', password: '', confirmPassword: '' }, validateRegistration)
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false)
  const [hasSubmittedTerms, setHasSubmittedTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    form.markAllTouched()
    setHasSubmittedTerms(true)
    setServerError('')

    if (!form.isValid || !hasAcceptedTerms) return

    setIsSubmitting(true)

    try {
      const result = await signUp({
        name: form.values.name,
        email: form.values.email,
        password: form.values.password,
      })
      navigate('/verify-email', { state: { email: result.email, isNewAccount: true } })
    } catch (error) {
      setServerError(error.message || 'Unable to create your account right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectProvider = async (provider) => {
    setServerError('')
    setIsSubmitting(true)

    try {
      await signInWithProvider(provider)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setServerError(error.message || 'Unable to continue with that provider.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <GlassAuthCard
      eyebrow="Get started"
      title="Create your workspace"
      description="Set up secure access to your DIGITECH intelligence platform."
      footer={<><span>Already have an account? </span><Link to="/login">Sign in</Link></>}
    >
      <form className="dt2-auth-form" onSubmit={submit} noValidate>
        <FloatingInput
          name="name"
          label="Full name"
          value={form.values.name}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.touched.name ? form.errors.name : ''}
          icon={UserRound}
          autoComplete="name"
          disabled={isSubmitting}
        />
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
          label="Create password"
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
          label="Confirm password"
          value={form.values.confirmPassword}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.touched.confirmPassword ? form.errors.confirmPassword : ''}
          autoComplete="new-password"
          disabled={isSubmitting}
        />
        <label className="dt2-auth-checkbox">
          <input type="checkbox" checked={hasAcceptedTerms} onChange={(event) => setHasAcceptedTerms(event.target.checked)} disabled={isSubmitting} />
          I agree to the DIGITECH terms and privacy policy.
        </label>
        {hasSubmittedTerms && !hasAcceptedTerms ? <p className="dt2-auth-terms-error" role="alert">Please accept the terms to continue.</p> : null}

        <AnimatePresence>
          {serverError ? (
            <motion.p className="dt2-auth-error-banner" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
              <CircleAlert size={17} strokeWidth={1.9} aria-hidden="true" />
              {serverError}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <button className="dt2-auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <AuthLoader label="Creating account" /> : 'Create DIGITECH account'}
        </button>

        <SocialLoginButtons onSelect={selectProvider} disabled={isSubmitting} />
      </form>
    </GlassAuthCard>
  )
}
