import { motion } from 'framer-motion'

export default function RecoveryIllustration() {
  return (
    <motion.div
      className="dt2-recovery-illustration"
      aria-hidden="true"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4.6, ease: 'easeInOut', repeat: Infinity }}
    >
      <span className="dt2-recovery-illustration-glow" />
      <svg viewBox="0 0 340 330" fill="none">
        <defs>
          <linearGradient id="dt2-recovery-shield-gold" x1="104" y1="54" x2="226" y2="288" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF0B7" />
            <stop offset="0.28" stopColor="#F2D588" />
            <stop offset="0.61" stopColor="#C8972F" />
            <stop offset="1" stopColor="#8E6116" />
          </linearGradient>
          <linearGradient id="dt2-recovery-lock-gold" x1="133" y1="147" x2="197" y2="229" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF9DB" />
            <stop offset="0.5" stopColor="#F2D588" />
            <stop offset="1" stopColor="#B67D1C" />
          </linearGradient>
          <linearGradient id="dt2-recovery-key-gold" x1="206" y1="204" x2="272" y2="259" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF4BE" />
            <stop offset="0.48" stopColor="#D8B25E" />
            <stop offset="1" stopColor="#A66D12" />
          </linearGradient>
          <linearGradient id="dt2-recovery-pedestal" x1="99" y1="266" x2="240" y2="302" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFDF9" />
            <stop offset="0.5" stopColor="#F2EEE8" />
            <stop offset="1" stopColor="#D8B25E" />
          </linearGradient>
          <radialGradient id="dt2-recovery-floor" cx="0" cy="0" r="1" gradientTransform="translate(170 284) rotate(90) scale(42 113)" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C8972F" stopOpacity="0.32" />
            <stop offset="1" stopColor="#C8972F" stopOpacity="0" />
          </radialGradient>
          <filter id="dt2-recovery-blur" x="0" y="0" width="340" height="330" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        <ellipse cx="170" cy="285" rx="115" ry="42" fill="url(#dt2-recovery-floor)" />
        <ellipse cx="170" cy="282" rx="89" ry="20" fill="#0B1733" fillOpacity="0.1" filter="url(#dt2-recovery-blur)" />
        <path d="M89 267c0-13 36-24 81-24s81 11 81 24-36 25-81 25-81-12-81-25Z" fill="url(#dt2-recovery-pedestal)" fillOpacity="0.96" />
        <path d="M103 270c15 9 43 14 67 14s52-5 67-14v17c0 12-30 22-67 22s-67-10-67-22v-17Z" fill="#E8D8B4" fillOpacity="0.72" />
        <ellipse cx="170" cy="267" rx="67" ry="18" fill="#FFFDF9" fillOpacity="0.78" />

        <path d="M170 38 242 64v72c0 55-28 103-72 132-44-29-72-77-72-132V64l72-26Z" fill="url(#dt2-recovery-shield-gold)" />
        <path d="M170 48 232 70v65c0 47-23 89-62 116-39-27-62-69-62-116V70l62-22Z" stroke="rgba(255,255,255,.66)" strokeWidth="2.4" />
        <path d="M170 48v190c39-27 62-69 62-116V70l-62-22Z" fill="#8E6116" fillOpacity="0.16" />
        <path d="M115 77c14-8 31-15 55-21v19c-20 4-38 10-55 19V77Z" fill="#FFF9DB" fillOpacity="0.42" />

        <path d="M140 167v-14c0-17 13-31 30-31s30 14 30 31v14" stroke="url(#dt2-recovery-lock-gold)" strokeWidth="12" strokeLinecap="round" />
        <rect x="127" y="163" width="86" height="69" rx="18" fill="url(#dt2-recovery-lock-gold)" />
        <rect x="133" y="169" width="74" height="57" rx="14" stroke="rgba(255,255,255,.56)" strokeWidth="2" />
        <circle cx="170" cy="195" r="8" fill="#8E6116" />
        <path d="M170 201v11" stroke="#8E6116" strokeWidth="6" strokeLinecap="round" />

        <g transform="rotate(-28 233 220)">
          <circle cx="226" cy="210" r="22" fill="url(#dt2-recovery-key-gold)" />
          <circle cx="226" cy="210" r="9" stroke="#FFF9DB" strokeWidth="4" />
          <path d="M243 222h49v13h-12v12h-13v-12h-12v-13h-12v-12Z" fill="url(#dt2-recovery-key-gold)" />
          <path d="M245 223h44" stroke="rgba(255,255,255,.45)" strokeWidth="2" strokeLinecap="round" />
        </g>

        <circle cx="96" cy="130" r="3" fill="#F2D588" />
        <circle cx="253" cy="111" r="4" fill="#F2D588" />
        <circle cx="277" cy="181" r="2.5" fill="#C8972F" />
      </svg>
    </motion.div>
  )
}
