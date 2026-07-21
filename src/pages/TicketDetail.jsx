import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ticketsStore, getTicket, deleteTicket, updateTicket, addReply } from '../stores/ticketsStore'

const STATUSES = ['Open', 'Pending', 'Resolved']
const statusColors = {
  Open: 'bg-blue-100 text-blue-700',
  Pending: 'bg-amber-100 text-amber-700',
  Resolved: 'bg-green-100 text-green-700',
}

export default function TicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  ticketsStore.use()
  const ticket = getTicket(id)
  const [reply, setReply] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (!ticket) {
    return (
      <div data-testid="ticket-detail-missing" className="text-center py-16">
        <p className="text-slate-500 mb-4">This ticket no longer exists.</p>
        <button data-testid="ticket-detail-back-to-list" onClick={() => navigate('/tickets')}
          className="text-indigo-600 hover:text-indigo-800 font-medium">← Back to Tickets</button>
      </div>
    )
  }

  function postReply(e) {
    e.preventDefault()
    if (!reply.trim()) return
    addReply(ticket.id, reply.trim())
    setReply('')
  }

  function confirmDelete() {
    deleteTicket(ticket.id)
    navigate('/tickets')
  }

  return (
    <div data-testid="ticket-detail-page">
      <button data-testid="ticket-detail-back-btn" onClick={() => navigate('/tickets')}
        className="text-sm text-slate-500 hover:text-slate-800 mb-4 inline-flex items-center gap-1">← Back to Tickets</button>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-4" data-testid="ticket-detail-header">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs text-slate-400 font-mono mb-1" data-testid="ticket-detail-id">Ticket #{ticket.id}</p>
            <h1 className="text-xl font-bold text-slate-800" data-testid="ticket-detail-subject">{ticket.subject}</h1>
            <p className="text-sm text-slate-500 mt-1" data-testid="ticket-detail-requester">{ticket.requester} · {ticket.category}</p>
          </div>
          <button data-testid="ticket-detail-delete-btn" onClick={() => setDeleteOpen(true)}
            className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1.5 rounded border border-red-200 hover:bg-red-50">Delete</button>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <label className="text-sm text-slate-500">Status:</label>
          <select
            data-testid="ticket-detail-status-select"
            value={ticket.status}
            onChange={e => updateTicket(ticket.id, { status: e.target.value })}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[ticket.status]}`} data-testid="ticket-detail-status-badge">{ticket.status}</span>
          {ticket.status !== 'Resolved' && (
            <button data-testid="ticket-detail-resolve-btn" onClick={() => updateTicket(ticket.id, { status: 'Resolved' })}
              className="text-xs px-3 py-1.5 rounded border border-green-300 text-green-700 hover:bg-green-50">Mark Resolved</button>
          )}
        </div>
      </div>

      {/* Conversation */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-4" data-testid="ticket-detail-conversation">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Conversation</h2>
        {ticket.replies.length === 0 ? (
          <p className="text-sm text-slate-400" data-testid="ticket-detail-no-replies">No messages yet.</p>
        ) : (
          <ul className="space-y-4" data-testid="ticket-detail-replies">
            {ticket.replies.map(r => (
              <li key={r.id} data-testid={`ticket-detail-reply-${r.id}`} className="flex gap-3">
                <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {r.author[0]}
                </span>
                <div className="bg-slate-50 rounded-lg px-4 py-2 flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-700">{r.author}</span>
                    <span className="text-xs text-slate-400">{r.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-0.5">{r.text}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={postReply} className="mt-5 border-t border-slate-100 pt-4" data-testid="ticket-detail-reply-form">
          <textarea
            data-testid="ticket-detail-reply-input"
            value={reply}
            onChange={e => setReply(e.target.value)}
            rows={2}
            placeholder="Type your reply..."
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="flex justify-end mt-2">
            <button type="submit" data-testid="ticket-detail-reply-submit"
              className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">Send Reply</button>
          </div>
        </form>
      </div>

      {deleteOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" data-testid="ticket-detail-delete-overlay">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" data-testid="ticket-detail-delete-modal">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Delete Ticket</h2>
            <p className="text-sm text-slate-500 mb-6">Delete ticket #{ticket.id}? This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button data-testid="ticket-detail-delete-cancel-btn" onClick={() => setDeleteOpen(false)}
                className="px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
              <button data-testid="ticket-detail-delete-confirm-btn" onClick={confirmDelete}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
