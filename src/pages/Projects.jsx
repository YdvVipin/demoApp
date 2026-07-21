import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { projectsStore, addProject } from '../stores/projectsStore'

const STATUSES = ['Active', 'On Hold', 'Completed']
const statusColors = {
  Active: 'bg-green-100 text-green-700',
  'On Hold': 'bg-amber-100 text-amber-700',
  Completed: 'bg-slate-100 text-slate-600',
}
const emptyForm = { name: '', client: '', status: 'Active', lead: '', budget: '', deadline: '' }

export default function Projects() {
  const projects = projectsStore.use()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [successMsg, setSuccessMsg] = useState('')

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  function handleFormChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function handleCreate(e) {
    e.preventDefault()
    addProject({ ...form, budget: Number(form.budget) || 0 })
    setModalOpen(false)
    setForm(emptyForm)
    flash('Project created successfully.')
  }

  function flash(msg) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  return (
    <div data-testid="projects-page">
      <div className="flex items-center justify-between mb-6" data-testid="projects-header">
        <div>
          <h1 className="text-2xl font-bold text-slate-800" data-testid="projects-title">Projects</h1>
          <p className="text-slate-500 text-sm" data-testid="projects-subtitle">Track delivery across all client projects</p>
        </div>
        <button
          data-testid="projects-new-btn"
          onClick={() => { setForm(emptyForm); setModalOpen(true) }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + New Project
        </button>
      </div>

      {successMsg && (
        <div data-testid="projects-success-msg" className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">
          {successMsg}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center" data-testid="projects-filters">
        <input
          type="text"
          data-testid="projects-search-input"
          placeholder="Search by name or client..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          data-testid="projects-status-filter"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="All">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="projects-grid">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400 bg-white rounded-xl shadow-sm" data-testid="projects-empty">
            No projects found.
          </div>
        ) : filtered.map(project => (
          <div
            key={project.id}
            data-testid={`projects-card-${project.id}`}
            className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-slate-800" data-testid={`projects-card-name-${project.id}`}>{project.name}</h3>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[project.status]}`} data-testid={`projects-card-status-${project.id}`}>
                {project.status}
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-4" data-testid={`projects-card-client-${project.id}`}>{project.client}</p>
            <div className="mb-3">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Progress</span>
                <span data-testid={`projects-card-progress-${project.id}`}>{project.progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${project.progress}%` }} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Lead: {project.lead || '—'}</span>
              <button
                data-testid={`projects-open-btn-${project.id}`}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Open →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" data-testid="projects-modal-overlay">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" data-testid="projects-modal">
            <h2 className="text-lg font-bold text-slate-800 mb-5" data-testid="projects-modal-title">New Project</h2>
            <form onSubmit={handleCreate} data-testid="projects-modal-form">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                <input type="text" name="name" data-testid="projects-form-name-input" value={form.name} onChange={handleFormChange} required placeholder="e.g. Website Redesign"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
                <input type="text" name="client" data-testid="projects-form-client-input" value={form.client} onChange={handleFormChange} required placeholder="e.g. Acme Corp"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lead</label>
                  <input type="text" name="lead" data-testid="projects-form-lead-input" value={form.lead} onChange={handleFormChange} placeholder="Owner"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Budget ($)</label>
                  <input type="number" name="budget" data-testid="projects-form-budget-input" value={form.budget} onChange={handleFormChange} placeholder="0"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select name="status" data-testid="projects-form-status-select" value={form.status} onChange={handleFormChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
                  <input type="date" name="deadline" data-testid="projects-form-deadline-input" value={form.deadline} onChange={handleFormChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" data-testid="projects-modal-cancel-btn" onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" data-testid="projects-modal-create-btn"
                  className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
