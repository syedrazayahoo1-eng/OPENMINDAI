import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

const LandingPage = lazy(() => import('./landing/LandingPage'))
const AuthLayout = lazy(() => import('./layouts/AuthLayout'))
const AIAgents = lazy(() => import('./pages/AIAgents'))
const AIReplies = lazy(() => import('./pages/AIReplies'))
const Attendance = lazy(() => import('./pages/Attendance'))
const BrandVoice = lazy(() => import('./pages/BrandVoice'))
const Chat = lazy(() => import('./pages/Chat'))
const CRM = lazy(() => import('./pages/CRM'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Employees = lazy(() => import('./pages/Employees'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const GoogleBusinessPosts = lazy(() => import('./pages/GoogleBusinessPosts'))
const AIImageStudio = lazy(() => import('./pages/AIImageStudio'))
const Leaves = lazy(() => import('./pages/Leaves'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const SettingsHub = lazy(() => import('./pages/SettingsHub'))
const SettingsModule = lazy(() => import('./pages/SettingsModule'))
const OrganizationSettings = lazy(() => import('./pages/OrganizationSettings'))
const UserManagement = lazy(() => import('./pages/UserManagement'))
const PermissionMatrix = lazy(() => import('./pages/PermissionMatrix'))
const SecurityCenter = lazy(() => import('./pages/SecurityCenter'))
const IntegrationsCenter = lazy(() => import('./pages/IntegrationsCenter'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Monitoring = lazy(() => import('./pages/Monitoring'))
const Reviews = lazy(() => import('./pages/Reviews'))
const Workflows = lazy(() => import('./pages/Workflows'))
const WorkflowBuilder = lazy(() => import('./pages/WorkflowBuilder'))
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'))
const VerifyOTP = lazy(() => import('./pages/VerifyOTP'))

export default function App() {
  return <Suspense fallback={null}><Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
    <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
    <Route path="/forgot-password" element={<AuthLayout variant="recovery"><ForgotPassword /></AuthLayout>} />
    <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />
    <Route path="/verify-otp" element={<AuthLayout><VerifyOTP /></AuthLayout>} />
    <Route path="/verify-email" element={<AuthLayout><VerifyEmail /></AuthLayout>} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
    <Route path="/agents" element={<ProtectedRoute><AIAgents /></ProtectedRoute>} />
    <Route path="/workflows" element={<ProtectedRoute><Workflows /></ProtectedRoute>} />
    <Route path="/workflow-builder/:id?" element={<ProtectedRoute><WorkflowBuilder /></ProtectedRoute>} />
    <Route path="/crm" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
    <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
    <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
    <Route path="/leaves" element={<ProtectedRoute><Leaves /></ProtectedRoute>} />
    <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
    <Route path="/ai-replies" element={<ProtectedRoute><AIReplies /></ProtectedRoute>} />
    <Route path="/marketing/google-business-posts" element={<ProtectedRoute><GoogleBusinessPosts /></ProtectedRoute>} />
    <Route path="/marketing/ai-image-studio" element={<ProtectedRoute><AIImageStudio /></ProtectedRoute>} />
    <Route path="/settings/brand-voice" element={<ProtectedRoute><BrandVoice /></ProtectedRoute>} />
    <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsHub /></ProtectedRoute>} />
    <Route path="/settings/organization" element={<ProtectedRoute><OrganizationSettings /></ProtectedRoute>} />
    <Route path="/settings/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
    <Route path="/settings/permissions" element={<ProtectedRoute><PermissionMatrix /></ProtectedRoute>} />
    <Route path="/settings/security" element={<ProtectedRoute><SecurityCenter /></ProtectedRoute>} />
    <Route path="/settings/integrations" element={<ProtectedRoute><IntegrationsCenter /></ProtectedRoute>} />
    <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
    <Route path="/dashboard/analytics" element={<Navigate to="/analytics" replace />} />
    <Route path="/monitoring" element={<ProtectedRoute><Monitoring /></ProtectedRoute>} />
    <Route path="/settings/:section" element={<ProtectedRoute><SettingsModule /></ProtectedRoute>} />
    <Route path="/settings" element={<Navigate to="/settings/brand-voice" replace />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></Suspense>
}
