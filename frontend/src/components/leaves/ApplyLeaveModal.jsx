import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Upload, X } from 'lucide-react'

const employees = ['Aarav Mehta', 'Maya Rodriguez', 'Oliver Chen', 'Priya Nair', 'Sofia Turner', 'Ethan Williams', 'Anika Shah', 'Liam Brooks']
const leaveTypes = ['Annual Leave', 'Sick Leave', 'Casual Leave', 'Maternity', 'Paternity', 'Work From Home']

export default function ApplyLeaveModal({ isOpen, onClose }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          aria-modal="true"
          className="dt-leaves-modal-backdrop"
          initial={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          transition={{ duration: 0.2 }}
        >
          <motion.section
            className="dt-leaves-modal"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            onClick={(event) => event.stopPropagation()}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <header>
              <div>
                <span><Plus size={18} strokeWidth={2.1} aria-hidden="true" /></span>
                <div>
                  <p>TIME AND LEAVE</p>
                  <h2>Apply for leave</h2>
                </div>
              </div>
              <button aria-label="Close apply leave form" onClick={onClose} type="button"><X size={18} strokeWidth={2} aria-hidden="true" /></button>
            </header>
            <form onSubmit={handleSubmit}>
              <div className="dt-leaves-modal-grid">
                <label><span>Employee</span><select defaultValue="" name="employee" required><option disabled value="">Choose employee</option>{employees.map((employee) => <option key={employee}>{employee}</option>)}</select></label>
                <label><span>Leave type</span><select defaultValue="" name="leaveType" required><option disabled value="">Choose leave type</option>{leaveTypes.map((leaveType) => <option key={leaveType}>{leaveType}</option>)}</select></label>
                <label><span>Start date</span><input name="startDate" required type="date" /></label>
                <label><span>End date</span><input name="endDate" required type="date" /></label>
                <label><span>Number of days</span><input min="0.5" name="numberOfDays" placeholder="e.g. 2" required step="0.5" type="number" /></label>
                <label><span>Emergency contact</span><input name="emergencyContact" placeholder="Name and phone number" required /></label>
              </div>
              <label className="dt-leaves-modal-notes"><span>Reason</span><textarea name="reason" placeholder="Describe the reason for this leave request" required /></label>
              <label className="dt-leaves-upload" htmlFor="leave-attachment">
                <span><Upload size={16} strokeWidth={1.9} aria-hidden="true" /></span>
                <div><strong>Attachment upload</strong><small>Add a medical certificate or supporting document if needed</small></div>
                <em>Browse files</em>
                <input id="leave-attachment" name="attachment" type="file" />
              </label>
              <footer>
                <button className="dt-leaves-modal-cancel" onClick={onClose} type="button">Cancel</button>
                <button className="dt-leaves-modal-submit" type="submit"><Plus size={15} strokeWidth={2.1} aria-hidden="true" /> Submit request</button>
              </footer>
            </form>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
