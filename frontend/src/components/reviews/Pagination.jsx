import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, total, pageSize, onPageChange }) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 5)

  return (
    <div className="dt-reviews-pagination">
      <p>
        Showing <strong>{from}-{to}</strong> of <strong>{total}</strong> reviews
      </p>
      <div className="dt-reviews-pagination-controls">
        <button
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          type="button"
        >
          <ChevronLeft size={14} strokeWidth={2} aria-hidden="true" />
        </button>
        {pages.map((number) => (
          <button
            className={number === page ? 'is-active' : ''}
            key={number}
            onClick={() => onPageChange(number)}
            type="button"
          >
            {number}
          </button>
        ))}
        <button
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          type="button"
        >
          <ChevronRight size={14} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
