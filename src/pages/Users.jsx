import { useState } from 'react'

const ROLES = ['Admin', 'Manager', 'Tester', 'Viewer']
const STATUSES = ['Active', 'Inactive', 'Suspended']

const initialUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', joined: '2024-01-10' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Manager', status: 'Active', joined: '2024-02-14' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Tester', status: 'Inactive', joined: '2024-03-05' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'Viewer', status: 'Active', joined: '2024-04-20' },
  { id: 5, name: 'Eva Martinez', email: 'eva@example.com', role: 'Tester', status: 'Suspended', joined: '2024-05-01' },
]

const statusColors = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-slate-100 text-slate-600',
  Suspended: 'bg-red-100 text-red-700',
}

const emptyForm = { name: '', email: '', role: 'Viewer', status: 'Active' }

export default function Users() {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'All' || u.role === roleFilter
    return matchSearch && matchRole
  })

  function openAddModal() {
    setEditingUser(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEditModal(user) {
    setEditingUser(user)
    setForm({ name: user.name, email: user.email, role: user.role, status: user.status })
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingUser(null)
    setForm(emptyForm)
  }

  function handleFormChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function handleSave(e) {
    e.preventDefault()
    if (editingUser) {
      setUsers(us => us.map(u => u.id === editingUser.id ? { ...u, ...form } : u))
      flash('User updated successfully.')
    } else {
      setUsers(us => [...us, { ...form, id: Date.now(), joined: new Date().toISOString().split('T')[0] }])
      flash('User added successfully.')
    }
    closeModal()
  }

  function handleDelete(id) {
    setUsers(us => us.filter(u => u.id !== id))
    setDeleteConfirmId(null)
    flash('User deleted.')
  }

  function flash(msg) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  return (
    <div data-testid="users-page">
      <div className="flex items-center justify-between mb-6" data-testid="users-header">
        <div>
          <h1 className="text-2xl font-bold text-slate-800" data-testid="users-title">User Management</h1>
          <p className="text-slate-500 text-sm" data-testid="users-subtitle">Manage application users and their roles</p>
        </div>
        <button
          data-testid="users-add-btn"
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Add User
        </button>
      </div>

      {successMsg && (
        <div data-testid="users-success-msg" className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">
          {successMsg}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center" data-testid="users-filters">
        <input
          type="text"
          data-testid="users-search-input"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          data-testid="users-role-filter"
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="All">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <button
          data-testid="users-clear-filters-btn"
          onClick={() => { setSearch(''); setRoleFilter('All') }}
          className="text-sm text-slate-500 hover:text-slate-800 px-3 py-2 border border-slate-300 rounded-lg"
        >
          Clear
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden" data-testid="users-table-card">
        <div className="overflow-x-auto" data-testid="users-table-wrapper">
          <table className="w-full text-sm" data-testid="users-table">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 text-slate-600 font-medium" data-testid="users-col-name">Name</th>
                <th className="text-left py-3 px-4 text-slate-600 font-medium" data-testid="users-col-email">Email</th>
                <th className="text-left py-3 px-4 text-slate-600 font-medium" data-testid="users-col-role">Role</th>
                <th className="text-left py-3 px-4 text-slate-600 font-medium" data-testid="users-col-status">Status</th>
                <th className="text-left py-3 px-4 text-slate-600 font-medium" data-testid="users-col-joined">Joined</th>
                <th className="text-left py-3 px-4 text-slate-600 font-medium" data-testid="users-col-actions">Actions</th>
              </tr>
            </thead>
            <tbody data-testid="users-table-body">
              {filtered.length === 0 ? (
                <tr data-testid="users-empty-row">
                  <td colSpan={6} className="text-center py-8 text-slate-400" data-testid="users-empty-msg">No users found.</td>
                </tr>
              ) : filtered.map(user => (
                <tr key={user.id} data-testid={`users-row-${user.id}`} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-800" data-testid={`users-name-${user.id}`}>{user.name}</td>
                  <td className="py-3 px-4 text-slate-500" data-testid={`users-email-${user.id}`}>{user.email}</td>
                  <td className="py-3 px-4 text-slate-600" data-testid={`users-role-${user.id}`}>{user.role}</td>
                  <td className="py-3 px-4" data-testid={`users-status-${user.id}`}>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400" data-testid={`users-joined-${user.id}`}>{user.joined}</td>
                  <td className="py-3 px-4" data-testid={`users-actions-${user.id}`}>
                    <div className="flex gap-2">
                      <button
                        data-testid={`users-edit-btn-${user.id}`}
                        onClick={() => openEditModal(user)}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium px-2 py-1 rounded border border-indigo-200 hover:bg-indigo-50"
                      >
                        Edit
                      </button>
                      <button
                        data-testid={`users-delete-btn-${user.id}`}
                        onClick={() => setDeleteConfirmId(user.id)}
                        className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 rounded border border-red-200 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 text-xs text-slate-400 border-t border-slate-100" data-testid="users-table-footer">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" data-testid="users-modal-overlay">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" data-testid="users-modal">
            <h2 className="text-lg font-bold text-slate-800 mb-5" data-testid="users-modal-title">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={handleSave} data-testid="users-modal-form">
              <div className="mb-4" data-testid="users-form-name-group">
                <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="users-form-name-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  data-testid="users-form-name-input"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  placeholder="Enter full name"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div className="mb-4" data-testid="users-form-email-group">
                <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="users-form-email-label">Email</label>
                <input
                  type="email"
                  name="email"
                  data-testid="users-form-email-input"
                  value={form.email}
                  onChange={handleFormChange}
                  required
                  placeholder="Enter email"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div className="mb-4" data-testid="users-form-role-group">
                <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="users-form-role-label">Role</label>
                <select
                  name="role"
                  data-testid="users-form-role-select"
                  value={form.role}
                  onChange={handleFormChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="mb-6" data-testid="users-form-status-group">
                <label className="block text-sm font-medium text-slate-700 mb-2" data-testid="users-form-status-label">Status</label>
                <div className="flex gap-4" data-testid="users-form-status-options">
                  {STATUSES.map(s => (
                    <label key={s} className="flex items-center gap-2 text-sm cursor-pointer" data-testid={`users-form-status-option-${s.toLowerCase()}`}>
                      <input
                        type="radio"
                        name="status"
                        data-testid={`users-form-status-radio-${s.toLowerCase()}`}
                        value={s}
                        checked={form.status === s}
                        onChange={handleFormChange}
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 justify-end" data-testid="users-modal-actions">
                <button
                  type="button"
                  data-testid="users-modal-cancel-btn"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  data-testid="users-modal-save-btn"
                  className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
                >
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" data-testid="users-delete-overlay">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" data-testid="users-delete-modal">
            <h2 className="text-lg font-bold text-slate-800 mb-2" data-testid="users-delete-modal-title">Delete User</h2>
            <p className="text-sm text-slate-500 mb-6" data-testid="users-delete-modal-msg">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                data-testid="users-delete-cancel-btn"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                data-testid="users-delete-confirm-btn"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
