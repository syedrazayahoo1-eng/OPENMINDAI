import { ArrowRight } from 'lucide-react'

export default function HeroButtons() {
  return (
    <div className="dt2-hero-actions">
      <a className="dt2-primary-button" href="/register">
        <span>Sign up</span>
        <ArrowRight size={20} strokeWidth={1.65} aria-hidden="true" />
      </a>
      <a className="dt2-secondary-button" href="mailto:hello@digitech.ai">Contact Us</a>
    </div>
  )
}
