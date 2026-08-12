function DigitechMark() {
  return (
    <svg className="dt2-brand-mark" viewBox="0 0 54 54" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="dt2-brand-gold" x1="7" y1="5" x2="47" y2="49" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8E5A4" />
          <stop offset="0.42" stopColor="#D8B25E" />
          <stop offset="0.74" stopColor="#C8972F" />
          <stop offset="1" stopColor="#8E6116" />
        </linearGradient>
      </defs>
      <path d="M6 6h20.2C38.3 6 48 15.3 48 27S38.3 48 26.2 48H6V6Zm16.8 10.1H16v21.8h6.8c8.7 0 14.3-4.2 14.3-10.9s-5.6-10.9-14.3-10.9Z" fill="url(#dt2-brand-gold)" />
      <path d="m18.4 17.2 10.5 9.8-10.5 9.8" stroke="#FFFDF9" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.4 7.6 22 18.8" stroke="rgba(255,255,255,.64)" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

export default function Navbar() {
  return (
    <header className="dt2-navbar">
      <div className="dt2-navbar-inner">
        <a className="dt2-brand" href="/login" aria-label="DIGITECH home">
          <DigitechMark />
          <span>DIGITECH</span>
        </a>

        <a className="dt2-platform-link" href="#platform">Platform</a>

        <div className="dt2-navbar-actions">
          <a className="dt2-login-link" href="/login">Log in</a>
          <a className="dt2-contact-link" href="mailto:hello@digitech.ai">Contact Us</a>
        </div>
      </div>
    </header>
  )
}
