import { LoaderCircle } from 'lucide-react'

export default function AuthLoader({ label = 'Please wait' }) {
  return (
    <span className="dt2-auth-loader" role="status" aria-label={label}>
      <LoaderCircle size={18} strokeWidth={2} aria-hidden="true" />
      <span className="dt2-auth-visually-hidden">{label}</span>
    </span>
  )
}
