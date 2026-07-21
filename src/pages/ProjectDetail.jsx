import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { projectsStore, getProject, deleteProject, updateProject } from '../stores/projectsStore'

const statusColors = {
  Active: 'bg-green-100 text-green-700',
  'On Hold': 'bg-amber-100 text-amber-700',
  Completed: 'bg-slate-100 text-slate-600',
}

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  projectsStore.use() // re-render on store changes
  const project = getProject(id)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [tab, setTab] = useState('overview')

  if (!project) {
    return (
      <div data-testid="project-detail-missing" className="text-center py-16">
        <p className="text-slate-500 mb-4">This project no longer exists.</p>
        <button
          data-testid="project-detail-back-to-list"
          onClick={() => navigate('/projects')}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to Projects
        </button>
      </div>
    )
  }

  function confirmDelete() {
    deleteProject(project.id)
    navigate('/projects')
  }

  return (
    <div data-testid="project-detail-page">
      {/* Back link */}
      <button
        data-testid="project-detail-back-btn"
        onClick={() => navigate('/projects')}
        className="text-sm text-slate-500 hover:text-slate-800 mb-4 inline-flex items-center gap-1"
      >
        ← Back to Projects
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-4" data-testid="project-detail-header">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-800" data-testid="project-detail-name">{project.name}</h1>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[project.status]}`} data-testid="project-detail-status">
                {project.status}
              </span>
            </div>
            <p className="text-slate-500 text-sm" data-testid="project-detail-client">Client: {project.client}</p>
          </div>
          <button
            data-testid="project-detail-delete-btn"
            onClick={() => setDeleteOpen(true)}
            className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1.5 rounded border border-red-200 hover:bg-red-50"
          >
            Delete Project
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-slate-200" data-testid="project-detail-tabs">
        {['overview', 'team', 'activity'].map(t => (
          <button
            key={t}
            data-testid={`project-detail-tab-${t}`}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px ${
              tab === t ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid gap-4 sm:grid-cols-3" data-testid="project-detail-overview">
          <Stat label="Progress" value={`${project.progress}%`} testId="project-detail-stat-progress" />
          <Stat label="Budget" value={`$${(project.budget || 0).toLocaleString()}`} testId="project-detail-stat-budget" />
          <Stat label="Open Tasks" value={project.tasks} testId="project-detail-stat-tasks" />
          <div className="sm:col-span-3 bg-white rounded-xl shadow-sm p-5" data-testid="project-detail-progress-card">
            <div className="flex justify-between text-sm text-slate-500 mb-2">
              <span>Completion</span><span>{project.progress}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${project.progress}%` }} />
            </div>
            <div className="flex gap-2 mt-4">
              <button data-testid="project-detail-progress-inc" onClick={() => updateProject(project.id, { progress: Math.min(100, project.progress + 10) })}
                className="text-xs px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50">+10% Progress</button>
              <button data-testid="project-detail-mark-complete" onClick={() => updateProject(project.id, { progress: 100, status: 'Completed' })}
                className="text-xs px-3 py-1.5 rounded border border-green-300 text-green-700 hover:bg-green-50">Mark Complete</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'team' && (
        <div className="bg-white rounded-xl shadow-sm p-5" data-testid="project-detail-team">
          <p className="text-sm text-slate-600 mb-3">Project Lead: <strong>{project.lead || 'Unassigned'}</strong></p>
          <ul className="text-sm text-slate-500 space-y-2">
            <li data-testid="project-detail-team-1">👤 {project.lead || 'Unassigned'} — Lead</li>
            <li data-testid="project-detail-team-2">👤 Jordan Lee — Engineer</li>
            <li data-testid="project-detail-team-3">👤 Priya Nair — Designer</li>
          </ul>
        </div>
      )}

      {tab === 'activity' && (
        <div className="bg-white rounded-xl shadow-sm p-5" data-testid="project-detail-activity">
          <ul className="text-sm text-slate-500 space-y-3">
            <li>🟢 Project created</li>
            <li>📝 Requirements gathered</li>
            <li>🚧 Deadline set to {project.deadline || 'TBD'}</li>
          </ul>
        </div>
      )}

      {/* Delete confirm */}
      {deleteOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" data-testid="project-detail-delete-overlay">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" data-testid="project-detail-delete-modal">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Delete Project</h2>
            <p className="text-sm text-slate-500 mb-6">Delete "{project.name}"? This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button data-testid="project-detail-delete-cancel-btn" onClick={() => setDeleteOpen(false)}
                className="px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
              <button data-testid="project-detail-delete-confirm-btn" onClick={confirmDelete}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, testId }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5" data-testid={testId}>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  )
}
