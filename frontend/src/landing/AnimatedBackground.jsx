export default function AnimatedBackground() {
  return (
    <div className="dt2-background" aria-hidden="true">
      <span className="dt2-background-aura dt2-background-aura--hero" />
      <span className="dt2-background-aura dt2-background-aura--card" />
      <svg className="dt2-background-waves" viewBox="0 0 1600 350" preserveAspectRatio="none" fill="none">
        <defs>
          <linearGradient id="dt2-wave-gold-primary" x1="0" y1="0" x2="1600" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F2D588" stopOpacity="0" />
            <stop offset="0.18" stopColor="#D8B25E" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#FFFDF9" stopOpacity="0.94" />
            <stop offset="0.82" stopColor="#C8972F" stopOpacity="0.48" />
            <stop offset="1" stopColor="#F2D588" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="dt2-wave-gold-secondary" x1="0" y1="0" x2="1600" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F2D588" stopOpacity="0" />
            <stop offset="0.31" stopColor="#FFFDF9" stopOpacity="0.68" />
            <stop offset="0.7" stopColor="#D8B25E" stopOpacity="0.48" />
            <stop offset="1" stopColor="#F2D588" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M-74 238c179-100 296 69 475 1 154-59 209-19 338 14 180 47 302-176 470-94 124 61 247 55 447-92" stroke="url(#dt2-wave-gold-primary)" />
        <path d="M-81 290c142-118 268 36 431-12 144-44 216-120 379-58 159 62 258 39 400-73 145-116 266 62 544-132" stroke="url(#dt2-wave-gold-secondary)" />
        <path d="M-18 344c142-155 245 17 397-53 128-59 193 1 319 14 153 14 287-141 436-32 142 104 264-33 380-30 157 4 211 64 379-54" stroke="url(#dt2-wave-gold-primary)" />
        <path d="M-69 184c123-44 205 60 352 21 156-43 245-130 392-72 123 48 225 24 356-54 140-84 303-12 442-59 81-28 152-94 205-119" stroke="url(#dt2-wave-gold-secondary)" />
        <path d="M-20 317c146-76 229-6 358-44 171-48 224 77 399-14 181-95 263-7 396-27 194-28 229-127 418-76 142 40 250-15 400-108" stroke="url(#dt2-wave-gold-primary)" />
      </svg>
    </div>
  )
}
