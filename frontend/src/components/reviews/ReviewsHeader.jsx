import { motion } from 'framer-motion'
import { RefreshCw, Sparkles, Star } from 'lucide-react'

export default function ReviewsHeader({ activeTab, onRefresh, onTabChange }) {
  return (
    <motion.section
      className="dt-reviews-header"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="dt-reviews-header-glow" aria-hidden="true" />
      <div className="dt-reviews-header-copy">
        <span><Sparkles size={15} strokeWidth={1.9} aria-hidden="true" /> AI-POWERED REPUTATION INTELLIGENCE</span>
        <h1>Reviews & <em>Reputation</em></h1>
        <p>Monitor customer satisfaction and AI-powered reputation insights.</p>
      </div>
      <div className="dt-reviews-header-status">
        <span><Star size={20} strokeWidth={1.85} aria-hidden="true" /></span>
        <div>
          <small>REPUTATION SCORE</small>
          <strong>91.4 / 100</strong>
          <p><i /> Trending up this month</p>
        </div>
      </div>
      <button className="dt-reviews-add-button" onClick={onRefresh} type="button">
        <RefreshCw size={17} strokeWidth={2.1} aria-hidden="true" />
        Refresh
      </button>
      <div className="dt-reviews-module-tabs" role="tablist" aria-label="Google Business sections">
        <button aria-selected={activeTab === 'reviews'} onClick={() => onTabChange('reviews')} role="tab" type="button">Reviews</button>
        <button aria-selected={activeTab === 'posts'} onClick={() => onTabChange('posts')} role="tab" type="button">Posts</button>
      </div>
    </motion.section>
  )
}
