import { useRef } from 'react'

export default function OtpInput({ value, onChange, length = 6, disabled = false, error }) {
  const inputs = useRef([])
  const digits = Array.from({ length }, (_, index) => value[index] || '')

  const setDigits = (nextDigits) => onChange(nextDigits.join(''))

  const handleChange = (index, nextValue) => {
    const digit = nextValue.replace(/\D/g, '').slice(-1)
    const nextDigits = [...digits]
    nextDigits[index] = digit
    setDigits(nextDigits)

    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      inputs.current[index - 1]?.focus()
    }

    if (event.key === 'ArrowRight' && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (event) => {
    event.preventDefault()
    const pastedDigits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length).split('')

    if (!pastedDigits.length) return

    const nextDigits = Array.from({ length }, (_, index) => pastedDigits[index] || '')
    setDigits(nextDigits)
    inputs.current[Math.min(pastedDigits.length, length) - 1]?.focus()
  }

  return (
    <div className={`dt2-auth-otp${error ? ' dt2-auth-otp--error' : ''}`}>
      <div className="dt2-auth-otp-inputs" role="group" aria-label="Six digit verification code" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            aria-label={`Verification digit ${index + 1}`}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            disabled={disabled}
            inputMode="numeric"
            key={index}
            maxLength={1}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            ref={(element) => { inputs.current[index] = element }}
            type="text"
            value={digit}
          />
        ))}
      </div>
      {error ? <p className="dt2-auth-otp-error" role="alert">{error}</p> : null}
    </div>
  )
}
