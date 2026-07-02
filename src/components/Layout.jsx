import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠', testId: 'nav-dashboard' },
  { path: '/users', label: 'Users', icon: '👥', testId: 'nav-users' },
  { path: '/products', label: 'Products', icon: '📦', testId: 'nav-products' },
  { path: '/orders', label: 'Orders', icon: '🛒', testId: 'nav-orders' },
  { path: '/analytics', label: 'Analytics', icon: '📊', testId: 'nav-analytics' },
  { path: '/tasks', label: 'Tasks', icon: '✅', testId: 'nav-tasks' },
  { path: '/settings', label: 'Settings', icon: '⚙️', testId: 'nav-settings' },
]

// Quick-jump targets for the global search box.
const searchTargets = [
  { label: 'Dashboard', path: '/dashboard', keywords: 'home overview stats' },
  { label: 'Users', path: '/users', keywords: 'people accounts members roles' },
  { label: 'Products', path: '/products', keywords: 'catalog inventory items sku cart' },
  { label: 'Orders', path: '/orders', keywords: 'sales purchases shipments' },
  { label: 'Analytics', path: '/analytics', keywords: 'reports charts revenue metrics' },
  { label: 'Tasks', path: '/tasks', keywords: 'kanban board todo backlog' },
  { label: 'Settings', path: '/settings', keywords: 'profile preferences security password' },
]

const initialNotifications = [
  { id: 1, title: 'New order received', detail: 'Order #1007 placed by Grace Kim', time: '5 min ago', read: false, icon: '🛒' },
  { id: 2, title: 'Low stock warning', detail: '"Yoga Mat Premium" has 3 units left', time: '1 hr ago', read: false, icon: '⚠️' },
  { id: 3, title: 'New user signup', detail: 'henry@example.com joined as Viewer', time: '3 hr ago', read: false, icon: '👤' },
  { id: 4, title: 'Weekly report ready', detail: 'Your analytics digest is available', time: 'Yesterday', read: true, icon: '📊' },
]

export default function Layout({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [bellOpen, setBellOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const bellRef = useRef(null)
  const menuRef = useRef(null)

  const unreadCount = notifications.filter(n => !n.read).length
  const currentNav = navItems.find(n => location.pathname.startsWith(n.path))
  const searchResults = search.trim()
    ? searchTargets.filter(t =>
        t.label.toLowerCase().includes(search.toLowerCase()) ||
        t.keywords.includes(search.toLowerCase())
      )
    : []

  // Close dropdowns on outside click.
  useEffect(() => {
    function onClick(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false)
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function handleLogout() {
    onLogout()
    navigate('/login')
  }

  function goToSearchResult(path) {
    navigate(path)
    setSearch('')
    setSearchFocused(false)
  }

  function markAllRead() {
    setNotifications(ns => ns.map(n => ({ ...n, read: true })))
  }

  function openNotification(id) {
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100" data-testid="app-layout">
      {/* Sidebar */}
      <aside
        data-testid="sidebar"
        className={`${sidebarOpen ? 'w-60' : 'w-16'} flex-shrink-0 bg-slate-900 text-white flex flex-col transition-all duration-300`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700" data-testid="sidebar-logo">
          <span className="text-2xl">🧪</span>
          {sidebarOpen && <span className="font-bold text-lg tracking-wide">QADemo App</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto" data-testid="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              data-testid={item.testId}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-700 p-4">
          <button
            data-testid="sidebar-logout-btn"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded px-2 py-2 transition-colors"
          >
            <span className="text-lg">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm h-14 flex items-center px-4 sm:px-6 gap-3 flex-shrink-0 z-30" data-testid="topbar">
          <button
            data-testid="topbar-toggle-sidebar"
            onClick={() => setSidebarOpen(o => !o)}
            className="text-slate-500 hover:text-slate-800 text-xl"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>

          {/* Global search */}
          <div className="relative w-40 sm:w-72" data-testid="global-search">
            <input
              type="text"
              data-testid="global-search-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              placeholder="Search pages..."
              className="w-full border border-slate-200 bg-slate-50 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden" data-testid="global-search-results">
                {searchResults.map(r => (
                  <button
                    key={r.path}
                    data-testid={`global-search-result-${r.label.toLowerCase()}`}
                    onMouseDown={() => goToSearchResult(r.path)}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="flex-1" />

          {/* Notification bell */}
          <div className="relative" ref={bellRef} data-testid="notification-bell-wrapper">
            <button
              data-testid="notification-bell-btn"
              onClick={() => setBellOpen(o => !o)}
              className="relative text-slate-500 hover:text-slate-800 text-xl px-1"
              aria-label="Notifications"
            >
              🔔
              {unreadCount > 0 && (
                <span
                  data-testid="notification-unread-badge"
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {unreadCount}
                </span>
              )}
            </button>
            {bellOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden" data-testid="notification-dropdown">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <span className="font-semibold text-sm text-slate-700" data-testid="notification-dropdown-title">Notifications</span>
                  <button
                    data-testid="notification-mark-all-read-btn"
                    onClick={markAllRead}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto" data-testid="notification-list">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-slate-400" data-testid="notification-empty">No notifications.</p>
                  ) : notifications.map(n => (
                    <button
                      key={n.id}
                      data-testid={`notification-item-${n.id}`}
                      onClick={() => openNotification(n.id)}
                      className={`w-full text-left flex gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 ${n.read ? '' : 'bg-indigo-50/40'}`}
                    >
                      <span className="text-lg">{n.icon}</span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-medium text-slate-800" data-testid={`notification-title-${n.id}`}>{n.title}</span>
                        <span className="block text-xs text-slate-500 truncate">{n.detail}</span>
                        <span className="block text-[11px] text-slate-400 mt-0.5">{n.time}</span>
                      </span>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" data-testid={`notification-dot-${n.id}`} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative" ref={menuRef} data-testid="topbar-user-info">
            <button
              data-testid="topbar-user-menu-btn"
              onClick={() => setMenuOpen(o => !o)}
              className="flex items-center gap-2 hover:bg-slate-50 rounded-lg px-2 py-1 transition-colors"
            >
              <span className="hidden sm:inline text-sm text-slate-500" data-testid="topbar-greeting">
                Hello, <strong data-testid="topbar-username">{user?.name || 'User'}</strong>
              </span>
              <span
                data-testid="topbar-avatar"
                className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold"
              >
                {(user?.name || 'U')[0].toUpperCase()}
              </span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden" data-testid="topbar-user-dropdown">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-400">{user?.role || 'Member'}</p>
                </div>
                <button
                  data-testid="topbar-menu-profile-btn"
                  onClick={() => { setMenuOpen(false); navigate('/settings') }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  👤 Profile &amp; Settings
                </button>
                <button
                  data-testid="topbar-menu-logout-btn"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-100 px-6 py-2 flex items-center gap-2 text-xs text-slate-400" data-testid="breadcrumb">
          <span>QADemo App</span>
          <span>/</span>
          <span className="text-slate-600 font-medium" data-testid="breadcrumb-current">{currentNav?.label || 'Dashboard'}</span>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6" data-testid="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
