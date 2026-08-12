import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Plus, Upload, X } from 'lucide-react'

const departments = ['Revenue', 'Growth', 'Engineering', 'People', 'Finance', 'Operations', 'Customer Success']
const managers = ['Jonathan Reed', 'Elena Ortiz', 'Marcus Cole', 'Priya Nair']

const emptyForm = {
  department: '', documentName: '', email: '', emergencyContact: '', employeeId: '', employeeName: '',
  employmentType: 'Full-time', joiningDate: '', manager: '', officeLocation: '', phone: '', role: '',
  salary: '', salaryGrade: '',
}

const steps = [
  { key: 'personal', label: 'Personal Information' },
  { key: 'employment', label: 'Employment Details' },
  { key: 'documents', label: 'Documents Upload' },
  { key: 'preview', label: 'Preview' },
]

export default function AddEmployeeModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm)
  const [stepIndex, setStepIndex] = useState(0)

  const currentStep = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1

  const updateField = (name, value) => setForm((current) => ({ ...current, [name]: value }))

  const resetAndClose = () => {
    setForm(emptyForm)
    setStepIndex(0)
    onClose()
  }

  const goNext = () => setStepIndex((current) => Math.min(steps.length - 1, current + 1))
  const goBack = () => setStepIndex((current) => Math.max(0, current - 1))

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!isLastStep) {
      goNext()
      return
    }
    onSubmit(form)
    resetAndClose()
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          aria-modal="true"
          className="dt-employees-modal-backdrop"
          initial={{ opacity: 0 }}
          onClick={resetAndClose}
          role="dialog"
          transition={{ duration: 0.2 }}
        >
          <motion.section
            className="dt-employees-modal"
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
                  <p>WORKFORCE DIRECTORY</p>
                  <h2>Add employee</h2>
                </div>
              </div>
              <button aria-label="Close add employee form" onClick={resetAndClose} type="button"><X size={18} strokeWidth={2} aria-hidden="true" /></button>
            </header>

            <ol className="dt-employees-wizard-steps">
              {steps.map((step, index) => (
                <li className={index === stepIndex ? 'is-current' : index < stepIndex ? 'is-done' : undefined} key={step.key}>
                  <span>{index < stepIndex ? <Check size={11} strokeWidth={2.5} aria-hidden="true" /> : index + 1}</span>
                  {step.label}
                </li>
              ))}
            </ol>

            <form onSubmit={handleSubmit}>
              {currentStep.key === 'personal' ? (
                <div className="dt-employees-modal-grid">
                  <label><span>Employee name</span><input autoComplete="name" onChange={(event) => updateField('employeeName', event.target.value)} placeholder="Enter full name" required value={form.employeeName} /></label>
                  <label><span>Employee ID</span><input onChange={(event) => updateField('employeeId', event.target.value)} placeholder="e.g. EM-1186" required value={form.employeeId} /></label>
                  <label><span>Work email</span><input autoComplete="email" onChange={(event) => updateField('email', event.target.value)} placeholder="name@company.com" required type="email" value={form.email} /></label>
                  <label><span>Phone</span><input autoComplete="tel" onChange={(event) => updateField('phone', event.target.value)} placeholder="+91 00000 00000" type="tel" value={form.phone} /></label>
                  <label><span>Emergency contact</span><input onChange={(event) => updateField('emergencyContact', event.target.value)} placeholder="Name and phone number" value={form.emergencyContact} /></label>
                </div>
              ) : null}

              {currentStep.key === 'employment' ? (
                <div className="dt-employees-modal-grid">
                  <label><span>Department</span><select onChange={(event) => updateField('department', event.target.value)} required value={form.department}><option disabled value="">Choose department</option>{departments.map((department) => <option key={department}>{department}</option>)}</select></label>
                  <label><span>Designation</span><input onChange={(event) => updateField('role', event.target.value)} placeholder="e.g. Product Designer" required value={form.role} /></label>
                  <label><span>Manager</span><select onChange={(event) => updateField('manager', event.target.value)} value={form.manager}><option disabled value="">Choose manager</option>{managers.map((manager) => <option key={manager}>{manager}</option>)}</select></label>
                  <label><span>Employment type</span><select onChange={(event) => updateField('employmentType', event.target.value)} value={form.employmentType}><option>Full-time</option><option>Contract</option><option>Part-time</option></select></label>
                  <label><span>Joining date</span><input onChange={(event) => updateField('joiningDate', event.target.value)} required type="date" value={form.joiningDate} /></label>
                  <label><span>Salary grade</span><select onChange={(event) => updateField('salaryGrade', event.target.value)} value={form.salaryGrade}><option disabled value="">Select grade</option><option>G3</option><option>G4</option><option>G5</option><option>G6</option><option>G7</option></select></label>
                  <label><span>Salary (monthly)</span><input onChange={(event) => updateField('salary', event.target.value)} placeholder="e.g. 145000" type="number" value={form.salary} /></label>
                  <label><span>Office location</span><select onChange={(event) => updateField('officeLocation', event.target.value)} value={form.officeLocation}><option disabled value="">Choose location</option><option>Bengaluru HQ</option><option>Hyderabad Office</option><option>Remote</option></select></label>
                </div>
              ) : null}

              {currentStep.key === 'documents' ? (
                <label className="dt-employees-upload" htmlFor="employee-documents">
                  <span><Upload size={16} strokeWidth={1.9} aria-hidden="true" /></span>
                  <div><strong>Upload documents</strong><small>Offer letter, identity proof or supporting files</small></div>
                  <em>Browse files</em>
                  <input id="employee-documents" multiple onChange={(event) => updateField('documentName', event.target.files?.[0]?.name ?? '')} type="file" />
                </label>
              ) : null}
              {currentStep.key === 'documents' && form.documentName ? <p className="dt-employees-upload-confirm">Selected: {form.documentName}</p> : null}

              {currentStep.key === 'preview' ? (
                <div className="dt-employees-preview-grid">
                  <article><p>Name</p><strong>{form.employeeName || '—'}</strong></article>
                  <article><p>Employee ID</p><strong>{form.employeeId || '—'}</strong></article>
                  <article><p>Email</p><strong>{form.email || '—'}</strong></article>
                  <article><p>Phone</p><strong>{form.phone || '—'}</strong></article>
                  <article><p>Department</p><strong>{form.department || '—'}</strong></article>
                  <article><p>Designation</p><strong>{form.role || '—'}</strong></article>
                  <article><p>Manager</p><strong>{form.manager || '—'}</strong></article>
                  <article><p>Employment type</p><strong>{form.employmentType}</strong></article>
                  <article><p>Joining date</p><strong>{form.joiningDate || '—'}</strong></article>
                  <article><p>Location</p><strong>{form.officeLocation || '—'}</strong></article>
                  <article><p>Salary grade</p><strong>{form.salaryGrade || '—'}</strong></article>
                  <article><p>Emergency contact</p><strong>{form.emergencyContact || '—'}</strong></article>
                  <article><p>Documents</p><strong>{form.documentName || 'None uploaded'}</strong></article>
                </div>
              ) : null}

              <footer>
                {stepIndex > 0 ? (
                  <button className="dt-employees-modal-cancel" onClick={goBack} type="button"><ArrowLeft size={14} strokeWidth={2} aria-hidden="true" /> Back</button>
                ) : (
                  <button className="dt-employees-modal-cancel" onClick={resetAndClose} type="button">Cancel</button>
                )}
                <button className="dt-employees-modal-submit" type="submit">
                  {isLastStep ? (<><Plus size={15} strokeWidth={2.1} aria-hidden="true" /> Save employee</>) : (<>Next <ArrowRight size={15} strokeWidth={2.1} aria-hidden="true" /></>)}
                </button>
              </footer>
            </form>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
