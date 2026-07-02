import { useState } from 'react'
import { useToast } from '../components/ui/toast-context'

const COLUMNS = [
  { id: 'todo', label: 'To Do', accent: 'border-slate-300' },
  { id: 'inprogress', label: 'In Progress', accent: 'border-blue-400' },
  { id: 'done', label: 'Done', accent: 'border-green-400' },
]

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']
const ASSIGNEES = ['Alice Johnson', 'Bob Smith', 'Carol White', 'David Brown', 'Unassigned']

const priorityColors = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-blue-100 text-blue-700',
  High: 'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700',
}

const initialTasks = [
  { id: 1, title: 'Write login regression suite', priority: 'High', assignee: 'Alice Johnson', status: 'todo' },
  { id: 2, title: 'Fix flaky checkout test', priority: 'Critical', assignee: 'Bob Smith', status: 'todo' },
  { id: 3, title: 'Add data-testid to product cards', priority: 'Medium', assignee: 'Carol White', status: 'inprogress' },
  { id: 4, title: 'Record dashboard smoke flow', priority: 'Low', assignee: 'David Brown', status: 'inprogress' },
  { id: 5, title: 'Generate Cucumber feature for orders', priority: 'High', assignee: 'Alice Johnson', status: 'done' },
  { id: 6, title: 'Set up CI pipeline for Playwright', priority: 'Medium', assignee: 'Bob Smith', status: 'done' },
]

const emptyForm = { title: '', priority: 'Medium', assignee: 'Unassigned' }

export default function Tasks({ user }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [search, setSearch] = useState('')
  const { notify } = useToast()

  const visible = tasks.filter(t => {
    const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
    return matchPriority && matchSearch
  })

  function openAddModal() {
    setEditingTask(null)
    setForm({ ...emptyForm, assignee: user?.name || 'Unassigned' })
    setModalOpen(true)
  }

  function openEditModal(task) {
    setEditingTask(task)
    setForm({ title: task.title, priority: task.priority, assignee: task.assignee })
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingTask(null)
    setForm(emptyForm)
  }

  function handleFormChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function handleSave(e) {
    e.preventDefault()
    if (editingTask) {
      setTasks(ts => ts.map(t => t.id === editingTask.id ? { ...t, ...form } : t))
      notify('Task updated.', 'success')
    } else {
      setTasks(ts => [...ts, { ...form, id: Date.now(), status: 'todo' }])
      notify('Task created.', 'success')
    }
    closeModal()
  }

  function moveTask(id, direction) {
    setTasks(ts => ts.map(t => {
      if (t.id !== id) return t
      const order = COLUMNS.map(c => c.id)
      const idx = order.indexOf(t.status)
      const nextIdx = Math.min(Math.max(idx + direction, 0), order.length - 1)
      return { ...t, status: order[nextIdx] }
    }))
  }

  function deleteTask(id) {
    setTasks(ts => ts.filter(t => t.id !== id))
    notify('Task deleted.', 'warning')
  }

  return (
    <div data-testid="tasks-page">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6" data-testid="tasks-header">
        <div>
          <h1 className="text-2xl font-bold text-slate-800" data-testid="tasks-title">Task Board</h1>
          <p className="text-slate-500 text-sm" data-testid="tasks-subtitle">Plan and track your QA work</p>
        </div>
        <button
          data-testid="tasks-add-btn"
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + New Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-center" data-testid="tasks-filters">
        <input
          type="text"
          data-testid="tasks-search-input"
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          data-testid="tasks-priority-filter"
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="All">All Priorities</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <button
          data-testid="tasks-clear-filters-btn"
          onClick={() => { setSearch(''); setPriorityFilter('All') }}
          className="text-sm text-slate-500 hover:text-slate-800 px-3 py-2 border border-slate-300 rounded-lg"
        >
          Clear
        </button>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="tasks-board">
        {COLUMNS.map((col, colIdx) => {
          const colTasks = visible.filter(t => t.status === col.id)
          return (
            <div key={col.id} data-testid={`tasks-column-${col.id}`} className={`bg-slate-50 rounded-xl border-t-4 ${col.accent} p-3`}>
              <div className="flex items-center justify-between px-1 mb-3">
                <h2 className="text-sm font-semibold text-slate-700" data-testid={`tasks-column-title-${col.id}`}>{col.label}</h2>
                <span className="text-xs font-medium text-slate-400 bg-white border border-slate-200 rounded-full px-2 py-0.5" data-testid={`tasks-column-count-${col.id}`}>
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[60px]" data-testid={`tasks-column-list-${col.id}`}>
                {colTasks.length === 0 ? (
                  <p className="text-xs text-slate-300 text-center py-6" data-testid={`tasks-column-empty-${col.id}`}>No tasks</p>
                ) : colTasks.map(task => (
                  <div key={task.id} data-testid={`task-card-${task.id}`} className="bg-white rounded-lg shadow-sm border border-slate-100 p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-medium text-slate-800" data-testid={`task-title-${task.id}`}>{task.title}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${priorityColors[task.priority]}`} data-testid={`task-priority-${task.id}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center">
                        {task.assignee[0]}
                      </span>
                      <span className="text-xs text-slate-500" data-testid={`task-assignee-${task.id}`}>{task.assignee}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        data-testid={`task-move-left-${task.id}`}
                        onClick={() => moveTask(task.id, -1)}
                        disabled={colIdx === 0}
                        className="text-xs px-2 py-1 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Move task left"
                      >
                        ←
                      </button>
                      <button
                        data-testid={`task-move-right-${task.id}`}
                        onClick={() => moveTask(task.id, 1)}
                        disabled={colIdx === COLUMNS.length - 1}
                        className="text-xs px-2 py-1 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Move task right"
                      >
                        →
                      </button>
                      <span className="flex-1" />
                      <button
                        data-testid={`task-edit-btn-${task.id}`}
                        onClick={() => openEditModal(task)}
                        className="text-xs px-2 py-1 rounded border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                      >
                        Edit
                      </button>
                      <button
                        data-testid={`task-delete-btn-${task.id}`}
                        onClick={() => deleteTask(task.id)}
                        className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50"
                      >
                        Del
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" data-testid="tasks-modal-overlay">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" data-testid="tasks-modal">
            <h2 className="text-lg font-bold text-slate-800 mb-5" data-testid="tasks-modal-title">
              {editingTask ? 'Edit Task' : 'New Task'}
            </h2>
            <form onSubmit={handleSave} data-testid="tasks-modal-form">
              <div className="mb-4" data-testid="tasks-form-title-group">
                <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="tasks-form-title-label">Title</label>
                <input
                  type="text"
                  name="title"
                  data-testid="tasks-form-title-input"
                  value={form.title}
                  onChange={handleFormChange}
                  required
                  placeholder="What needs to be done?"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div className="mb-4" data-testid="tasks-form-priority-group">
                <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="tasks-form-priority-label">Priority</label>
                <select
                  name="priority"
                  data-testid="tasks-form-priority-select"
                  value={form.priority}
                  onChange={handleFormChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="mb-6" data-testid="tasks-form-assignee-group">
                <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="tasks-form-assignee-label">Assignee</label>
                <select
                  name="assignee"
                  data-testid="tasks-form-assignee-select"
                  value={form.assignee}
                  onChange={handleFormChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="flex gap-3 justify-end" data-testid="tasks-modal-actions">
                <button
                  type="button"
                  data-testid="tasks-modal-cancel-btn"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  data-testid="tasks-modal-save-btn"
                  className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
