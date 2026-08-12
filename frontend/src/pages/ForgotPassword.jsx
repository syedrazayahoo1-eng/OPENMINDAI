import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CircleAlert, KeyRound, LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLoader from '../components/auth/AuthLoader'
import AuthStatePanel from '../components/auth/AuthStatePanel'
import FloatingInput from '../components/auth/FloatingInput'
import GlassAuthCard from '../components/auth/GlassAuthCard'
import useAuth from '../hooks/useAuth'
import useAuthForm from '../hooks/useAuthForm'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateEmail = (values) => (!emailPattern.test(values.email) ? { email: 'Enter a valid registered email address.' } : {})

function RecoverySupport() {
  return (
    <>
      <div className="dt2-auth-recovery-divider"><span>or</span></div>
      <Link className="dt2-auth-secondary-action" to="/login">
        <ArrowLeft size={17} strokeWidth={1.8} aria-hidden="true" />
        Back to Login
      </Link>
      <a className="dt2-auth-support-card" href="mailto:support@digitech.ai">
        <span className="dt2-auth-support-icon"><KeyRound size={18} strokeWidth={1.75} aria-hidden="true" /></span>
        <span>
          <strong>Need Help?</strong>
          <small>Contact Support</small>
        </span>
        <ArrowRight size={17} strokeWidth={1.75} aria-hidden="true" />
      </a>
      <p className="dt2-auth-security-note"><LockKeyhole size={15} strokeWidth={1.8} aria-hidden="true" /> Your information is encrypted using enterprise-grade security.</p>
    </>
  )
}

export default function ForgotPassword() {
  const navigate = useNavigate()
  const { requestPasswordReset } = useAuth()
  const form = useAuthForm({ email: '' }, validateEmail)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [sentTo, setSentTo] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    form.markAllTouched()
    setServerError('')

    if (!form.isValid) return

    setIsSubmitting(true)

    try {
      const result = await requestPasswordReset(form.values.email)
      setSentTo(result.email)
    } catch (error) {
      setServerError(error.message || 'We could not send the verification code.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <GlassAuthCard
      className="dt2-auth-card--recovery"
      icon={<KeyRound size={22} strokeWidth={1.8} />}
      title={sentTo ? 'Verification code sent' : 'Forgot Password'}
      description={sentTo ? `A secure verification code has been sent to ${sentTo}.` : <>Enter your registered email address.<br />We&apos;ll send a secure verification code.</>}
    >
      {sentTo ? (
        <>
          <AuthStatePanel
            title="Check your inbox"
            description="Enter the verification code to securely reset your password."
            action={(
              <button className="dt2-auth-submit" type="button" onClick={() => navigate('/verify-otp', { state: { email: sentTo, purpose: 'password-reset' } })}>
                Enter Verification Code
                <ArrowRight size={19} strokeWidth={1.8} aria-hidden="true" />
              </button>
            )}
          />
          <RecoverySupport />
        </>
      ) : (
        <form className="dt2-auth-form dt2-auth-recovery-form" onSubmit={submit} noValidate>
          <FloatingInput
            name="email"
            label="Registered email address"
            type="email"
            value={form.values.email}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.email ? form.errors.email : ''}
            icon={Mail}
            autoComplete="email"
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
            {isSubmitting ? <AuthLoader label="Sending verification code" /> : <><span>Send Verification Code</span><ArrowRight size={19} strokeWidth={1.8} aria-hidden="true" /></>}
          </button>

          <RecoverySupport />
        </form>
      )}
    </GlassAuthCard>
  )
}
