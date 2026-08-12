function getPasswordStrength(password) {
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length

  if (!password) return { score: 0, label: 'Enter a password', tone: 'empty' }
  if (score <= 1) return { score, label: 'Weak password', tone: 'weak' }
  if (score === 2) return { score, label: 'Fair password', tone: 'fair' }
  if (score === 3) return { score, label: 'Strong password', tone: 'strong' }
  return { score, label: 'Excellent password', tone: 'excellent' }
}

export default function PasswordStrengthMeter({ password }) {
  const strength = getPasswordStrength(password)

  return (
    <div className="dt2-auth-password-strength" aria-live="polite">
      <div className="dt2-auth-password-strength-head">
        <span>Password strength</span>
        <strong className={`dt2-auth-password-strength-label dt2-auth-password-strength-label--${strength.tone}`}>{strength.label}</strong>
      </div>
      <div className="dt2-auth-password-strength-bars" aria-hidden="true">
        {[1, 2, 3, 4].map((bar) => (
          <span
            className={bar <= strength.score ? `is-active is-${strength.tone}` : ''}
            key={bar}
          />
        ))}
      </div>
      <p>Use at least 8 characters with uppercase, lowercase, numbers, and symbols.</p>
    </div>
  )
}
