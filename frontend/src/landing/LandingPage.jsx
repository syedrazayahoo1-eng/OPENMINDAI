import Navbar from './Navbar'
import Hero from './Hero'
import AnimatedBackground from './AnimatedBackground'
import './styles.css'

export default function LandingPage() {
  return (
    <main className="dt2-landing">
      <AnimatedBackground />
      <Navbar />
      <Hero />
    </main>
  )
}
