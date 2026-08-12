import { useCallback, useEffect, useState } from 'react'
import AddCustomerModal from '../components/crm/AddCustomerModal'
import CrmAnalytics from '../components/crm/CrmAnalytics'
import CrmAssistant from '../components/crm/CrmAssistant'
import CrmHeader from '../components/crm/CrmHeader'
import CrmSummary from '../components/crm/CrmSummary'
import CustomerDrawer from '../components/crm/CustomerDrawer'
import CustomerFilters from '../components/crm/CustomerFilters'
import CustomerTable from '../components/crm/CustomerTable'
import '../components/crm/crm.css'
import DashboardLayout from '../layouts/DashboardLayout'
import customerService from '../services/customerService'

export default function CRM() {
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [customers, setCustomers] = useState([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadCustomers = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await customerService.getCustomers({ page: 1, pageSize: 100, search: search || undefined })
      setCustomers(response.data || [])
      setTotal(response.total || 0)
    } catch (requestError) {
      setCustomers([])
      setTotal(0)
      setError(requestError.response?.data?.message || 'Customer records could not be loaded.')
    } finally {
      setIsLoading(false)
    }
  }, [search])

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadCustomers() }, 250)
    return () => window.clearTimeout(timer)
  }, [loadCustomers])

  const openCustomer = async (customer) => {
    try {
      setSelectedCustomer(await customerService.getCustomer(customer.id))
    } catch {
      setSelectedCustomer(customer)
    }
  }

  const saveCustomer = async (payload) => {
    if (editingCustomer) await customerService.updateCustomer(editingCustomer.id, payload)
    else await customerService.createCustomer(payload)
    setEditingCustomer(null)
    setIsAddCustomerOpen(false)
    await loadCustomers()
  }

  const deleteCustomer = async (customer) => {
    await customerService.deleteCustomer(customer.id)
    if (selectedCustomer?.id === customer.id) setSelectedCustomer(null)
    await loadCustomers()
  }

  return (
    <DashboardLayout>
      <div className="dt-crm">
        <CrmHeader customerCount={total} onAddCustomer={() => { setEditingCustomer(null); setIsAddCustomerOpen(true) }} />
        <CrmSummary customers={customers} total={total} />
        <CustomerFilters customers={customers} search={search} setSearch={setSearch} />
        <section className="dt-crm-workspace-grid">
          <CustomerTable customers={customers} error={error} isLoading={isLoading} onDelete={deleteCustomer} onEdit={(customer) => { setEditingCustomer(customer); setIsAddCustomerOpen(true) }} onView={openCustomer} />
          <CrmAssistant customers={customers} onView={openCustomer} />
        </section>
        <CrmAnalytics customers={customers} />
      </div>
      <CustomerDrawer customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      <AddCustomerModal customer={editingCustomer} isOpen={isAddCustomerOpen} onClose={() => { setEditingCustomer(null); setIsAddCustomerOpen(false) }} onSave={saveCustomer} />
    </DashboardLayout>
  )
}
