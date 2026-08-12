import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUp, ArrowUpDown, MessageCircle } from 'lucide-react'
import RatingBadge from './RatingBadge'
import ReviewActionMenu from './ReviewActionMenu'
import Pagination from './Pagination'
import BulkActions from './BulkActions'

export const reviewRecords = [
  { id: 'RV-1042', name: 'John Smith', initials: 'JS', tone: 'gold', company: 'Pizza Palace', email: 'john.smith@mail.com', phone: '+1 415 552 0113', source: 'Google', rating: 5, review: 'Amazing food, excellent customer service, highly recommended. Will absolutely be back with the whole family next weekend.', date: '20 Jul 2026', sentiment: 'positive', status: 'Resolved', agent: 'Meera K.' },
  { id: 'RV-1041', name: 'Sarah Johnson', initials: 'SJ', tone: 'blue', company: 'Coffee Hub', email: 'sarah.j@mail.com', phone: '+1 212 664 8890', source: 'Yelp', rating: 4, review: 'Loved the ambience and coffee. Staff were friendly, though it took a little while to get seated on a Saturday.', date: '19 Jul 2026', sentiment: 'positive', status: 'In Progress', agent: 'Rahul D.' },
  { id: 'RV-1040', name: 'Michael Brown', initials: 'MB', tone: 'purple', company: 'Royal Restaurant', email: 'mbrown@mail.com', phone: '+1 646 220 7712', source: 'Google', rating: 5, review: 'One of the best restaurants in the city. Fantastic experience from start to finish, the tasting menu is unbeatable.', date: '19 Jul 2026', sentiment: 'positive', status: 'Resolved', agent: 'Meera K.' },
  { id: 'RV-1039', name: 'Emma Wilson', initials: 'EW', tone: 'green', company: 'Burger House', email: 'emma.w@mail.com', phone: '+1 312 774 9021', source: 'Facebook', rating: 2, review: 'Order arrived cold and the delivery took almost an hour longer than promised. Disappointed with this visit.', date: '18 Jul 2026', sentiment: 'negative', status: 'New', agent: null },
  { id: 'RV-1038', name: 'David Lee', initials: 'DL', tone: 'blue', company: 'Coffee Hub', email: 'david.lee@mail.com', phone: '+1 646 555 0199', source: 'Trustpilot', rating: 3, review: 'Decent coffee but overpriced compared to nearby cafes. The seating area could use a refresh.', date: '18 Jul 2026', sentiment: 'neutral', status: 'In Progress', agent: 'Priya S.' },
  { id: 'RV-1037', name: 'Olivia Davis', initials: 'OD', tone: 'gold', company: 'Pizza Palace', email: 'olivia.d@mail.com', phone: '+1 917 220 5541', source: 'Google', rating: 1, review: 'Terrible experience, my order was completely wrong and no one answered the phone when I called to fix it.', date: '17 Jul 2026', sentiment: 'negative', status: 'Escalated', agent: 'Rahul D.' },
  { id: 'RV-1036', name: 'James Miller', initials: 'JM', tone: 'purple', company: 'Royal Restaurant', email: 'james.m@mail.com', phone: '+1 213 664 2201', source: 'App Store', rating: 5, review: 'Impeccable service and the ambience is stunning. Perfect for an anniversary dinner, highly recommend the tasting menu.', date: '17 Jul 2026', sentiment: 'positive', status: 'Resolved', agent: 'Meera K.' },
  { id: 'RV-1035', name: 'Sophia Garcia', initials: 'SG', tone: 'green', company: 'Burger House', email: 'sophia.g@mail.com', phone: '+1 646 991 3320', source: 'Yelp', rating: 4, review: 'Great burgers and fast delivery this time around. Will order again, just wish there were more vegetarian options.', date: '16 Jul 2026', sentiment: 'positive', status: 'New', agent: null },
  { id: 'RV-1034', name: 'William Martinez', initials: 'WM', tone: 'blue', company: 'Coffee Hub', email: 'will.m@mail.com', phone: '+1 415 220 7781', source: 'Google', rating: 2, review: 'Staff seemed overwhelmed and my order was missing an item. Coffee itself was fine but the experience felt rushed.', date: '15 Jul 2026', sentiment: 'negative', status: 'In Progress', agent: 'Priya S.' },
  { id: 'RV-1033', name: 'Isabella Anderson', initials: 'IA', tone: 'gold', company: 'Pizza Palace', email: 'isabella.a@mail.com', phone: '+1 312 774 5590', source: 'Facebook', rating: 5, review: 'Best pizza in town, hands down. Crust is always perfect and delivery is reliably quick.', date: '15 Jul 2026', sentiment: 'positive', status: 'Resolved', agent: 'Meera K.' },
  { id: 'RV-1032', name: 'Ethan Thompson', initials: 'ET', tone: 'purple', company: 'Royal Restaurant', email: 'ethan.t@mail.com', phone: '+1 646 220 9012', source: 'Trustpilot', rating: 3, review: 'Food was good but service was slow during peak hours. Would still come back on a quieter night.', date: '14 Jul 2026', sentiment: 'neutral', status: 'New', agent: null },
  { id: 'RV-1031', name: 'Mia Rodriguez', initials: 'MR', tone: 'green', company: 'Burger House', email: 'mia.r@mail.com', phone: '+1 213 664 8820', source: 'Google', rating: 5, review: 'Consistently great every single time. The staff remembered my order and that little touch means a lot.', date: '13 Jul 2026', sentiment: 'positive', status: 'Resolved', agent: 'Rahul D.' },
  { id: 'RV-1030', name: 'Alexander White', initials: 'AW', tone: 'blue', company: 'Coffee Hub', email: 'alex.white@mail.com', phone: '+1 917 552 3312', source: 'Yelp', rating: 1, review: 'Waited 40 minutes and the order was still wrong. Asked for a refund and staff were dismissive about it.', date: '12 Jul 2026', sentiment: 'negative', status: 'Escalated', agent: 'Priya S.' },
  { id: 'RV-1029', name: 'Charlotte Harris', initials: 'CH', tone: 'gold', company: 'Pizza Palace', email: 'charlotte.h@mail.com', phone: '+1 646 991 0087', source: 'App Store', rating: 4, review: 'Really solid delivery experience and the app made reordering my favorites effortless.', date: '11 Jul 2026', sentiment: 'positive', status: 'In Progress', agent: 'Meera K.' },
]

