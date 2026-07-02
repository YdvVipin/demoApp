import { useMemo, useState } from 'react'
import BarChart from '../components/ui/BarChart'
import { useToast } from '../components/ui/toast-context'

const DATE_RANGES = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'This year']

// Revenue datasets keyed by selected range — switching the range re-renders the chart.
const revenueByRange = {
  'Last 7 days': [
    { label: 'Mon', value: 4200 }, { label: 'Tue', value: 3800 }, { label: 'Wed', value: 5100 },
    { label: 'Thu', value: 4700 }, { label: 'Fri', value: 6200 }, { label: 'Sat', value: 7100 }, { label: 'Sun', value: 5600 },
  ],
  'Last 30 days': [
    { label: 'W1', value: 28400 }, { label: 'W2', value: 31200 }, { label: 'W3', value: 26800 }, { label: 'W4', value: 35600 },
  ],
  'Last 90 days': [
    { label: 'Jan', value: 92000 }, { label: 'Feb', value: 84500 }, { label: 'Mar', value: 101200 },
  ],
  'This year': [
    { label: 'Q1', value: 277700 }, { label: 'Q2', value: 312400 }, { label: 'Q3', value: 298100 }, { label: 'Q4', value: 341900 },
  ],
}

const kpisByRange = {
  'Last 7 days': { revenue: 36700, orders: 142, conversion: 3.4, aov: 258.45 },
  'Last 30 days': { revenue: 122000, orders: 512, conversion: 3.8, aov: 238.28 },
  'Last 90 days': { revenue: 277700, orders: 1284, conversion: 4.1, aov: 216.28 },
  'This year': { revenue: 1230100, orders: 5421, conversion: 4.3, aov: 226.92 },
}

const categoryBreakdown = [
  { label: 'Electronics', value: 48 },
  { label: 'Sports', value: 22 },
  { label: 'Books', value: 14 },
  { label: 'Clothing', value: 9 },
  { label: 'Home', value: 7 },
]

const topProducts = [
  { id: 1, name: 'Laptop Pro 15', units: 312, revenue: 405596, trend: 'up' },
  { id: 2, name: 'Wireless Headphones', units: 845, revenue: 168991, trend: 'up' },
  { id: 3, name: 'Smart Watch Ultra', units: 298, revenue: 104297, trend: 'down' },
  { id: 4, name: 'Running Shoes X', units: 521, revenue: 46885, trend: 'up' },
  { id: 5, name: 'Python Cookbook', units: 410, revenue: 16396, trend: 'flat' },
]

const trendIcon = { up: '▲', down: '▼', flat: '▬' }
const trendColor = { up: 'text-green-600', down: 'text-red-600', flat: 'text-slate-400' }

export default function Analytics() {
  const [range, setRange] = useState('Last 7 days')
  const [refreshing, setRefreshing] = useState(false)
  const { notify } = useToast()

  const kpis = kpisByRange[range]
  const revenueData = revenueByRange[range]
  const maxCategory = useMemo(() => Math.max(...categoryBreakdown.map(c => c.value)), [])

  function handleRefresh() {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      notify('Analytics data refreshed.', 'success')
    }, 800)
  }

  function exportCsv() {
    const rows = [
      ['Product', 'Units Sold', 'Revenue'],
      ...topProducts.map(p => [p.name, p.units, p.revenue]),
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${range.replace(/\s+/g, '-').toLowerCase()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    notify('Report exported as CSV.', 'info')
  }

  const kpiCards = [
    { label: 'Total Revenue', value: `$${kpis.revenue.toLocaleString()}`, sub: '+18% vs prev', color: 'text-purple-600', testId: 'kpi-revenue' },
    { label: 'Orders', value: kpis.orders.toLocaleString(), sub: '+12% vs prev', color: 'text-orange-600', testId: 'kpi-orders' },
    { label: 'Conversion Rate', value: `${kpis.conversion}%`, sub: '+0.4pt vs prev', color: 'text-blue-600', testId: 'kpi-conversion' },
    { label: 'Avg Order Value', value: `$${kpis.aov.toFixed(2)}`, sub: '-2% vs prev', color: 'text-green-600', testId: 'kpi-aov' },
  ]

  return (
    <div data-testid="analytics-page">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6" data-testid="analytics-header">
        <div>
          <h1 className="text-2xl font-bold text-slate-800" data-testid="analytics-title">Analytics &amp; Reports</h1>
          <p className="text-slate-500 text-sm" data-testid="analytics-subtitle">Track performance across your store</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            data-testid="analytics-range-select"
            value={range}
            onChange={e => setRange(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {DATE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <button
            data-testid="analytics-refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            {refreshing ? 'Refreshing…' : '↻ Refresh'}
          </button>
          <button
            data-testid="analytics-export-btn"
            onClick={exportCsv}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            ⬇ Export CSV
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" data-testid="analytics-kpi-grid">
        {kpiCards.map(k => (
          <div key={k.testId} data-testid={k.testId} className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-xs text-slate-500 font-medium mb-1" data-testid={`${k.testId}-label`}>{k.label}</p>
            <p className={`text-2xl font-bold ${k.color}`} data-testid={`${k.testId}-value`}>{k.value}</p>
            <p className="text-xs text-slate-400 mt-1" data-testid={`${k.testId}-sub`}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5" data-testid="analytics-revenue-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-slate-700" data-testid="analytics-revenue-title">Revenue Over Time</h2>
            <span className="text-xs text-slate-400" data-testid="analytics-revenue-range-label">{range}</span>
          </div>
          <BarChart data={revenueData} color="bg-indigo-500" valuePrefix="$" testId="analytics-revenue-chart" />
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-5" data-testid="analytics-category-card">
          <h2 className="text-base font-semibold text-slate-700 mb-4" data-testid="analytics-category-title">Sales by Category</h2>
          <div className="space-y-3" data-testid="analytics-category-list">
            {categoryBreakdown.map(c => (
              <div key={c.label} data-testid={`analytics-category-${c.label.toLowerCase()}`}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">{c.label}</span>
                  <span className="text-slate-400" data-testid={`analytics-category-value-${c.label.toLowerCase()}`}>{c.value}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((c.value / maxCategory) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top products table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden" data-testid="analytics-top-products-card">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-700" data-testid="analytics-top-products-title">Top Performing Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="analytics-top-products-table">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-5 text-slate-600 font-medium">#</th>
                <th className="text-left py-3 px-5 text-slate-600 font-medium">Product</th>
                <th className="text-right py-3 px-5 text-slate-600 font-medium">Units Sold</th>
                <th className="text-right py-3 px-5 text-slate-600 font-medium">Revenue</th>
                <th className="text-center py-3 px-5 text-slate-600 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody data-testid="analytics-top-products-body">
              {topProducts.map((p, i) => (
                <tr key={p.id} data-testid={`analytics-product-row-${p.id}`} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-5 text-slate-400 font-mono">{i + 1}</td>
                  <td className="py-3 px-5 font-medium text-slate-800" data-testid={`analytics-product-name-${p.id}`}>{p.name}</td>
                  <td className="py-3 px-5 text-right text-slate-600" data-testid={`analytics-product-units-${p.id}`}>{p.units.toLocaleString()}</td>
                  <td className="py-3 px-5 text-right font-semibold text-slate-800" data-testid={`analytics-product-revenue-${p.id}`}>${p.revenue.toLocaleString()}</td>
                  <td className={`py-3 px-5 text-center font-bold ${trendColor[p.trend]}`} data-testid={`analytics-product-trend-${p.id}`}>{trendIcon[p.trend]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
