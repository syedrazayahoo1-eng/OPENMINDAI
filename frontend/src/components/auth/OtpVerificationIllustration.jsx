import { motion } from 'framer-motion'

export default function OtpVerificationIllustration() {
  return (
    <motion.div
      className="dt2-otp-verification-illustration"
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: [0, -5, 0], scale: 1 }}
      transition={{
        opacity: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        y: { delay: 0.4, duration: 4.8, ease: 'easeInOut', repeat: Infinity },
      }}
      aria-hidden="true"
    >
      <span className="dt2-otp-verification-glow" />
      <span className="dt2-otp-verification-orbit dt2-otp-verification-orbit--one" />
      <span className="dt2-otp-verification-orbit dt2-otp-verification-orbit--two" />
      <svg viewBox="0 0 420 276" fill="none">
        <defs>
          <linearGradient id="dt2-otp-shield-fill" x1="135" y1="55" x2="286" y2="229" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFDF9" stopOpacity="0.96" />
            <stop offset="0.44" stopColor="#F8E5A4" stopOpacity="0.74" />
            <stop offset="1" stopColor="#D8B25E" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="dt2-otp-shield-edge" x1="151" y1="49" x2="274" y2="232" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F2D588" />
            <stop offset="0.48" stopColor="#C8972F" />
            <stop offset="1" stopColor="#8E6116" />
          </linearGradient>
          <linearGradient id="dt2-otp-key-fill" x1="170" y1="111" x2="261" y2="173" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F9E9AF" />
            <stop offset="0.52" stopColor="#D8B25E" />
            <stop offset="1" stopColor="#A66D12" />
          </linearGradient>
          <filter id="dt2-otp-soft-shadow" x="67" y="28" width="286" height="242" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feDropShadow dx="0" dy="13" stdDeviation="11" floodColor="#0B1733" floodOpacity="0.13" />
          </filter>
          <filter id="dt2-otp-small-glow" x="0" y="0" width="420" height="276" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <ellipse cx="210" cy="239" rx="111" ry="15" fill="#0B1733" fillOpacity="0.09" />
        <circle cx="210" cy="137" r="101" stroke="#D8B25E" strokeOpacity="0.26" />
        <circle cx="210" cy="137" r="81" stroke="#F2D588" strokeOpacity="0.32" strokeDasharray="3 9" />
        <circle cx="109" cy="137" r="3.5" fill="#F2D588" filter="url(#dt2-otp-small-glow)" />
        <circle cx="311" cy="137" r="3.5" fill="#F2D588" filter="url(#dt2-otp-small-glow)" />
        <circle cx="210" cy="36" r="3.5" fill="#F2D588" filter="url(#dt2-otp-small-glow)" />
        <circle cx="210" cy="238" r="3.5" fill="#F2D588" filter="url(#dt2-otp-small-glow)" />
        <g filter="url(#dt2-otp-soft-shadow)">
          <path d="M210 49 289 78v57c0 50-31.3 85.6-79 103-47.7-17.4-79-53-79-103V78l79-29Z" fill="url(#dt2-otp-shield-fill)" stroke="url(#dt2-otp-shield-edge)" strokeWidth="2" />
          <path d="M210 63 275 86v48c0 40.7-24.8 70.2-65 86-40.2-15.8-65-45.3-65-86V86l65-23Z" fill="#FFFDF9" fillOpacity="0.4" stroke="#FFFDF9" strokeOpacity="0.76" />
          <path d="M198 103a25 25 0 1 0 18.7 42.2l38.5 38.5 12.3-12.3-8.5-8.5 8.3-8.3-12.3-12.3-8.3 8.3-11.9-11.9A25 25 0 0 0 198 103Zm0 17.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Z" fill="url(#dt2-otp-key-fill)" />
          <path d="m244 151 11.9 11.9m-20.2-3.6 11.9 11.9" stroke="#FFF8DA" strokeWidth="2.2" strokeLinecap="round" />
        </g>
        <g transform="translate(271 50)" filter="url(#dt2-otp-soft-shadow)">
          <circle cx="33" cy="33" r="31" fill="#FFFDF9" stroke="#F2D588" strokeWidth="1.5" />
          <circle cx="33" cy="33" r="23" fill="#F8E5A4" fillOpacity="0.55" />
          <path d="m21 33 8 8 16-18" stroke="#A66D12" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <path d="M104 83 121 73m180 130 17-10M117 199l18-9" stroke="#C8972F" strokeOpacity="0.42" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </motion.div>
  )
}