const columns = [
  { key: 'name', label: 'Customer' },
  { key: 'company', label: 'Company' },
  { key: 'source', label: 'Source' },
  { key: 'rating', label: 'Rating' },
  { key: 'review', label: 'Review' },
  { key: 'date', label: 'Date' },
  { key: 'sentiment', label: 'AI Sentiment' },
  { key: 'status', label: 'Status' },
  { key: 'agent', label: 'Agent' },
]

function SortableHeader({ column, sort, onSort }) {
  const isActive = sort.key === column.key
  const Icon = isActive ? (sort.direction === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown

  return (
    <th key={column.key}>
      <button onClick={() => onSort(column.key)} type="button">
        {column.label}
        <Icon size={11} strokeWidth={2} aria-hidden="true" />
      </button>
    </th>
  )
}

const PAGE_SIZE = 6

export default function ReviewsTable({ filters, onView, onReply, onAssign, onResolve, onDelete }) {
  const [selected, setSelected] = useState([])
  const [sort, setSort] = useState({ key: 'date', direction: 'desc' })
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const search = filters.search.trim().toLowerCase()
    const rating = filters.rating ? Number(filters.rating[0]) : null
    const source = filters.source
    const status = filters.status

    return reviewRecords.filter((review) => {
      if (search && ![review.name, review.company, review.review].some((value) => value.toLowerCase().includes(search))) return false
      if (rating && review.rating !== rating) return false
      if (source && review.source !== source) return false
      if (status && review.status !== status) return false
      return true
    })
  }, [filters])

  const sorted = useMemo(() => {
    const list = [...filtered]
    list.sort((a, b) => {
      const direction = sort.direction === 'asc' ? 1 : -1
      if (a[sort.key] < b[sort.key]) return -1 * direction
      if (a[sort.key] > b[sort.key]) return 1 * direction
      return 0
    })
    return list
  }, [filtered, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSort = (key) => {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const toggleRow = (id) => {
    setSelected((current) => (current.includes(id) ? current.filter((rowId) => rowId !== id) : [...current, id]))
  }

  const toggleAll = () => {
    setSelected((current) => (current.length === visible.length ? [] : visible.map((review) => review.id)))
  }

  return (
    <motion.section
      className="dt-reviews-customers"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="dt-reviews-section-heading">
        <div>
          <p>CUSTOMER REVIEWS</p>
          <h2>Every review, sentiment-scored and ready to action.</h2>
        </div>
        <button type="button"><MessageCircle size={13} strokeWidth={1.9} aria-hidden="true" /> {sorted.length} results</button>
      </header>

      <BulkActions count={selected.length} onClear={() => setSelected([])} />

      <div className="dt-reviews-table-scroll">
        <table>
          <thead>
            <tr>
              <th className="dt-reviews-checkbox-cell">
                <input
                  aria-label="Select all reviews on this page"
                  checked={visible.length > 0 && selected.length === visible.length}
                  className="dt-reviews-checkbox"
                  onChange={toggleAll}
                  type="checkbox"
                />
              </th>
              {columns.map((column) => <SortableHeader column={column} key={column.key} onSort={handleSort} sort={sort} />)}
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {visible.map((review) => (
              <tr
    key={review.id}
    onClick={() => onView(review)}
    style={{ cursor: "pointer" }}
>
                <td
    className="dt-reviews-checkbox-cell"
    onClick={(e) => e.stopPropagation()}
>
                  <input
                    aria-label={'Select review from ' + review.name}
                    checked={selected.includes(review.id)}
                    className="dt-reviews-checkbox"
                    onChange={() => toggleRow(review.id)}
                    type="checkbox"
                  />
                </td>
                <td data-label="Customer">
                  <span className={'dt-reviews-customer-avatar is-' + review.tone}>{review.initials}</span>
                  <strong>{review.name}</strong>
                </td>
                <td data-label="Company"><span className="dt-reviews-company-name">{review.company}</span></td>
                <td data-label="Source">
                  <span className="dt-reviews-source-badge"><i>{review.source.slice(0, 1)}</i>{review.source}</span>
                </td>
                <td data-label="Rating"><RatingBadge rating={review.rating} /></td>
                <td data-label="Review"><p className="dt-reviews-review-text">{review.review}</p></td>
                <td className="dt-reviews-last-activity" data-label="Date">{review.date}</td>
                <td data-label="AI Sentiment">
                  <span className={'dt-reviews-sentiment is-' + review.sentiment}><i />{review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)}</span>
                </td>
                <td data-label="Status">
                  <span className={'dt-reviews-status is-' + review.status.toLowerCase().replace(' ', '-').replace('in-progress', 'progress')}><i />{review.status}</span>
                </td>
                <td data-label="Agent">
                  {review.agent ? (
                    <span className="dt-reviews-agent"><span className="dt-reviews-agent-avatar">{review.agent.slice(0, 1)}</span>{review.agent}</span>
                  ) : (
                    <span className="dt-reviews-agent is-unassigned">Unassigned</span>
                  )}
                </td>
                <td
    data-label="Actions"
    onClick={(e) => e.stopPropagation()}
>
                  <ReviewActionMenu
                    onAssign={onAssign}
                    onDelete={onDelete}
                    onReply={onReply}
                    onResolve={onResolve}
                    onView={onView}
                    review={review}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visible.length === 0 ? <p className="dt-reviews-empty-state">No reviews match this search or filter.</p> : null}

      <Pagination
        onPageChange={setPage}
        page={currentPage}
        pageSize={PAGE_SIZE}
        total={sorted.length}
        totalPages={totalPages}
      />
    </motion.section>
  )
}
