import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ticketsStore, addTicket } from '../stores/ticketsStore'

const PRIORITIES = ['Low', 'Medium', 'High']
const CATEGORIES = ['Account', 'Billing', 'Bug', 'Feedback']
const STATUSES = ['Open', 'Pending', 'Resolved']

const priorityColors = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-slate-100 text-slate-600',
}
const statusColors = {
  Open: 'bg-blue-100 text-blue-700',
  Pending: 'bg-amber-100 text-amber-700',
  Resolved: 'bg-green-100 text-green-700',
}
const emptyForm = { subject: '', requester: '', priority: 'Medium', category: 'Account', message: '' }

export default function Tickets() {
  const tickets = ticketsStore.use()
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [successMsg, setSuccessMsg] = useState('')

  const filtered = tickets.filter(t => statusFilter === 'All' || t.status === statusFilter)

  function handleFormChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function handleCreate(e) {
    e.preventDefault()
    addTicket({
      subject: form.subject,
      requester: form.requester,
      priority: form.priority,
      category: form.category,
      replies: form.message ? [{ id: 1, author: form.requester || 'Requester', text: form.message, time: 'just now' }] : [],
    })
    setModalOpen(false)
    setForm(emptyForm)
    setSuccessMsg('Ticket created successfully.')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  return (
    <div data-testid="tickets-page">
      <div className="flex items-center justify-between mb-6" data-testid="tickets-header">
        <div>
          <h1 className="text-2xl font-bold text-slate-800" data-testid="tickets-title">Support Tickets</h1>
          <p className="text-slate-500 text-sm" data-testid="tickets-subtitle">Respond to and resolve customer requests</p>
        </div>
        <button
          data-testid="tickets-new-btn"
          onClick={() => { setForm(emptyForm); setModalOpen(true) }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + New Ticket
        </button>
      </div>

      {successMsg && (
        <div data-testid="tickets-success-msg" className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">
          {successMsg}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center" data-testid="tickets-filters">
        <span className="text-sm text-slate-500">Filter:</span>
        {['All', ...STATUSES].map(s => (
          <button
            key={s}
            data-testid={`tickets-filter-${s.toLowerCase()}`}
            onClick={() => setStatusFilter(s)}
            className={`text-sm px-3 py-1.5 rounded-lg border ${
              statusFilter === s ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden" data-testid="tickets-list-card">
        <table className="w-full text-sm" data-testid="tickets-table">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-3 px-4 text-slate-600 font-medium">#</th>
              <th className="text-left py-3 px-4 text-slate-600 font-medium">Subject</th>
              <th className="text-left py-3 px-4 text-slate-600 font-medium">Requester</th>
              <th className="text-left py-3 px-4 text-slate-600 font-medium">Priority</th>
              <th className="text-left py-3 px-4 text-slate-600 font-medium">Status</th>
            </tr>
          </thead>
          <tbody data-testid="tickets-table-body">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-slate-400" data-testid="tickets-empty">No tickets found.</td></tr>
            ) : filtered.map(t => (
              <tr
                key={t.id}
                data-testid={`tickets-row-${t.id}`}
                onClick={() => navigate(`/tickets/${t.id}`)}
                className="border-b border-slate-50 hover:bg-indigo-50/40 cursor-pointer"
              >
                <td className="py-3 px-4 text-slate-400 font-mono" data-testid={`tickets-id-${t.id}`}>#{t.id}</td>
                <td className="py-3 px-4 font-medium text-slate-800" data-testid={`tickets-subject-${t.id}`}>{t.subject}</td>
                <td className="py-3 px-4 text-slate-500">{t.requester}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColors[t.priority]}`}>{t.priority}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[t.status]}`} data-testid={`tickets-status-${t.id}`}>{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" data-testid="tickets-modal-overlay">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" data-testid="tickets-modal">
            <h2 className="text-lg font-bold text-slate-800 mb-5" data-testid="tickets-modal-title">New Support Ticket</h2>
            <form onSubmit={handleCreate} data-testid="tickets-modal-form">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input type="text" name="subject" data-testid="tickets-form-subject-input" value={form.subject} onChange={handleFormChange} required placeholder="Brief summary"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Requester Email</label>
                <input type="email" name="requester" data-testid="tickets-form-requester-input" value={form.requester} onChange={handleFormChange} required placeholder="user@example.com"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select name="priority" data-testid="tickets-form-priority-select" value={form.priority} onChange={handleFormChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select name="category" data-testid="tickets-form-category-select" value={form.category} onChange={handleFormChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea name="message" data-testid="tickets-form-message-input" value={form.message} onChange={handleFormChange} rows={3} placeholder="Describe the issue..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" data-testid="tickets-modal-cancel-btn" onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" data-testid="tickets-modal-create-btn"
                  className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">Create Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
