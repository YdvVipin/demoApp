import { useNavigate } from 'react-router-dom'
import BarChart from '../components/ui/BarChart'

const weeklyRevenue = [
  { label: 'Mon', value: 4200 },
  { label: 'Tue', value: 3800 },
  { label: 'Wed', value: 5100 },
  { label: 'Thu', value: 4700 },
  { label: 'Fri', value: 6200 },
  { label: 'Sat', value: 7100 },
  { label: 'Sun', value: 5600 },
]

const systemStatus = [
  { id: 'api', label: 'API', status: 'Operational', healthy: true },
  { id: 'database', label: 'Database', status: 'Operational', healthy: true },
  { id: 'payments', label: 'Payments', status: 'Operational', healthy: true },
  { id: 'email', label: 'Email Service', status: 'Degraded', healthy: false },
]

const stats = [
  { label: 'Total Users', value: '1,284', change: '+12%', icon: '👥', color: 'bg-blue-500', testId: 'stat-users' },
  { label: 'Products', value: '348', change: '+5%', icon: '📦', color: 'bg-green-500', testId: 'stat-products' },
  { label: 'Orders', value: '92', change: '+23%', icon: '🛒', color: 'bg-orange-500', testId: 'stat-orders' },
  { label: 'Revenue', value: '$48,200', change: '+18%', icon: '💰', color: 'bg-purple-500', testId: 'stat-revenue' },
]

const recentActivity = [
  { id: 1, action: 'New user registered', user: 'alice@example.com', time: '2 min ago', status: 'success' },
  { id: 2, action: 'Order #1042 placed', user: 'bob@example.com', time: '15 min ago', status: 'success' },
  { id: 3, action: 'Product "Laptop Pro" updated', user: 'admin', time: '1 hr ago', status: 'info' },
  { id: 4, action: 'Failed login attempt', user: 'unknown', time: '2 hr ago', status: 'error' },
  { id: 5, action: 'Order #1038 shipped', user: 'carol@example.com', time: '3 hr ago', status: 'success' },
]

const statusColors = {
  success: 'bg-green-100 text-green-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
}

export default function Dashboard({ user }) {
  const navigate = useNavigate()

  return (
    <div data-testid="dashboard-page">
      {/* Header */}
      <div className="mb-6" data-testid="dashboard-header">
        <h1 className="text-2xl font-bold text-slate-800" data-testid="dashboard-title">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1" data-testid="dashboard-welcome">
          Welcome back, <strong>{user?.name}</strong>. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" data-testid="stats-grid">
        {stats.map(stat => (
          <div
            key={stat.testId}
            data-testid={stat.testId}
            className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4"
          >
            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`} data-testid={`${stat.testId}-icon`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium" data-testid={`${stat.testId}-label`}>{stat.label}</p>
              <p className="text-xl font-bold text-slate-800" data-testid={`${stat.testId}-value`}>{stat.value}</p>
              <p className="text-xs text-green-600 font-medium" data-testid={`${stat.testId}-change`}>{stat.change} this month</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6" data-testid="quick-actions-card">
        <h2 className="text-base font-semibold text-slate-700 mb-4" data-testid="quick-actions-title">Quick Actions</h2>
        <div className="flex flex-wrap gap-3" data-testid="quick-actions-list">
          <button
            data-testid="quick-action-add-user"
            onClick={() => navigate('/users')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add User
          </button>
          <button
            data-testid="quick-action-add-product"
            onClick={() => navigate('/products')}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add Product
          </button>
          <button
            data-testid="quick-action-view-orders"
            onClick={() => navigate('/orders')}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            View Orders
          </button>
          <button
            data-testid="quick-action-settings"
            onClick={() => navigate('/settings')}
            className="bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Settings
          </button>
        </div>
      </div>

      {/* Revenue chart + System status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5" data-testid="dashboard-revenue-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-slate-700" data-testid="dashboard-revenue-title">Weekly Revenue</h2>
            <button
              data-testid="dashboard-revenue-details-btn"
              onClick={() => navigate('/analytics')}
              className="text-indigo-600 text-sm hover:underline"
            >
              Full report
            </button>
          </div>
          <BarChart data={weeklyRevenue} color="bg-purple-500" valuePrefix="$" testId="dashboard-revenue-chart" />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5" data-testid="dashboard-system-status-card">
          <h2 className="text-base font-semibold text-slate-700 mb-4" data-testid="dashboard-system-status-title">System Status</h2>
          <div className="space-y-3" data-testid="dashboard-system-status-list">
            {systemStatus.map(s => (
              <div key={s.id} data-testid={`system-status-${s.id}`} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{s.label}</span>
                <span className="flex items-center gap-2 text-xs font-medium" data-testid={`system-status-value-${s.id}`}>
                  <span className={`w-2 h-2 rounded-full ${s.healthy ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className={s.healthy ? 'text-green-600' : 'text-yellow-600'}>{s.status}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-5" data-testid="recent-activity-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-700" data-testid="activity-title">Recent Activity</h2>
          <button
            data-testid="activity-view-all-btn"
            className="text-indigo-600 text-sm hover:underline"
            onClick={() => navigate('/orders')}
          >
            View all
          </button>
        </div>

        <div className="overflow-x-auto" data-testid="activity-table-wrapper">
          <table className="w-full text-sm" data-testid="activity-table">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 px-3 text-slate-500 font-medium" data-testid="activity-col-action">Action</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium" data-testid="activity-col-user">User</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium" data-testid="activity-col-time">Time</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium" data-testid="activity-col-status">Status</th>
              </tr>
            </thead>
            <tbody data-testid="activity-table-body">
              {recentActivity.map(row => (
                <tr key={row.id} data-testid={`activity-row-${row.id}`} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-2.5 px-3 text-slate-700" data-testid={`activity-action-${row.id}`}>{row.action}</td>
                  <td className="py-2.5 px-3 text-slate-500" data-testid={`activity-user-${row.id}`}>{row.user}</td>
                  <td className="py-2.5 px-3 text-slate-400" data-testid={`activity-time-${row.id}`}>{row.time}</td>
                  <td className="py-2.5 px-3" data-testid={`activity-status-${row.id}`}>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
