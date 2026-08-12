import { useState } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import TopNavigation from '../components/dashboard/TopNavigation'
import '../components/dashboard/dashboard.css'

function DashboardBackground() {
  return <><div className="dt-dashboard-background" aria-hidden="true" /><svg className="dt-dashboard-waves" viewBox="0 0 1800 350" preserveAspectRatio="none" fill="none" aria-hidden="true"><defs><linearGradient id="dt-dashboard-wave-gold" x1="0" y1="0" x2="1800" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#F2D588" stopOpacity="0" /><stop offset="0.2" stopColor="#D8B25E" stopOpacity="0.54" /><stop offset="0.49" stopColor="#FFFDF9" stopOpacity="0.92" /><stop offset="0.76" stopColor="#C8972F" stopOpacity="0.42" /><stop offset="1" stopColor="#F2D588" stopOpacity="0" /></linearGradient><linearGradient id="dt-dashboard-wave-ivory" x1="0" y1="0" x2="1800" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#FFFDF9" stopOpacity="0" /><stop offset="0.3" stopColor="#FFFDF9" stopOpacity="0.78" /><stop offset="0.68" stopColor="#D8B25E" stopOpacity="0.5" /><stop offset="1" stopColor="#FFFDF9" stopOpacity="0" /></linearGradient></defs><path d="M-86 221c157-108 318 70 503 8 177-60 250-7 378 20 163 35 275-160 451-93 159 60 294 63 621-114" stroke="url(#dt-dashboard-wave-gold)" /><path d="M-65 286c139-117 256 44 437-8 139-40 234-123 394-55 159 68 270 40 397-72 143-125 299 64 635-140" stroke="url(#dt-dashboard-wave-ivory)" /><path d="M-22 341c142-156 267 11 415-50 125-52 204 4 323 15 157 16 280-147 442-28 146 108 260-35 405-26 151 8 233 62 424-58" stroke="url(#dt-dashboard-wave-gold)" /></svg></>
}

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return <div className="dt-dashboard"><DashboardBackground /><div className="dt-dashboard-shell"><TopNavigation onMenuToggle={() => setSidebarOpen((open) => !open)} /><div className="dt-dashboard-body"><Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /><main className="dt-dashboard-main">{children}</main></div></div></div>
}
