import { useContext } from 'react'
import AuthStoreContext from '../context/authStoreContext'

export default function useAuth() {
  const context = useContext(AuthStoreContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }

  return context
}

export { useAuth }
