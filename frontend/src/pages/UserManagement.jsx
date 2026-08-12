import { Pencil, Plus, Search, Trash2, UserCog, UserRoundX, Users, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import DashboardLayout from '../layouts/DashboardLayout'
import { activateUser, assignUserRoles, deactivateUser, deleteUser, getRoles, getUser, getUsers, inviteUser, updateUser } from '../services/userService'

const emptyInvite = { fullName: '', email: '', companyName: '', initialPassword: '', roleIds: [] }
const emptyEdit = { fullName: '', email: '', companyName: '' }
const errorMessage = (error, fallback) => error.response?.data?.message || Object.values(error.response?.data?.errors || {}).flat().find(Boolean) || fallback

function UserDialog({ children, onClose, title }) {
  return <div className="dt-user-management-overlay" onMouseDown={onClose} role="presentation"><section aria-modal="true" className="dt-user-management-dialog" onMouseDown={(event) => event.stopPropagation()} role="dialog"><header><div><span>ACCESS CONTROL</span><h2>{title}</h2></div><button aria-label="Close dialog" onClick={onClose} type="button"><X size={18} /></button></header>{children}</section></div>
}

export default function UserManagement() {
  const [filters, setFilters] = useState({ search: '', role: '', isActive: '', page: 1, pageSize: 10 })
  const [search, setSearch] = useState('')
  const [result, setResult] = useState({ items: [], page: 1, pageSize: 10, totalCount: 0 })
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState('')
  const [error, setError] = useState('')
  const [dialog, setDialog] = useState(null)
  const [invite, setInvite] = useState(emptyInvite)
  const [edit, setEdit] = useState(emptyEdit)
  const [roleIds, setRoleIds] = useState([])
  const [confirmUser, setConfirmUser] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const query = { ...filters }
      if (query.isActive === '') delete query.isActive
      delete query.role
      setResult(await getUsers(query))
    } catch (requestError) {
      setError(errorMessage(requestError, 'Users could not be loaded.'))
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { load() }, [load])
  useEffect(() => { getRoles().then(setRoles).catch((requestError) => setError(errorMessage(requestError, 'Roles could not be loaded.'))) }, [])

  const refreshAfter = async (message) => { await load(); toast.success(message) }
  const toggleRole = (id, setter) => setter((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const openInvite = () => { setInvite(emptyInvite); setDialog('invite') }
  const openEdit = async (id) => {
    setWorking(`load-${id}`)
    try {
      const user = await getUser(id)
      setEdit({ fullName: user.fullName, email: user.email, companyName: user.companyName })
      setDialog({ type: 'edit', user })
    } catch (requestError) { toast.error(errorMessage(requestError, 'User details could not be loaded.')) } finally { setWorking('') }
  }
  const submitInvite = async (event) => {
    event.preventDefault(); setWorking('invite')
    try { await inviteUser(invite); setDialog(null); await refreshAfter('User invited successfully.') } catch (requestError) { toast.error(errorMessage(requestError, 'User could not be invited.')) } finally { setWorking('') }
  }
  const submitEdit = async (event) => {
    event.preventDefault(); setWorking('edit')
    try { await updateUser(dialog.user.id, edit); setDialog(null); await refreshAfter('User details updated.') } catch (requestError) { toast.error(errorMessage(requestError, 'User could not be updated.')) } finally { setWorking('') }
  }
  const submitRoles = async (event) => {
    event.preventDefault(); setWorking('roles')
    try { await assignUserRoles(dialog.user.id, roleIds); setDialog(null); await refreshAfter('User roles updated.') } catch (requestError) { toast.error(errorMessage(requestError, 'User roles could not be updated.')) } finally { setWorking('') }
  }
  const changeStatus = async (user) => {
    setWorking(`status-${user.id}`)
    try { user.isActive ? await deactivateUser(user.id) : await activateUser(user.id); await refreshAfter(user.isActive ? 'User deactivated.' : 'User activated.') } catch (requestError) { toast.error(errorMessage(requestError, 'User status could not be updated.')) } finally { setWorking('') }
  }
  const remove = async () => {
    setWorking('delete')
    try { await deleteUser(confirmUser.id); setConfirmUser(null); await refreshAfter('User deleted.') } catch (requestError) { toast.error(errorMessage(requestError, 'User could not be deleted.')) } finally { setWorking('') }
  }
  const totalPages = Math.max(1, Math.ceil(result.totalCount / filters.pageSize))
  const visibleUsers = filters.role ? result.items.filter((user) => user.roles.includes(filters.role)) : result.items

  return <DashboardLayout><Toaster position="top-right" /><main className="dt-dashboard-content"><section className="dt-dashboard-hero"><div className="dt-dashboard-hero-copy"><span className="dt-dashboard-hero-kicker">ACCESS CONTROL</span><h1>User <em>Management</em></h1><p>Manage workspace users, operational access, and responsibilities.</p></div><button className="dt-dashboard-primary-button" onClick={openInvite} type="button"><Plus size={16} />Invite user</button></section><section className="dt-user-management-card"><header className="dt-user-management-toolbar"><form onSubmit={(event) => { event.preventDefault(); setFilters((current) => ({ ...current, search, page: 1 })) }}><Search size={17} /><input aria-label="Search users" onChange={(event) => setSearch(event.target.value)} placeholder="Search users by name, email, or company" value={search} /><button type="submit">Search</button></form><select aria-label="Filter users by role" onChange={(event) => setFilters((current) => ({ ...current, role: event.target.value, page: 1 }))} value={filters.role}><option value="">All roles</option>{roles.map((role) => <option key={role.id} value={role.name}>{role.name}</option>)}</select><select aria-label="Filter users by status" onChange={(event) => setFilters((current) => ({ ...current, isActive: event.target.value, page: 1 }))} value={filters.isActive}><option value="">All statuses</option><option value="true">Active</option><option value="false">Inactive</option></select></header>{error ? <div className="dt-user-management-error" role="alert">{error}<button onClick={load} type="button">Try again</button></div> : null}{loading ? <div className="dt-user-management-skeletons">{Array.from({ length: 5 }).map((_, index) => <div key={index} />)}</div> : visibleUsers.length === 0 ? <div className="dt-user-management-empty"><Users size={30} /><h2>No users found</h2><p>Adjust the filters or invite a workspace user to begin.</p><button className="dt-dashboard-primary-button" onClick={openInvite} type="button">Invite user</button></div> : <><div className="dt-user-management-table-wrap"><table className="dt-user-management-table"><thead><tr><th>User</th><th>Roles</th><th>Status</th><th>Created</th><th><span className="dt-dashboard-visually-hidden">Actions</span></th></tr></thead><tbody>{visibleUsers.map((user) => <tr key={user.id}><td><div className="dt-user-management-identity"><span>{user.fullName.slice(0, 1).toUpperCase()}</span><div><strong>{user.fullName}</strong><small>{user.email} · {user.companyName}</small></div></div></td><td><div className="dt-user-management-role-list">{user.roles.length ? user.roles.map((role) => <span key={role}>{role}</span>) : <small>No role assigned</small>}</div></td><td><button aria-pressed={user.isActive} className={`dt-user-management-status ${user.isActive ? 'is-active' : 'is-inactive'}`} disabled={working === `status-${user.id}`} onClick={() => changeStatus(user)} type="button">{working === `status-${user.id}` ? 'Updating...' : user.isActive ? 'Active' : 'Inactive'}</button></td><td>{new Date(user.createdAt).toLocaleDateString()}</td><td><div className="dt-user-management-actions"><button aria-label={`Edit ${user.fullName}`} disabled={Boolean(working)} onClick={() => openEdit(user.id)} type="button"><Pencil size={15} /></button><button aria-label={`Assign roles to ${user.fullName}`} disabled={Boolean(working)} onClick={() => { setRoleIds(roles.filter((role) => user.roles.includes(role.name)).map((role) => role.id)); setDialog({ type: 'roles', user }) }} type="button"><UserCog size={16} /></button><button aria-label={`Delete ${user.fullName}`} disabled={Boolean(working)} onClick={() => setConfirmUser(user)} type="button"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div><footer className="dt-user-management-pagination"><span>{result.totalCount} user{result.totalCount === 1 ? '' : 's'}</span><div><button disabled={loading || filters.page <= 1} onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))} type="button">Previous</button><strong>Page {filters.page} of {totalPages}</strong><button disabled={loading || filters.page >= totalPages} onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))} type="button">Next</button></div></footer></>}</section>{dialog === 'invite' ? <UserDialog onClose={() => setDialog(null)} title="Invite user"><form className="dt-user-management-form" onSubmit={submitInvite}><label>Full name<input required value={invite.fullName} onChange={(event) => setInvite({ ...invite, fullName: event.target.value })} /></label><label>Email<input required type="email" value={invite.email} onChange={(event) => setInvite({ ...invite, email: event.target.value })} /></label><label>Company<input required value={invite.companyName} onChange={(event) => setInvite({ ...invite, companyName: event.target.value })} /></label><label>Initial password<input minLength="12" required type="password" value={invite.initialPassword} onChange={(event) => setInvite({ ...invite, initialPassword: event.target.value })} /></label><fieldset><legend>Assign roles</legend>{roles.map((role) => <label key={role.id}><input checked={invite.roleIds.includes(role.id)} onChange={() => toggleRole(role.id, (updater) => setInvite((current) => ({ ...current, roleIds: updater(current.roleIds) })))} type="checkbox" />{role.name}</label>)}</fieldset><button className="dt-dashboard-primary-button" disabled={working === 'invite'} type="submit">{working === 'invite' ? 'Inviting...' : 'Invite user'}</button></form></UserDialog> : null}{dialog?.type === 'edit' ? <UserDialog onClose={() => setDialog(null)} title="Edit user"><form className="dt-user-management-form" onSubmit={submitEdit}><label>Full name<input required value={edit.fullName} onChange={(event) => setEdit({ ...edit, fullName: event.target.value })} /></label><label>Email<input required type="email" value={edit.email} onChange={(event) => setEdit({ ...edit, email: event.target.value })} /></label><label>Company<input required value={edit.companyName} onChange={(event) => setEdit({ ...edit, companyName: event.target.value })} /></label><button className="dt-dashboard-primary-button" disabled={working === 'edit'} type="submit">{working === 'edit' ? 'Saving...' : 'Save changes'}</button></form></UserDialog> : null}{dialog?.type === 'roles' ? <UserDialog onClose={() => setDialog(null)} title={`Roles for ${dialog.user.fullName}`}><form className="dt-user-management-form" onSubmit={submitRoles}><fieldset><legend>Role assignment</legend>{roles.map((role) => <label key={role.id}><input checked={roleIds.includes(role.id)} onChange={() => toggleRole(role.id, setRoleIds)} type="checkbox" />{role.name}</label>)}</fieldset><button className="dt-dashboard-primary-button" disabled={working === 'roles'} type="submit">{working === 'roles' ? 'Saving...' : 'Save roles'}</button></form></UserDialog> : null}{confirmUser ? <UserDialog onClose={() => setConfirmUser(null)} title="Delete user"><div className="dt-user-management-confirm"><UserRoundX size={28} /><p>Delete <strong>{confirmUser.fullName}</strong>? This permanently removes their workspace access.</p><div><button disabled={working === 'delete'} onClick={() => setConfirmUser(null)} type="button">Cancel</button><button className="dt-user-management-danger" disabled={working === 'delete'} onClick={remove} type="button">{working === 'delete' ? 'Deleting...' : 'Delete user'}</button></div></div></UserDialog> : null}</main></DashboardLayout>
}
