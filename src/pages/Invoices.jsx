import { useState } from 'react'

const seed = [
  { id: 'INV-2041', client: 'Acme Corp', status: 'Paid', total: 4800, due: '2024-06-15', items: [{ desc: 'Design retainer', qty: 1, price: 4800 }] },
  { id: 'INV-2042', client: 'Globex', status: 'Sent', total: 3200, due: '2024-06-20', items: [{ desc: 'API integration', qty: 8, price: 400 }] },
  { id: 'INV-2043', client: 'Initech', status: 'Overdue', total: 1500, due: '2024-05-30', items: [{ desc: 'Support hours', qty: 10, price: 150 }] },
]

const statusColors = {
  Paid: 'bg-green-100 text-green-700',
  Sent: 'bg-blue-100 text-blue-700',
  Draft: 'bg-slate-100 text-slate-600',
  Overdue: 'bg-red-100 text-red-700',
}

const blankItem = () => ({ desc: '', qty: 1, price: 0 })

export default function Invoices() {
  const [invoices, setInvoices] = useState(seed)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [client, setClient] = useState('')
  const [due, setDue] = useState('')
  const [items, setItems] = useState([blankItem()])

  const draftTotal = items.reduce((sum, it) => sum + (Number(it.qty) || 0) * (Number(it.price) || 0), 0)

  function openModal() {
    setClient(''); setDue(''); setItems([blankItem()]); setModalOpen(true)
  }
  function updateItem(idx, field, value) {
    setItems(its => its.map((it, i) => (i === idx ? { ...it, [field]: value } : it)))
  }
  function addItem() { setItems(its => [...its, blankItem()]) }
  function removeItem(idx) { setItems(its => its.length > 1 ? its.filter((_, i) => i !== idx) : its) }

  function handleCreate(e) {
    e.preventDefault()
    const nextNum = 2044 + invoices.filter(i => i.id.startsWith('INV-20')).length
    setInvoices(list => [
      { id: `INV-${nextNum}`, client, status: 'Draft', total: draftTotal, due, items: items.map(it => ({ ...it, qty: Number(it.qty), price: Number(it.price) })) },
      ...list,
    ])
    setModalOpen(false)
    flash('Invoice created as draft.')
  }
  function markPaid(id) {
    setInvoices(list => list.map(i => i.id === id ? { ...i, status: 'Paid' } : i))
    flash(`${id} marked as paid.`)
  }
  function handleDelete(id) {
    setInvoices(list => list.filter(i => i.id !== id))
    setDeleteId(null)
    flash(`${id} deleted.`)
  }
  function flash(msg) { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000) }

  const outstanding = invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.total, 0)

  return (
    <div data-testid="invoices-page">
      <div className="flex items-center justify-between mb-6" data-testid="invoices-header">
        <div>
          <h1 className="text-2xl font-bold text-slate-800" data-testid="invoices-title">Invoices</h1>
          <p className="text-slate-500 text-sm" data-testid="invoices-subtitle">Create and track billing</p>
        </div>
        <button data-testid="invoices-new-btn" onClick={openModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">+ New Invoice</button>
      </div>

      {successMsg && (
        <div data-testid="invoices-success-msg" className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">{successMsg}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-3 mb-4" data-testid="invoices-stats">
        <Stat label="Total Invoices" value={invoices.length} testId="invoices-stat-count" />
        <Stat label="Outstanding" value={`$${outstanding.toLocaleString()}`} testId="invoices-stat-outstanding" />
        <Stat label="Paid" value={invoices.filter(i => i.status === 'Paid').length} testId="invoices-stat-paid" />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden" data-testid="invoices-table-card">
        <table className="w-full text-sm" data-testid="invoices-table">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-3 px-4 text-slate-600 font-medium">Invoice</th>
              <th className="text-left py-3 px-4 text-slate-600 font-medium">Client</th>
              <th className="text-left py-3 px-4 text-slate-600 font-medium">Total</th>
              <th className="text-left py-3 px-4 text-slate-600 font-medium">Due</th>
              <th className="text-left py-3 px-4 text-slate-600 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-slate-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody data-testid="invoices-table-body">
            {invoices.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400" data-testid="invoices-empty">No invoices.</td></tr>
            ) : invoices.map(inv => (
              <tr key={inv.id} data-testid={`invoices-row-${inv.id}`} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono font-medium text-slate-800" data-testid={`invoices-id-${inv.id}`}>{inv.id}</td>
                <td className="py-3 px-4 text-slate-600">{inv.client}</td>
                <td className="py-3 px-4 text-slate-800 font-medium" data-testid={`invoices-total-${inv.id}`}>${inv.total.toLocaleString()}</td>
                <td className="py-3 px-4 text-slate-400">{inv.due}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[inv.status]}`} data-testid={`invoices-status-${inv.id}`}>{inv.status}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    {inv.status !== 'Paid' && (
                      <button data-testid={`invoices-mark-paid-${inv.id}`} onClick={() => markPaid(inv.id)}
                        className="text-green-700 hover:text-green-900 text-xs font-medium px-2 py-1 rounded border border-green-200 hover:bg-green-50">Mark Paid</button>
                    )}
                    <button data-testid={`invoices-delete-btn-${inv.id}`} onClick={() => setDeleteId(inv.id)}
                      className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 rounded border border-red-200 hover:bg-red-50">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create modal with line items */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" data-testid="invoices-modal-overlay">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" data-testid="invoices-modal">
            <h2 className="text-lg font-bold text-slate-800 mb-5" data-testid="invoices-modal-title">New Invoice</h2>
            <form onSubmit={handleCreate} data-testid="invoices-modal-form">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
                  <input type="text" data-testid="invoices-form-client-input" value={client} onChange={e => setClient(e.target.value)} required placeholder="Client name"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input type="date" data-testid="invoices-form-due-input" value={due} onChange={e => setDue(e.target.value)} required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
              </div>

              <label className="block text-sm font-medium text-slate-700 mb-2">Line Items</label>
              <div className="space-y-2 mb-3" data-testid="invoices-line-items">
                {items.map((it, idx) => (
                  <div key={idx} className="flex gap-2 items-center" data-testid={`invoices-line-item-${idx}`}>
                    <input type="text" data-testid={`invoices-item-desc-${idx}`} value={it.desc} onChange={e => updateItem(idx, 'desc', e.target.value)} required placeholder="Description"
                      className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    <input type="number" data-testid={`invoices-item-qty-${idx}`} value={it.qty} onChange={e => updateItem(idx, 'qty', e.target.value)} min="1" placeholder="Qty"
                      className="w-16 border border-slate-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    <input type="number" data-testid={`invoices-item-price-${idx}`} value={it.price} onChange={e => updateItem(idx, 'price', e.target.value)} min="0" placeholder="Price"
                      className="w-20 border border-slate-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    <button type="button" data-testid={`invoices-remove-item-${idx}`} onClick={() => removeItem(idx)}
                      className="text-red-500 hover:text-red-700 text-lg px-1" aria-label="Remove item">×</button>
                  </div>
                ))}
              </div>
              <button type="button" data-testid="invoices-add-item-btn" onClick={addItem}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium mb-4">+ Add line item</button>

              <div className="flex justify-between items-center border-t border-slate-100 pt-3 mb-6">
                <span className="text-sm text-slate-500">Total</span>
                <span className="text-xl font-bold text-slate-800" data-testid="invoices-draft-total">${draftTotal.toLocaleString()}</span>
              </div>

              <div className="flex gap-3 justify-end">
                <button type="button" data-testid="invoices-modal-cancel-btn" onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" data-testid="invoices-modal-create-btn"
                  className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">Create Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" data-testid="invoices-delete-overlay">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" data-testid="invoices-delete-modal">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Delete Invoice</h2>
            <p className="text-sm text-slate-500 mb-6">Delete {deleteId}? This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button data-testid="invoices-delete-cancel-btn" onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
              <button data-testid="invoices-delete-confirm-btn" onClick={() => handleDelete(deleteId)}
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
