import { Navigate, useLocation } from 'react-router-dom'
import AuthLoader from './auth/AuthLoader'
import useAuth from '../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const { isAuthenticated, isBootstrapping } = useAuth()

  if (isBootstrapping) {
    return (
      <div className="dt2-auth-route-loader" role="status">
        <AuthLoader label="Restoring your secure session" />
        <span>Restoring your secure session</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
