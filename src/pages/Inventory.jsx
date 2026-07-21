import { useState } from 'react'

const CATEGORIES = ['Electronics', 'Apparel', 'Home', 'Sports']
const LOW_STOCK = 5

const seed = [
  { id: 1, sku: 'ELEC-001', name: 'Wireless Mouse', category: 'Electronics', qty: 24, price: 29 },
  { id: 2, sku: 'ELEC-002', name: 'USB-C Hub', category: 'Electronics', qty: 3, price: 45 },
  { id: 3, sku: 'APP-014', name: 'Cotton T-Shirt', category: 'Apparel', qty: 60, price: 18 },
  { id: 4, sku: 'HOME-007', name: 'Ceramic Mug', category: 'Home', qty: 2, price: 12 },
  { id: 5, sku: 'SPRT-021', name: 'Yoga Mat Premium', category: 'Sports', qty: 3, price: 39 },
]

const emptyForm = { sku: '', name: '', category: 'Electronics', qty: 1, price: 0 }

export default function Inventory() {
  const [items, setItems] = useState(seed)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [lowOnly, setLowOnly] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [successMsg, setSuccessMsg] = useState('')

  const filtered = items.filter(it => {
    const matchCat = categoryFilter === 'All' || it.category === categoryFilter
    const matchLow = !lowOnly || it.qty <= LOW_STOCK
    return matchCat && matchLow
  })

  function adjustQty(id, delta) {
    setItems(list => list.map(it => it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it))
  }
  function handleFormChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }
  function handleAdd(e) {
    e.preventDefault()
    setItems(list => [...list, { ...form, id: Date.now(), qty: Number(form.qty) || 0, price: Number(form.price) || 0 }])
    setModalOpen(false)
    setForm(emptyForm)
    flash('Inventory item added.')
  }
  function handleDelete(id) {
    setItems(list => list.filter(it => it.id !== id))
    setDeleteId(null)
    flash('Item removed from inventory.')
  }
  function flash(msg) { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000) }

  return (
    <div data-testid="inventory-page">
      <div className="flex items-center justify-between mb-6" data-testid="inventory-header">
        <div>
          <h1 className="text-2xl font-bold text-slate-800" data-testid="inventory-title">Inventory</h1>
          <p className="text-slate-500 text-sm" data-testid="inventory-subtitle">Manage stock levels and items</p>
        </div>
        <button data-testid="inventory-add-btn" onClick={() => { setForm(emptyForm); setModalOpen(true) }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">+ Add Item</button>
      </div>

      {successMsg && (
        <div data-testid="inventory-success-msg" className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">{successMsg}</div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center" data-testid="inventory-filters">
        <select data-testid="inventory-category-filter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer" data-testid="inventory-low-toggle-label">
          <input type="checkbox" data-testid="inventory-low-toggle" checked={lowOnly} onChange={e => setLowOnly(e.target.checked)} />
          Low stock only (≤ {LOW_STOCK})
        </label>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden" data-testid="inventory-table-card">
        <table className="w-full text-sm" data-testid="inventory-table">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-3 px-4 text-slate-600 font-medium">SKU</th>
              <th className="text-left py-3 px-4 text-slate-600 font-medium">Name</th>
              <th className="text-left py-3 px-4 text-slate-600 font-medium">Category</th>
              <th className="text-left py-3 px-4 text-slate-600 font-medium">Price</th>
              <th className="text-left py-3 px-4 text-slate-600 font-medium">Stock</th>
              <th className="text-left py-3 px-4 text-slate-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody data-testid="inventory-table-body">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400" data-testid="inventory-empty">No items match.</td></tr>
            ) : filtered.map(it => (
              <tr key={it.id} data-testid={`inventory-row-${it.id}`} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-slate-400" data-testid={`inventory-sku-${it.id}`}>{it.sku}</td>
                <td className="py-3 px-4 font-medium text-slate-800" data-testid={`inventory-name-${it.id}`}>{it.name}</td>
                <td className="py-3 px-4 text-slate-600">{it.category}</td>
                <td className="py-3 px-4 text-slate-600">${it.price}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button data-testid={`inventory-dec-${it.id}`} onClick={() => adjustQty(it.id, -1)}
                      className="w-6 h-6 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center justify-center">−</button>
                    <span className={`w-10 text-center font-medium ${it.qty <= LOW_STOCK ? 'text-red-600' : 'text-slate-800'}`} data-testid={`inventory-qty-${it.id}`}>{it.qty}</span>
                    <button data-testid={`inventory-inc-${it.id}`} onClick={() => adjustQty(it.id, 1)}
                      className="w-6 h-6 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center justify-center">+</button>
                    {it.qty <= LOW_STOCK && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded" data-testid={`inventory-low-badge-${it.id}`}>LOW</span>}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <button data-testid={`inventory-delete-btn-${it.id}`} onClick={() => setDeleteId(it.id)}
                    className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 rounded border border-red-200 hover:bg-red-50">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 text-xs text-slate-400 border-t border-slate-100" data-testid="inventory-footer">
          Showing {filtered.length} of {items.length} items
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" data-testid="inventory-modal-overlay">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" data-testid="inventory-modal">
            <h2 className="text-lg font-bold text-slate-800 mb-5" data-testid="inventory-modal-title">Add Inventory Item</h2>
            <form onSubmit={handleAdd} data-testid="inventory-modal-form">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                  <input type="text" name="sku" data-testid="inventory-form-sku-input" value={form.sku} onChange={handleFormChange} required placeholder="ABC-001"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select name="category" data-testid="inventory-form-category-select" value={form.category} onChange={handleFormChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                <input type="text" name="name" data-testid="inventory-form-name-input" value={form.name} onChange={handleFormChange} required placeholder="e.g. Wireless Mouse"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Initial Stock</label>
                  <input type="number" name="qty" data-testid="inventory-form-qty-input" value={form.qty} onChange={handleFormChange} min="0"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                  <input type="number" name="price" data-testid="inventory-form-price-input" value={form.price} onChange={handleFormChange} min="0"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" data-testid="inventory-modal-cancel-btn" onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" data-testid="inventory-modal-add-btn"
                  className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" data-testid="inventory-delete-overlay">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" data-testid="inventory-delete-modal">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Delete Item</h2>
            <p className="text-sm text-slate-500 mb-6">Remove this item from inventory? This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button data-testid="inventory-delete-cancel-btn" onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
              <button data-testid="inventory-delete-confirm-btn" onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
