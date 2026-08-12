import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLoader from '../components/auth/AuthLoader'
import AuthStatePanel from '../components/auth/AuthStatePanel'
import FloatingInput from '../components/auth/FloatingInput'
import GlassAuthCard from '../components/auth/GlassAuthCard'
import OtpInput from '../components/auth/OtpInput'
import useAuth from '../hooks/useAuth'
import { getPendingVerificationEmail } from '../services/authService'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()
  const { resendVerificationEmail, verifyEmail } = useAuth()
  const [email, setEmail] = useState(location.state?.email || getPendingVerificationEmail())
  const [otp, setOtp] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [resendMessage, setResendMessage] = useState('')
  const [isVerified, setIsVerified] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setServerError('')

    if (!emailPattern.test(email)) {
      setServerError('Enter the email address you used to create your account.')
      return
    }

    if (otp.length !== 6) {
      setServerError('Enter the complete six-digit verification code.')
      return
    }

    setIsSubmitting(true)

    try {
      await verifyEmail({ email, code: otp })
      setIsVerified(true)
    } catch (error) {
      setServerError(error.message || 'We could not verify your email address.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resend = async () => {
    setServerError('')
    setResendMessage('')

    if (!emailPattern.test(email)) {
      setServerError('Enter a valid work email address before requesting a new code.')
      return
    }

    setIsSubmitting(true)

    try {
      await resendVerificationEmail(email)
      setResendMessage('A fresh verification code is on its way.')
    } catch (error) {
      setServerError(error.message || 'We could not resend the verification email.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <GlassAuthCard
      eyebrow="Email verification"
      title={isVerified ? 'Email verified' : 'Verify your email'}
      description={isVerified ? 'Your workspace is ready for secure access.' : 'Enter the six-digit code sent to your work email.'}
      footer={isVerified ? null : <Link to="/login">Back to sign in</Link>}
    >
      {isVerified ? (
        <AuthStatePanel
          title="Your workspace is ready"
          description="Your email is verified and your secure DIGITECH workspace is ready to use."
          action={<button className="dt2-auth-submit" type="button" onClick={() => navigate('/dashboard', { replace: true })}>Enter DIGITECH</button>}
        />
      ) : (
        <form className="dt2-auth-form" onSubmit={submit} noValidate>
          <FloatingInput
            name="email"
            label="Work email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            icon={Mail}
            autoComplete="email"
            disabled={isSubmitting}
          />
          <OtpInput value={otp} onChange={setOtp} disabled={isSubmitting} error={serverError && otp.length !== 6 ? serverError : ''} />
          <p className="dt2-auth-note">For your protection, verification codes expire after <strong>10 minutes</strong>.</p>

          <AnimatePresence>
            {serverError && otp.length === 6 ? (
              <motion.p className="dt2-auth-error-banner" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                <CircleAlert size={17} strokeWidth={1.9} aria-hidden="true" />
                {serverError}
              </motion.p>
            ) : null}
          </AnimatePresence>

          <button className="dt2-auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <AuthLoader label="Verifying email" /> : 'Verify email'}
          </button>
          <button className="dt2-auth-text-button" type="button" onClick={resend} disabled={isSubmitting}>Resend verification email</button>
          {resendMessage ? <p className="dt2-auth-note">{resendMessage}</p> : null}
        </form>
      )}
    </GlassAuthCard>
  )
}
