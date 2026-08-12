import { lazy, Suspense } from 'react'
import { BarChart3, Bot, ChevronRight, ShieldCheck, TrendingUp } from 'lucide-react'
import HeroButtons from './HeroButtons'
const AnimatedGlobe = lazy(() => import('./AnimatedGlobe'))

const platformFeatures = [
  {
    icon: BarChart3,
    title: 'Automate Your Business',
    description: 'Streamline operations and save time with intelligent automation.',
    tone: 'gold',
  },
  {
    icon: Bot,
    title: 'AI Agents 24/7',
    description: 'Deploy AI agents that work 24/7 to handle tasks and engage customers.',
    tone: 'blue',
  },
  {
    icon: TrendingUp,
    title: 'Smart Insights',
    description: 'Turn data into actionable insights and grow your business faster.',
    tone: 'violet',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security and 99.9% platform reliability.',
    tone: 'green',
  },
]

function GoldFlourish() {
  return (
    <svg viewBox="0 0 360 54" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="dt2-flourish-gold" x1="12" y1="10" x2="348" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A66D12" />
          <stop offset="0.28" stopColor="#D8B25E" />
          <stop offset="0.5" stopColor="#F2D588" />
          <stop offset="0.72" stopColor="#D8B25E" />
          <stop offset="1" stopColor="#A66D12" />
        </linearGradient>
      </defs>
      <path d="M10 34c29 0 42-17 68-17 22 0 30 12 48 12 17 0 24-11 37-11" stroke="url(#dt2-flourish-gold)" strokeWidth="1.45" strokeLinecap="round" />
      <path d="M350 34c-29 0-42-17-68-17-22 0-30 12-48 12-17 0-24-11-37-11" stroke="url(#dt2-flourish-gold)" strokeWidth="1.45" strokeLinecap="round" />
      <path d="M163 32c7-2 12-8 17-18 5 10 10 16 17 18" stroke="url(#dt2-flourish-gold)" strokeWidth="1.45" strokeLinecap="round" />
      <path d="M180 8c-3.8 5.8-7.4 9-12.1 11.3 5.1.2 9.3 3.1 12.1 7.5 2.8-4.4 7-7.3 12.1-7.5C187.4 17 183.8 13.8 180 8Z" fill="url(#dt2-flourish-gold)" />
      <circle cx="142" cy="30.5" r="2.25" fill="#D8B25E" />
      <circle cx="218" cy="30.5" r="2.25" fill="#D8B25E" />
      <circle cx="180" cy="36" r="2.7" fill="#F2D588" />
    </svg>
  )
}

function PlatformFeature({ feature }) {
  const Icon = feature.icon

  return (
    <article className="dt2-feature-item">
      <span className={`dt2-feature-icon dt2-feature-icon--${feature.tone}`} aria-hidden="true">
        <Icon size={27} strokeWidth={1.8} />
      </span>
      <div className="dt2-feature-copy">
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </div>
      <ChevronRight className="dt2-feature-arrow" size={20} strokeWidth={1.5} aria-hidden="true" />
    </article>
  )
}

export default function Hero() {
  return (
    <section className="dt2-hero" aria-labelledby="digitech-title">
      <div className="dt2-hero-copy">
        <div className="dt2-hero-ornament"><GoldFlourish /></div>
        <p className="dt2-eyebrow">An eduleem enterprise AI platform</p>

        <h1 id="digitech-title">
          <span className="dt2-title-gold">D</span><span className="dt2-title-ivory">IGITECH</span>
        </h1>

        <p className="dt2-hero-subtitle">
          Built to automate your business remotely<br />
          powered by eduleem AI
        </p>

        <p className="dt2-impact-line">
          <span className="dt2-impact-ornament" aria-hidden="true" />
          <span>Delivering business AI impact</span>
        </p>

        <HeroButtons />
      </div>

      <article id="platform" className="dt2-intelligence-card" aria-labelledby="intelligence-title">
        <div className="dt2-card-light" aria-hidden="true" />
        <section className="dt2-platform-features" aria-label="DIGITECH capabilities">
          {platformFeatures.map((feature) => <PlatformFeature feature={feature} key={feature.title} />)}
        </section>
        <div className="dt2-card-divider" aria-hidden="true" />
        <section className="dt2-card-showcase">
          <Suspense fallback={null}><AnimatedGlobe /></Suspense>
          <div className="dt2-card-content">
            <h2 id="intelligence-title">Intelligent automation.<br /><em>Real business impact.</em></h2>
            <p>Everything you need to run, automate and scale your business with AI.</p>
          </div>
        </section>
      </article>
    </section>
  )
}
