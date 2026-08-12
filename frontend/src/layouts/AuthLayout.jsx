import { motion } from 'framer-motion'
import { ArrowLeft, Check, Fingerprint, KeyRound, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import AuthBrand from '../components/auth/AuthBrand'
import OtpVerificationIllustration from '../components/auth/OtpVerificationIllustration'
import RecoveryIllustration from '../components/auth/RecoveryIllustration'
import '../components/auth/auth.css'

const enterpriseBenefits = [
  'Secure, enterprise-ready access',
  'One workspace for every operation',
  'Intelligence that scales with you',
]

const recoveryFeatures = [
  { icon: ShieldCheck, title: 'Enterprise Security', description: 'Protected access across every workspace.' },
  { icon: LockKeyhole, title: 'Military Grade Encryption', description: 'Your recovery request remains private.' },
  { icon: KeyRound, title: 'Instant Password Recovery', description: 'Securely regain access in minutes.' },
]

const otpFeatures = [
  { icon: ShieldCheck, title: 'Enterprise Verification', description: 'Trusted identity protection for every workspace.' },
  { icon: Fingerprint, title: 'Zero Trust Security', description: 'Each sign-in is independently verified.' },
  { icon: LockKeyhole, title: 'Encrypted Authentication', description: 'Your access remains private and protected.' },
]

function RecoveryFlourish() {
  return (
    <svg className="dt2-auth-recovery-flourish" viewBox="0 0 260 40" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="dt2-auth-recovery-flourish-gold" x1="6" y1="8" x2="254" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A66D12" />
          <stop offset="0.32" stopColor="#D8B25E" />
          <stop offset="0.5" stopColor="#F2D588" />
          <stop offset="0.68" stopColor="#D8B25E" />
          <stop offset="1" stopColor="#A66D12" />
        </linearGradient>
      </defs>
      <path d="M6 27c24 0 34-13 56-13 17 0 25 9 39 9 13 0 19-9 29-9" stroke="url(#dt2-auth-recovery-flourish-gold)" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M254 27c-24 0-34-13-56-13-17 0-25 9-39 9-13 0-19-9-29-9" stroke="url(#dt2-auth-recovery-flourish-gold)" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M121 25c4-2 7-6 9-13 3 7 6 11 9 13" stroke="url(#dt2-auth-recovery-flourish-gold)" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M130 5c-2.7 4.3-5.1 6.6-8.7 8.4 3.6.2 6.6 2.2 8.7 5.4 2.1-3.2 5.1-5.2 8.7-5.4-3.6-1.8-6-4.1-8.7-8.4Z" fill="url(#dt2-auth-recovery-flourish-gold)" />
    </svg>
  )
}

function OtpFlourish() {
  return (
    <svg className="dt2-auth-otp-flourish" viewBox="0 0 260 40" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="dt2-auth-otp-flourish-gold" x1="5" y1="3" x2="255" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A66D12" />
          <stop offset="0.33" stopColor="#D8B25E" />
          <stop offset="0.5" stopColor="#F2D588" />
          <stop offset="0.7" stopColor="#D8B25E" />
          <stop offset="1" stopColor="#A66D12" />
        </linearGradient>
      </defs>
      <path d="M7 27c26 0 34-14 57-14 16 0 24 9 38 9 12 0 19-8 28-8" stroke="url(#dt2-auth-otp-flourish-gold)" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M253 27c-26 0-34-14-57-14-16 0-24 9-38 9-12 0-19-8-28-8" stroke="url(#dt2-auth-otp-flourish-gold)" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M122 25c4-2 6-6 8-13 2 7 4 11 8 13" stroke="url(#dt2-auth-otp-flourish-gold)" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M130 4c-2.5 4.25-4.9 6.65-8.5 8.45 3.6.25 6.2 2.05 8.5 5.5 2.3-3.45 4.9-5.25 8.5-5.5-3.6-1.8-6-4.2-8.5-8.45Z" fill="url(#dt2-auth-otp-flourish-gold)" />
    </svg>
  )
}

function RecoveryWaves() {
  return (
    <svg className="dt2-auth-recovery-waves" viewBox="0 0 1600 330" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="dt2-auth-recovery-wave-primary" x1="0" y1="0" x2="1600" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F2D588" stopOpacity="0" />
          <stop offset="0.22" stopColor="#D8B25E" stopOpacity="0.52" />
          <stop offset="0.5" stopColor="#FFFDF9" stopOpacity="0.9" />
          <stop offset="0.8" stopColor="#C8972F" stopOpacity="0.46" />
          <stop offset="1" stopColor="#F2D588" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="dt2-auth-recovery-wave-secondary" x1="0" y1="0" x2="1600" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F2D588" stopOpacity="0" />
          <stop offset="0.36" stopColor="#FFFDF9" stopOpacity="0.7" />
          <stop offset="0.74" stopColor="#D8B25E" stopOpacity="0.48" />
          <stop offset="1" stopColor="#F2D588" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M-70 226c180-95 292 67 474 2 156-57 208-17 337 15 181 45 302-173 470-93 125 60 246 56 450-89" stroke="url(#dt2-auth-recovery-wave-primary)" />
      <path d="M-73 284c142-116 269 37 430-12 145-44 216-119 378-57 160 61 258 39 399-72 145-116 267 62 545-132" stroke="url(#dt2-auth-recovery-wave-secondary)" />
      <path d="M-16 330c141-152 246 16 398-51 129-58 194 1 318 14 153 14 287-140 436-31 143 104 264-32 380-29 158 4 211 64 379-54" stroke="url(#dt2-auth-recovery-wave-primary)" />
    </svg>
  )
}

function DefaultIntro() {
  return (
    <motion.aside
      className="dt2-auth-intro"
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="dt2-auth-intro-kicker"><ShieldCheck size={16} strokeWidth={1.8} aria-hidden="true" /> DIGITECH Enterprise</span>
      <h1>Built for the business <em>you are becoming.</em></h1>
      <p>Access the intelligence layer that brings your operations, customer experience, and growth into focus.</p>
      <ul>
        {enterpriseBenefits.map((benefit) => (
          <li key={benefit}><span><Check size={15} strokeWidth={2.4} aria-hidden="true" /></span>{benefit}</li>
        ))}
      </ul>
    </motion.aside>
  )
}

function RecoveryIntro() {
  return (
    <motion.aside
      className="dt2-auth-intro dt2-auth-recovery-intro"
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <RecoveryFlourish />
      <span className="dt2-auth-intro-kicker"><Sparkles size={15} strokeWidth={1.8} aria-hidden="true" /> DIGITECH ENTERPRISE</span>
      <h1>Recover your <em>workspace</em></h1>
      <p>Don&apos;t worry. We&apos;ll securely help you regain access to your AI platform.</p>
      <RecoveryIllustration />
      <div className="dt2-auth-recovery-features">
        {recoveryFeatures.map(({ icon: Icon, title, description }) => (
          <article className="dt2-auth-recovery-feature" key={title}>
            <span><Icon size={19} strokeWidth={1.75} aria-hidden="true" /></span>
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>
    </motion.aside>
  )
}

function OtpIntro() {
  return (
    <motion.aside
      className="dt2-auth-intro dt2-auth-otp-intro"
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <OtpFlourish />
      <span className="dt2-auth-intro-kicker"><ShieldCheck size={15} strokeWidth={1.8} aria-hidden="true" /> DIGITECH ENTERPRISE</span>
      <h1>Verify your <em>identity</em></h1>
      <p>We&apos;ve sent a secure 6-digit verification code to your registered email.</p>
      <OtpVerificationIllustration />
      <div className="dt2-auth-otp-features">
        {otpFeatures.map(({ icon: Icon, title, description }) => (
          <article className="dt2-auth-otp-feature" key={title}>
            <span><Icon size={18} strokeWidth={1.75} aria-hidden="true" /></span>
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>
    </motion.aside>
  )
}

export default function AuthLayout({ children, variant = 'default' }) {
  const location = useLocation()
  const isRecovery = variant === 'recovery'
  const isOtp = location.pathname === '/verify-otp'
  const className = ['dt2-auth', isRecovery ? 'dt2-auth--recovery' : '', isOtp ? 'dt2-auth--otp' : ''].filter(Boolean).join(' ')

  return (
    <main className={className}>
      <div className="dt2-auth-background" aria-hidden="true" />
      {isRecovery || isOtp ? <RecoveryWaves /> : null}
      <div className="dt2-auth-shell">
        <header className="dt2-auth-topbar">
          <AuthBrand />
          <Link className="dt2-auth-return" to="/">
            <ArrowLeft size={16} strokeWidth={1.8} aria-hidden="true" />
            Back to Home
          </Link>
        </header>

        <section className="dt2-auth-stage">
          {isOtp ? <OtpIntro /> : isRecovery ? <RecoveryIntro /> : <DefaultIntro />}
          <div className="dt2-auth-form-stage">{children}</div>
        </section>
      </div>
    </main>
  )
}
