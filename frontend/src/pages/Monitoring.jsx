import DashboardLayout from '../layouts/DashboardLayout'
import OperationsDashboard from '../components/dashboard/OperationsDashboard'

export default function Monitoring() {
  return <DashboardLayout><main className="dt-dashboard-content"><OperationsDashboard /></main></DashboardLayout>
}
