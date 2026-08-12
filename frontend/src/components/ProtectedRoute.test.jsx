import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ProtectedRoute from './ProtectedRoute'

const { useAuth } = vi.hoisted(() => ({ useAuth: vi.fn() }))
vi.mock('../hooks/useAuth', () => ({ default: useAuth }))

function renderRoute() {
  return render(<MemoryRouter initialEntries={['/dashboard']}><Routes><Route path="/dashboard" element={<ProtectedRoute><p>Protected dashboard</p></ProtectedRoute>} /><Route path="/login" element={<p>Login page</p>} /></Routes></MemoryRouter>)
}

describe('ProtectedRoute', () => {
  it('waits while a secure session is being restored', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, isBootstrapping: true })
    renderRoute()
    expect(screen.getAllByText('Restoring your secure session').length).toBeGreaterThan(0)
  })

  it('redirects unauthenticated users to login', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, isBootstrapping: false })
    renderRoute()
    expect(screen.getByText('Login page')).not.toBeNull()
  })

  it('renders protected content after authentication succeeds', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, isBootstrapping: false })
    renderRoute()
    expect(screen.getByText('Protected dashboard')).not.toBeNull()
  })
})
