import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { useState } from 'react'

export default function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  autoComplete = 'current-password',
  disabled = false,
}) {
  const [isVisible, setIsVisible] = useState(false)
  const inputId = id || name

  return (
    <div className={`dt2-auth-field dt2-auth-password-field${value ? ' dt2-auth-field--filled' : ''}${error ? ' dt2-auth-field--error' : ''}`}>
      <LockKeyhole className="dt2-auth-field-icon" size={18} strokeWidth={1.8} aria-hidden="true" />
      <input
        id={inputId}
        name={name}
        type={isVisible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder=" "
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      <label htmlFor={inputId}>{label}</label>
      <button
        className="dt2-auth-password-toggle"
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        disabled={disabled}
      >
        {isVisible ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
      </button>
      {error ? <p id={`${inputId}-error`} className="dt2-auth-field-error" role="alert">{error}</p> : null}
    </div>
  )
}
