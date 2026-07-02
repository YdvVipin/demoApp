import { useState } from 'react'

const VALID_USERS = [
  { username: 'admin', password: 'admin123', name: 'Admin User', role: 'Admin' },
  { username: 'tester', password: 'test123', name: 'QA Tester', role: 'Tester' },
]

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      const found = VALID_USERS.find(
        u => u.username === username && u.password === password
      )
      if (found) {
        onLogin(found)
      } else {
        setError('Invalid username or password. Try admin / admin123')
      }
      setLoading(false)
    }, 600)
  }

  function fillDemo(account) {
    const u = VALID_USERS.find(v => v.username === account)
    if (u) {
      setUsername(u.username)
      setPassword(u.password)
      setError('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center p-4" data-testid="login-page">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8" data-testid="login-card">
        {/* Logo */}
        <div className="text-center mb-8" data-testid="login-header">
          <div className="text-5xl mb-3">🧪</div>
          <h1 className="text-2xl font-bold text-slate-800" data-testid="login-title">QADemo App</h1>
          <p className="text-slate-500 text-sm mt-1" data-testid="login-subtitle">Sign in to your account</p>
        </div>

        {/* Error */}
        {error && (
          <div
            data-testid="login-error-banner"
            className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} data-testid="login-form" noValidate>
          {/* Username */}
          <div className="mb-4" data-testid="login-username-group">
            <label
              htmlFor="login-username"
              className="block text-sm font-medium text-slate-700 mb-1"
              data-testid="login-username-label"
            >
              Username
            </label>
            <input
              id="login-username"
              data-testid="login-username-input"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              autoComplete="username"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Password */}
          <div className="mb-4" data-testid="login-password-group">
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-slate-700 mb-1"
              data-testid="login-password-label"
            >
              Password
            </label>
            <div className="relative" data-testid="login-password-wrapper">
              <input
                id="login-password"
                data-testid="login-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="button"
                data-testid="login-toggle-password"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot */}
          <div className="flex items-center justify-between mb-6" data-testid="login-options-row">
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer" data-testid="login-remember-label">
              <input
                type="checkbox"
                data-testid="login-remember-checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="rounded"
              />
              Remember me
            </label>
            <button
              type="button"
              data-testid="login-forgot-password-link"
              className="text-sm text-indigo-600 hover:underline"
              onClick={() => alert('Password reset not available in demo.')}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            data-testid="login-submit-btn"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* SSO divider */}
        <div className="flex items-center gap-3 my-5" data-testid="login-sso-divider">
          <span className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400">or continue with</span>
          <span className="flex-1 h-px bg-slate-200" />
        </div>
        <div className="grid grid-cols-2 gap-3" data-testid="login-sso-buttons">
          <button
            type="button"
            data-testid="login-sso-google"
            onClick={() => alert('SSO is not available in demo.')}
            className="flex items-center justify-center gap-2 border border-slate-300 rounded-lg py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            <span>🟢</span> Google
          </button>
          <button
            type="button"
            data-testid="login-sso-github"
            onClick={() => alert('SSO is not available in demo.')}
            className="flex items-center justify-center gap-2 border border-slate-300 rounded-lg py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            <span>🐙</span> GitHub
          </button>
        </div>

        {/* Quick demo account fill */}
        <div className="mt-6 border-t border-slate-100 pt-4" data-testid="login-demo-accounts">
          <p className="text-center text-xs text-slate-400 mb-2" data-testid="login-demo-accounts-label">Quick fill a demo account</p>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              data-testid="login-demo-admin-btn"
              onClick={() => fillDemo('admin')}
              className="text-xs px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            >
              Admin
            </button>
            <button
              type="button"
              data-testid="login-demo-tester-btn"
              onClick={() => fillDemo('tester')}
              className="text-xs px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            >
              Tester
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4" data-testid="login-hint">
          Demo credentials: <strong>admin</strong> / <strong>admin123</strong>
        </p>
      </div>
    </div>
  )
}
