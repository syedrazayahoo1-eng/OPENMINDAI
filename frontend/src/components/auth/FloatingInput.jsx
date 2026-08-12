export default function FloatingInput({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  icon: Icon,
  autoComplete,
  disabled = false,
  inputMode,
}) {
  const inputId = id || name

  return (
    <div className={`dt2-auth-field${value ? ' dt2-auth-field--filled' : ''}${error ? ' dt2-auth-field--error' : ''}`}>
      {Icon ? <Icon className="dt2-auth-field-icon" size={18} strokeWidth={1.8} aria-hidden="true" /> : null}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder=" "
        autoComplete={autoComplete}
        disabled={disabled}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      <label htmlFor={inputId}>{label}</label>
      {error ? <p id={`${inputId}-error`} className="dt2-auth-field-error" role="alert">{error}</p> : null}
    </div>
  )
}
