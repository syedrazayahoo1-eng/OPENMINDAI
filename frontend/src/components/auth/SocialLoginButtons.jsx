function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.35 12.21c0-.71-.06-1.2-.2-1.71H12v3.22h5.37c-.11.8-.72 2-2.08 2.81l-.02.11 3.02 2.34.21.02c1.93-1.78 3.04-4.4 3.04-7.79Z" />
      <path fill="#34A853" d="M12 21.75c2.63 0 4.83-.87 6.44-2.37l-3.07-2.47c-.82.57-1.92.97-3.37.97a5.84 5.84 0 0 1-5.51-4.04l-.1.01-3.14 2.43-.04.1A9.73 9.73 0 0 0 12 21.75Z" />
      <path fill="#FBBC05" d="M6.49 13.84A5.97 5.97 0 0 1 6.18 12c0-.64.11-1.25.3-1.84v-.12L3.3 7.58l-.1.05A9.75 9.75 0 0 0 2.25 12c0 1.58.38 3.07.95 4.37l3.29-2.53Z" />
      <path fill="#EA4335" d="M12 6.12c1.82 0 3.05.79 3.75 1.45l2.74-2.67C16.82 3.35 14.63 2.25 12 2.25a9.74 9.74 0 0 0-8.8 5.38l3.28 2.53A5.86 5.86 0 0 1 12 6.12Z" />
    </svg>
  )
}

function MicrosoftMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#F35325" d="M2.5 2.5h9v9h-9z" />
      <path fill="#81BC06" d="M12.5 2.5h9v9h-9z" />
      <path fill="#05A6F0" d="M2.5 12.5h9v9h-9z" />
      <path fill="#FFBA08" d="M12.5 12.5h9v9h-9z" />
    </svg>
  )
}

export default function SocialLoginButtons({ onSelect, disabled = false }) {
  return (
    <div className="dt2-auth-socials">
      <div className="dt2-auth-divider"><span>or continue with</span></div>
      <div className="dt2-auth-social-grid">
        <button type="button" onClick={() => onSelect('google')} disabled={disabled}>
          <GoogleMark />
          Google
        </button>
        <button type="button" onClick={() => onSelect('microsoft')} disabled={disabled}>
          <MicrosoftMark />
          Microsoft
        </button>
      </div>
    </div>
  )
}
