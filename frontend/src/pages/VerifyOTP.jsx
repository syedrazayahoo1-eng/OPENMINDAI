import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, CircleAlert, Headphones, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLoader from '../components/auth/AuthLoader'
import GlassAuthCard from '../components/auth/GlassAuthCard'
import OtpInput from '../components/auth/OtpInput'

const OTP_DURATION_SECONDS = 119

function formatTimer(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0')
}

export default function VerifyOTP() {
  const location = useLocation()
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [secondsRemaining, setSecondsRemaining] = useState(OTP_DURATION_SECONDS)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState('')
  const [resendMessage, setResendMessage] = useState('')
  const email = location.state?.email || 'your registered email'

  useEffect(() => {
    if (isVerified || secondsRemaining <= 0) return undefined

    const timer = window.setInterval(() => {
      setSecondsRemaining((currentSeconds) => Math.max(0, currentSeconds - 1))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isVerified, secondsRemaining])

  useEffect(() => {
    if (!isVerified) return undefined

    const redirect = window.setTimeout(() => {
      navigate('/reset-password', { replace: true, state: { email: location.state?.email || '' } })
    }, 1250)

    return () => window.clearTimeout(redirect)
  }, [isVerified, location.state?.email, navigate])

  const handleOtpChange = (nextOtp) => {
    setOtp(nextOtp)
    if (error) setError('')
    if (resendMessage) setResendMessage('')
  }

  const verifyCode = (event) => {
    event.preventDefault()

    if (otp.length !== 6) {
      setError('Enter the complete 6-digit verification code.')
      return
    }

    setIsVerifying(true)
    window.setTimeout(() => {
      setIsVerifying(false)
      setIsVerified(true)
    }, 650)
  }

  const resendCode = () => {
    setOtp('')
    setError('')
    setSecondsRemaining(OTP_DURATION_SECONDS)
    setResendMessage('A fresh verification code has been sent.')
  }

  return (
    <GlassAuthCard
      className="dt2-auth-card--otp"
      eyebrow={isVerified ? 'Secure access confirmed' : 'Secure verification'}
      icon={isVerified ? <Check size={21} strokeWidth={2.15} /> : <ShieldCheck size={21} strokeWidth={1.9} />}
      title={isVerified ? 'Verification Successful' : 'Enter Verification Code'}
      description={isVerified ? 'Your identity has been securely confirmed.' : 'Please enter the 6-digit code sent to your email.'}
    >
      <AnimatePresence mode="wait">
        {isVerified ? (
          <motion.div
            className="dt2-auth-otp-success"
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="dt2-auth-otp-success-icon"><Check size={29} strokeWidth={2.35} aria-hidden="true" /></span>
            <p>Redirecting to secure password setup…</p>
            <span className="dt2-auth-otp-success-loader" aria-hidden="true"><i /></span>
          </motion.div>
        ) : (
          <motion.form
            className="dt2-auth-form dt2-auth-otp-form"
            key="form"
            onSubmit={verifyCode}
            noValidate
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="dt2-auth-otp-email">Code sent to <strong>{email}</strong></p>
            <OtpInput value={otp} onChange={handleOtpChange} disabled={isVerifying} error={error} />

            <div className="dt2-auth-otp-timer" aria-live="polite">
              {secondsRemaining > 0 ? (
                <>
                  <span>Code expires in</span>
                  <strong>{formatTimer(secondsRemaining)}</strong>
                </>
              ) : (
                <button className="dt2-auth-otp-resend" type="button" onClick={resendCode}>
                  Resend Code
                </button>
              )}
            </div>

            <AnimatePresence>
              {resendMessage ? (
                <motion.p
                  className="dt2-auth-otp-resend-message"
                  role="status"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                >
                  <Check size={15} strokeWidth={2.1} aria-hidden="true" />
                  {resendMessage}
                </motion.p>
              ) : null}
            </AnimatePresence>

            <button className="dt2-auth-submit" type="submit" disabled={isVerifying}>
              {isVerifying ? <AuthLoader label="Verifying identity" /> : <>Verify &amp; Continue <ArrowRight size={17} strokeWidth={2.1} aria-hidden="true" /></>}
            </button>

            <Link className="dt2-auth-secondary-action" to="/forgot-password">
              <ArrowLeft size={16} strokeWidth={1.9} aria-hidden="true" />
              Back to Forgot Password
            </Link>

            <a className="dt2-auth-support-card" href="mailto:support@digitech.ai">
              <span className="dt2-auth-support-icon"><Headphones size={19} strokeWidth={1.8} aria-hidden="true" /></span>
              <span>
                <strong>Need Help?</strong>
                <small>Contact Support</small>
              </span>
              <ArrowRight size={17} strokeWidth={1.9} aria-hidden="true" />
            </a>

            <p className="dt2-auth-security-note">
              <LockKeyhole size={14} strokeWidth={1.9} aria-hidden="true" />
              This verification code expires in 2 minutes.
            </p>

            <AnimatePresence>
              {error ? (
                <motion.p
                  className="dt2-auth-error-banner"
                  role="alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                >
                  <CircleAlert size={17} strokeWidth={1.9} aria-hidden="true" />
                  {error}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </GlassAuthCard>
  )
}
