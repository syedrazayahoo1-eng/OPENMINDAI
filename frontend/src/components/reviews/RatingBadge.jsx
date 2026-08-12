import { Star } from 'lucide-react'

export default function RatingBadge({ rating = 0, size = 13 }) {
  const rounded = Math.round(rating)

  return (
    <span className="dt-reviews-rating" aria-label={rating + ' out of 5 stars'}>
      {[1, 2, 3, 4, 5].map((position) => (
        <Star
          key={position}
          size={size}
          strokeWidth={1.8}
          fill={position <= rounded ? 'currentColor' : 'none'}
          aria-hidden="true"
        />
      ))}
      <span>{rating.toFixed(1)}</span>
    </span>
  )
}
