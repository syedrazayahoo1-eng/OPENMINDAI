import { describe, expect, it, vi } from 'vitest'
import api from './api'
import { updateRolePermissions } from './permissionService'

vi.mock('./api', () => ({ default: { put: vi.fn() } }))

describe('permissionService', () => {
  it('persists a role permission selection through the real API client', async () => {
    api.put.mockResolvedValue({ data: { roleId: 7, permissionIds: [15, 35] } })

    const result = await updateRolePermissions(7, [15, 35])

    expect(api.put).toHaveBeenCalledWith('/roles/7/permissions', { permissionIds: [15, 35] })
    expect(result).toEqual({ roleId: 7, permissionIds: [15, 35] })
  })
})
