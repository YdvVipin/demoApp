import { useState } from 'react'

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

const initialOrders = [
  { id: 1001, customer: 'Alice Johnson', email: 'alice@example.com', amount: 1299.99, status: 'Delivered', date: '2024-05-01', items: 1 },
  { id: 1002, customer: 'Bob Smith', email: 'bob@example.com', amount: 239.98, status: 'Shipped', date: '2024-05-05', items: 2 },
  { id: 1003, customer: 'Carol White', email: 'carol@example.com', amount: 49.99, status: 'Processing', date: '2024-05-10', items: 1 },
  { id: 1004, customer: 'David Brown', email: 'david@example.com', amount: 429.98, status: 'Pending', date: '2024-05-12', items: 3 },
  { id: 1005, customer: 'Eva Martinez', email: 'eva@example.com', amount: 89.99, status: 'Cancelled', date: '2024-05-13', items: 1 },
  { id: 1006, customer: 'Frank Lee', email: 'frank@example.com', amount: 349.99, status: 'Shipped', date: '2024-05-14', items: 1 },
]

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-indigo-100 text-indigo-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
}

export default function Orders() {
  const [orders, setOrders] = useState(initialOrders)
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [detailOrder, setDetailOrder] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'All' || o.status === statusFilter
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) ||
      String(o.id).includes(search)
    return matchStatus && matchSearch
  })

  function updateStatus(orderId, newStatus) {
    setOrders(os => os.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    flash(`Order #${orderId} status updated to "${newStatus}".`)
  }

  function flash(msg) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const totalRevenue = filtered.reduce((s, o) => o.status !== 'Cancelled' ? s + o.amount : s, 0)

  return (
    <div data-testid="orders-page">
      {/* Header */}
      <div className="mb-6" data-testid="orders-header">
        <h1 className="text-2xl font-bold text-slate-800" data-testid="orders-title">Order Management</h1>
        <p className="text-slate-500 text-sm" data-testid="orders-subtitle">Track and update customer orders</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6" data-testid="orders-summary-grid">
        {ORDER_STATUSES.slice(0, 4).map(s => (
          <div key={s} data-testid={`orders-summary-${s.toLowerCase()}`} className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-xs text-slate-500 mb-1" data-testid={`orders-summary-label-${s.toLowerCase()}`}>{s}</p>
            <p className="text-2xl font-bold text-slate-800" data-testid={`orders-summary-count-${s.toLowerCase()}`}>
              {orders.filter(o => o.status === s).length}
            </p>
          </div>
        ))}
      </div>

      {successMsg && (
        <div data-testid="orders-success-msg" className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">
          {successMsg}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center" data-testid="orders-filters">
        <input
          type="text"
          data-testid="orders-search-input"
          placeholder="Search by customer name or order ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <select
          data-testid="orders-status-filter"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="All">All Statuses</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="text-sm text-slate-500 ml-auto" data-testid="orders-revenue-display">
          Revenue: <strong data-testid="orders-revenue-value">${totalRevenue.toFixed(2)}</strong>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden" data-testid="orders-table-card">
        <div className="overflow-x-auto" data-testid="orders-table-wrapper">
          <table className="w-full text-sm" data-testid="orders-table">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 text-slate-600 font-medium" data-testid="orders-col-id">Order ID</th>
                <th className="text-left py-3 px-4 text-slate-600 font-medium" data-testid="orders-col-customer">Customer</th>
                <th className="text-left py-3 px-4 text-slate-600 font-medium" data-testid="orders-col-items">Items</th>
                <th className="text-left py-3 px-4 text-slate-600 font-medium" data-testid="orders-col-amount">Amount</th>
                <th className="text-left py-3 px-4 text-slate-600 font-medium" data-testid="orders-col-date">Date</th>
                <th className="text-left py-3 px-4 text-slate-600 font-medium" data-testid="orders-col-status">Status</th>
                <th className="text-left py-3 px-4 text-slate-600 font-medium" data-testid="orders-col-actions">Actions</th>
              </tr>
            </thead>
            <tbody data-testid="orders-table-body">
              {filtered.length === 0 ? (
                <tr data-testid="orders-empty-row">
                  <td colSpan={7} className="text-center py-8 text-slate-400" data-testid="orders-empty-msg">No orders found.</td>
                </tr>
              ) : filtered.map(order => (
                <tr key={order.id} data-testid={`orders-row-${order.id}`} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-medium text-slate-700" data-testid={`orders-id-${order.id}`}>#{order.id}</td>
                  <td className="py-3 px-4" data-testid={`orders-customer-${order.id}`}>
                    <p className="font-medium text-slate-800" data-testid={`orders-customer-name-${order.id}`}>{order.customer}</p>
                    <p className="text-xs text-slate-400" data-testid={`orders-customer-email-${order.id}`}>{order.email}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600" data-testid={`orders-items-${order.id}`}>{order.items}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800" data-testid={`orders-amount-${order.id}`}>${order.amount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-slate-400" data-testid={`orders-date-${order.id}`}>{order.date}</td>
                  <td className="py-3 px-4" data-testid={`orders-status-cell-${order.id}`}>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[order.status]}`} data-testid={`orders-status-badge-${order.id}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4" data-testid={`orders-actions-${order.id}`}>
                    <div className="flex gap-2 items-center flex-wrap">
                      <select
                        data-testid={`orders-status-select-${order.id}`}
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        className="border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
                      >
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button
                        data-testid={`orders-view-btn-${order.id}`}
                        onClick={() => setDetailOrder(order)}
                        className="text-xs border border-slate-300 px-2 py-1 rounded text-slate-600 hover:bg-slate-50"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 text-xs text-slate-400 border-t border-slate-100" data-testid="orders-table-footer">
          {filtered.length} order{filtered.length !== 1 ? 's' : ''} shown
        </div>
      </div>

      {/* Order Detail Drawer */}
      {detailOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-end z-50" data-testid="orders-detail-overlay">
          <div className="bg-white h-full w-full max-w-sm shadow-2xl p-6 overflow-y-auto" data-testid="orders-detail-panel">
            <div className="flex items-center justify-between mb-6" data-testid="orders-detail-header">
              <h2 className="text-lg font-bold text-slate-800" data-testid="orders-detail-title">Order #{detailOrder.id}</h2>
              <button data-testid="orders-detail-close-btn" onClick={() => setDetailOrder(null)} className="text-slate-400 hover:text-slate-700 text-xl">✕</button>
            </div>
            <div className="space-y-4 text-sm" data-testid="orders-detail-body">
              <div data-testid="orders-detail-customer">
                <p className="text-xs text-slate-500 font-medium mb-1">Customer</p>
                <p className="font-medium text-slate-800" data-testid="orders-detail-customer-name">{detailOrder.customer}</p>
                <p className="text-slate-500" data-testid="orders-detail-customer-email">{detailOrder.email}</p>
              </div>
              <div data-testid="orders-detail-info">
                <p className="text-xs text-slate-500 font-medium mb-1">Order Info</p>
                <div className="grid grid-cols-2 gap-2">
                  <div data-testid="orders-detail-amount">
                    <p className="text-xs text-slate-400">Amount</p>
                    <p className="font-semibold text-slate-800" data-testid="orders-detail-amount-value">${detailOrder.amount.toFixed(2)}</p>
                  </div>
                  <div data-testid="orders-detail-items">
                    <p className="text-xs text-slate-400">Items</p>
                    <p className="font-semibold text-slate-800" data-testid="orders-detail-items-value">{detailOrder.items}</p>
                  </div>
                  <div data-testid="orders-detail-date">
                    <p className="text-xs text-slate-400">Date</p>
                    <p className="font-semibold text-slate-800" data-testid="orders-detail-date-value">{detailOrder.date}</p>
                  </div>
                  <div data-testid="orders-detail-status">
                    <p className="text-xs text-slate-400">Status</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[detailOrder.status]}`} data-testid="orders-detail-status-badge">
                      {detailOrder.status}
                    </span>
                  </div>
                </div>
              </div>
              <div data-testid="orders-detail-update-status">
                <p className="text-xs text-slate-500 font-medium mb-2">Update Status</p>
                <div className="flex flex-col gap-2" data-testid="orders-detail-status-options">
                  {ORDER_STATUSES.map(s => (
                    <button
                      key={s}
                      data-testid={`orders-detail-status-btn-${s.toLowerCase()}`}
                      onClick={() => { updateStatus(detailOrder.id, s); setDetailOrder(o => ({ ...o, status: s })) }}
                      className={`text-sm px-3 py-2 rounded-lg border text-left transition-colors ${detailOrder.status === s ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
