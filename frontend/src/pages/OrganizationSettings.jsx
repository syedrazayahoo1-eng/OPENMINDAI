import { CheckCircle2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import { createOrganization, deleteOrganization, getOrganization, updateOrganization } from '../services/organizationService'

const blank = { name: '', displayName: '', website: '', email: '', phone: '', address: '', city: '', state: '', country: '', timezone: 'UTC', currency: 'USD', language: 'English' }

const getErrorMessage = (requestError, fallback) => {
  const response = requestError.response?.data
  if (typeof response === 'string' && response.trim()) return response
  if (typeof response?.message === 'string' && response.message.trim()) return response.message
  const validationMessage = Object.values(response?.errors ?? {}).flat().find(Boolean)
  return validationMessage || fallback
}

export default function OrganizationSettings() {
  const navigate = useNavigate()
  const [value, setValue] = useState(blank)
  const [id, setId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedModalOpen, setSavedModalOpen] = useState(false)

  useEffect(() => {
    getOrganization()
      .then((data) => {
        setValue({ ...blank, ...data })
        setId(data.id ?? 1)
      })
      .catch((requestError) => {
        if (requestError.response?.status !== 404) setError('Organization settings could not be loaded.')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!savedModalOpen) return undefined
    const dismissTimer = window.setTimeout(() => setSavedModalOpen(false), 5000)
    return () => window.clearTimeout(dismissTimer)
  }, [savedModalOpen])

  const showSavedToast = () => {
    setSavedModalOpen(true)
  }

  const save = async (event) => {
    event.preventDefault()
    if (!value.name.trim() || !value.displayName.trim()) {
      const message = 'Organization name and display name are required.'
      setError(message)
      toast.error(message, { duration: 5000 })
      return
    }

    setSaving(true)
    setError('')
    try {
      if (id) await updateOrganization(id, value)
      else await createOrganization(value)
      const persisted = await getOrganization()
      setValue({ ...blank, ...persisted })
      setId(persisted.id ?? id ?? 1)
      showSavedToast()
    } catch (requestError) {
      const message = getErrorMessage(requestError, 'Organization settings could not be saved.')
      setError(message)
      toast.error(message, { duration: 5000 })
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!id || !window.confirm('Delete this organization?')) return
    setSaving(true)
    try {
      await deleteOrganization(id)
      setId(null)
      setValue(blank)
    } catch (requestError) {
      const message = getErrorMessage(requestError, 'Organization could not be deleted.')
      setError(message)
      toast.error(message, { duration: 5000 })
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <Toaster />
      {savedModalOpen ? (
        <div className="dt-organization-saved-overlay" onMouseDown={() => setSavedModalOpen(false)} role="presentation">
          <section aria-describedby="organization-saved-message" aria-labelledby="organization-saved-title" aria-modal="true" className="dt-organization-saved-toast" onMouseDown={(event) => event.stopPropagation()} role="dialog">
            <CheckCircle2 aria-hidden="true" className="dt-organization-saved-toast-icon" size={28} />
            <div>
              <strong id="organization-saved-title">Organization Saved Successfully</strong>
              <p id="organization-saved-message">Thank you for choosing DIGITECH. Your organization details have been securely saved and are now available throughout your workspace.</p>
              <p>We appreciate your trust in our platform. If you ever need guidance or support, we&apos;re just a message away.</p>
              <small>Powered by Eduleem 🚀</small>
            </div>
            <button aria-label="Close success message" onClick={() => setSavedModalOpen(false)} type="button">
              <X aria-hidden="true" size={18} />
            </button>
          </section>
        </div>
      ) : null}
      <main className="dt-dashboard-content">
        <section className="dt-dashboard-hero">
          <div className="dt-dashboard-hero-copy">
            <span className="dt-dashboard-hero-kicker">WORKSPACE ADMINISTRATION</span>
            <h1>Organization</h1>
            <p>Manage your organization profile and regional defaults.</p>
          </div>
        </section>
        {loading ? <p>Loading organization settings…</p> : (
          <form className="dt-dashboard-business-grid" onSubmit={save}>
            {Object.entries(value).map(([key, fieldValue]) => (
              <label className="dt-dashboard-performance-note" key={key}>
                <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                <input
                  onChange={(event) => setValue({ ...value, [key]: event.target.value })}
                  required={key === 'name' || key === 'displayName'}
                  type={key === 'email' ? 'email' : key === 'website' ? 'url' : 'text'}
                  value={fieldValue}
                />
              </label>
            ))}
            <button className="dt-dashboard-primary-button" disabled={saving} type="submit">
              {saving ? 'Saving...' : 'Save organization'}
            </button>
            <button disabled={saving} onClick={() => navigate('/dashboard/settings')} type="button">Cancel</button>
            {id ? <button disabled={saving} onClick={remove} type="button">Delete organization</button> : null}
            {error ? <p role="alert">{error}</p> : null}
          </form>
        )}
      </main>
    </DashboardLayout>
  )
}
