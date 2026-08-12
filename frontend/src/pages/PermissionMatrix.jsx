import { ChevronDown, ChevronRight, KeyRound, Save, Search, ShieldCheck } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import DashboardLayout from '../layouts/DashboardLayout'
import { getPermissionGroups, getRolePermissions, getRoles, updateRolePermissions } from '../services/permissionService'

const getErrorMessage = (error, fallback) => error.response?.data?.message || Object.values(error.response?.data?.errors || {}).flat().find(Boolean) || fallback

export default function PermissionMatrix() {
  const [roles, setRoles] = useState([])
  const [groups, setGroups] = useState([])
  const [roleId, setRoleId] = useState('')
  const [selected, setSelected] = useState([])
  const [savedSelection, setSavedSelection] = useState([])
  const [expanded, setExpanded] = useState({})
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadRolePermissions = useCallback(async (id) => {
    if (!id) { setSelected([]); setSavedSelection([]); return }
    setLoading(true)
    try {
      const response = await getRolePermissions(id)
      setSelected(response.permissionIds)
      setSavedSelection(response.permissionIds)
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Role permissions could not be loaded.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    Promise.all([getRoles(), getPermissionGroups()])
      .then(([roleData, permissionGroups]) => {
        setRoles(roleData)
        setGroups(permissionGroups)
        const firstRoleId = roleData[0]?.id?.toString() || ''
        setRoleId(firstRoleId)
        setExpanded(Object.fromEntries(permissionGroups.map((group) => [group.name, true])))
      })
      .catch((requestError) => setError(getErrorMessage(requestError, 'Permission matrix could not be loaded.')))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { loadRolePermissions(roleId) }, [loadRolePermissions, roleId])

  const filteredGroups = useMemo(() => groups.map((group) => ({ ...group, permissions: group.permissions.filter((permission) => permission.name.toLowerCase().includes(search.trim().toLowerCase())) })).filter((group) => group.permissions.length), [groups, search])
  const togglePermission = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const toggleGroup = (group) => {
    const ids = group.permissions.map((permission) => permission.id)
    const everySelected = ids.every((id) => selected.includes(id))
    setSelected((current) => everySelected ? current.filter((id) => !ids.includes(id)) : [...new Set([...current, ...ids])])
  }
  const save = async () => {
    if (!roleId || saving) return
    setSaving(true)
    try {
      const result = await updateRolePermissions(roleId, selected)
      setSelected(result.permissionIds)
      setSavedSelection(result.permissionIds)
      toast.success('Permission matrix saved.')
    } catch (requestError) {
      toast.error(getErrorMessage(requestError, 'Permission matrix could not be saved.'))
    } finally {
      setSaving(false)
    }
  }

  return <DashboardLayout><Toaster position="top-right" /><main className="dt-dashboard-content"><section className="dt-dashboard-hero"><div className="dt-dashboard-hero-copy"><span className="dt-dashboard-hero-kicker">ACCESS CONTROL</span><h1>Permission <em>Matrix</em></h1><p>Define exactly what each workspace role can view, create, change, and execute.</p></div><ShieldCheck size={42} aria-hidden="true" /></section><section className="dt-permission-matrix-card"><header className="dt-permission-matrix-toolbar"><label><span>Role</span><select disabled={loading || saving} onChange={(event) => setRoleId(event.target.value)} value={roleId}><option value="">Select a role</option>{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label><label className="dt-permission-matrix-search"><Search size={17} /><input aria-label="Search permissions" onChange={(event) => setSearch(event.target.value)} placeholder="Search permissions" value={search} /></label><div><button disabled={saving || loading || !roleId} onClick={() => setSelected(savedSelection)} type="button">Reset</button><button className="dt-dashboard-primary-button" disabled={saving || loading || !roleId} onClick={save} type="button"><Save size={16} />{saving ? 'Saving...' : 'Save permissions'}</button></div></header>{error ? <div className="dt-permission-matrix-error" role="alert">{error}<button onClick={() => window.location.reload()} type="button">Try again</button></div> : null}{loading ? <div className="dt-permission-matrix-skeletons">{Array.from({ length: 5 }).map((_, index) => <div key={index} />)}</div> : !roleId ? <div className="dt-permission-matrix-empty"><KeyRound size={30} /><h2>Select a role</h2><p>Choose a role to review and manage its permissions.</p></div> : filteredGroups.length === 0 ? <div className="dt-permission-matrix-empty"><Search size={30} /><h2>No permissions match</h2><p>Clear the search to view the full permission catalog.</p></div> : <div className="dt-permission-matrix-groups">{filteredGroups.map((group) => { const groupIds = group.permissions.map((permission) => permission.id); const selectedCount = groupIds.filter((id) => selected.includes(id)).length; return <section key={group.name}><header><button aria-expanded={expanded[group.name]} onClick={() => setExpanded((current) => ({ ...current, [group.name]: !current[group.name] }))} type="button">{expanded[group.name] ? <ChevronDown size={17} /> : <ChevronRight size={17} />}<strong>{group.name}</strong><span>{selectedCount}/{groupIds.length} enabled</span></button><label><input aria-label={`Enable all ${group.name} permissions`} checked={selectedCount === groupIds.length} onChange={() => toggleGroup(group)} type="checkbox" />All</label></header>{expanded[group.name] ? <div>{group.permissions.map((permission) => <label key={permission.id}><input checked={selected.includes(permission.id)} onChange={() => togglePermission(permission.id)} type="checkbox" /><span><strong>{permission.name.split('.')[1]}</strong><small>{permission.description || `${permission.name} access`}</small></span></label>)}</div> : null}</section> })}</div>}</section></main></DashboardLayout>
}
