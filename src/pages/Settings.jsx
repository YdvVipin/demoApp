import { useState } from 'react'

const THEMES = ['Light', 'Dark', 'System']
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Japanese']
const TIMEZONES = ['UTC', 'US/Eastern', 'US/Pacific', 'Europe/London', 'Asia/Tokyo']

export default function Settings({ user }) {
  const [activeTab, setActiveTab] = useState('profile')

  // Profile
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || 'admin@example.com',
    phone: '+1 555-0100',
    bio: 'QA Automation Specialist',
    jobTitle: 'Senior QA Engineer',
    department: 'Engineering',
  })
  const [profileSaved, setProfileSaved] = useState(false)

  // Notifications
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    orderUpdates: true,
    userSignups: true,
    systemAlerts: true,
    weeklyReport: false,
    monthlyReport: true,
  })

  // Preferences
  const [preferences, setPreferences] = useState({
    theme: 'Light',
    language: 'English',
    timezone: 'UTC',
    compactMode: false,
    autoSave: true,
  })

  // Password
  const [password, setPassword] = useState({ current: '', newPass: '', confirm: '' })
  const [passwordMsg, setPasswordMsg] = useState('')

  function saveProfile(e) {
    e.preventDefault()
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
  }

  function handleProfileChange(e) {
    const { name, value } = e.target
    setProfile(p => ({ ...p, [name]: value }))
  }

  function handleNotificationToggle(key) {
    setNotifications(n => ({ ...n, [key]: !n[key] }))
  }

  function handlePreferenceChange(e) {
    const { name, value, type, checked } = e.target
    setPreferences(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  function savePassword(e) {
    e.preventDefault()
    if (!password.current) return setPasswordMsg('Please enter your current password.')
    if (password.newPass.length < 6) return setPasswordMsg('New password must be at least 6 characters.')
    if (password.newPass !== password.confirm) return setPasswordMsg('Passwords do not match.')
    setPasswordMsg('Password updated successfully.')
    setPassword({ current: '', newPass: '', confirm: '' })
    setTimeout(() => setPasswordMsg(''), 3000)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'preferences', label: 'Preferences', icon: '🎨' },
    { id: 'security', label: 'Security', icon: '🔒' },
  ]

  return (
    <div data-testid="settings-page">
      <div className="mb-6" data-testid="settings-header">
        <h1 className="text-2xl font-bold text-slate-800" data-testid="settings-title">Settings</h1>
        <p className="text-slate-500 text-sm" data-testid="settings-subtitle">Manage your account and application preferences</p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar tabs */}
        <div className="lg:w-48 flex-shrink-0" data-testid="settings-tabs">
          <div className="bg-white rounded-xl shadow-sm p-2 flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                data-testid={`settings-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1" data-testid="settings-content">

          {/* Profile tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm p-6" data-testid="settings-profile-panel">
              <h2 className="text-base font-semibold text-slate-700 mb-5" data-testid="settings-profile-title">Profile Information</h2>

              {profileSaved && (
                <div data-testid="settings-profile-success" className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">
                  Profile saved successfully.
                </div>
              )}

              <form onSubmit={saveProfile} data-testid="settings-profile-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div data-testid="settings-form-name-group">
                    <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="settings-form-name-label">Full Name</label>
                    <input type="text" name="name" data-testid="settings-form-name-input" value={profile.name} onChange={handleProfileChange} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div data-testid="settings-form-email-group">
                    <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="settings-form-email-label">Email</label>
                    <input type="email" name="email" data-testid="settings-form-email-input" value={profile.email} onChange={handleProfileChange} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div data-testid="settings-form-phone-group">
                    <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="settings-form-phone-label">Phone</label>
                    <input type="tel" name="phone" data-testid="settings-form-phone-input" value={profile.phone} onChange={handleProfileChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div data-testid="settings-form-jobtitle-group">
                    <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="settings-form-jobtitle-label">Job Title</label>
                    <input type="text" name="jobTitle" data-testid="settings-form-jobtitle-input" value={profile.jobTitle} onChange={handleProfileChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div data-testid="settings-form-department-group">
                    <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="settings-form-department-label">Department</label>
                    <input type="text" name="department" data-testid="settings-form-department-input" value={profile.department} onChange={handleProfileChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div className="sm:col-span-2" data-testid="settings-form-bio-group">
                    <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="settings-form-bio-label">Bio</label>
                    <textarea name="bio" data-testid="settings-form-bio-textarea" value={profile.bio} onChange={handleProfileChange} rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
                  </div>
                </div>
                <div className="flex gap-3" data-testid="settings-profile-actions">
                  <button type="submit" data-testid="settings-profile-save-btn" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-lg">Save Changes</button>
                  <button type="reset" data-testid="settings-profile-reset-btn" className="border border-slate-300 text-slate-600 text-sm px-5 py-2 rounded-lg hover:bg-slate-50">Reset</button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl shadow-sm p-6" data-testid="settings-notifications-panel">
              <h2 className="text-base font-semibold text-slate-700 mb-5" data-testid="settings-notifications-title">Notification Preferences</h2>
              <div className="space-y-4" data-testid="settings-notifications-list">
                {Object.entries({
                  emailAlerts: 'Email Alerts',
                  smsAlerts: 'SMS Alerts',
                  orderUpdates: 'Order Updates',
                  userSignups: 'New User Signups',
                  systemAlerts: 'System Alerts',
                  weeklyReport: 'Weekly Report',
                  monthlyReport: 'Monthly Report',
                }).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between py-3 border-b border-slate-100 cursor-pointer"
                    data-testid={`settings-notification-row-${key}`}
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-700" data-testid={`settings-notification-label-${key}`}>{label}</p>
                    </div>
                    <div
                      data-testid={`settings-notification-toggle-${key}`}
                      onClick={() => handleNotificationToggle(key)}
                      className={`relative w-10 h-6 rounded-full cursor-pointer transition-colors ${notifications[key] ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifications[key] ? 'left-5' : 'left-1'}`}
                        data-testid={`settings-notification-indicator-${key}`}
                      />
                    </div>
                  </label>
                ))}
              </div>
              <button
                data-testid="settings-notifications-save-btn"
                className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-lg"
                onClick={() => alert('Notification preferences saved.')}
              >
                Save Preferences
              </button>
            </div>
          )}

          {/* Preferences tab */}
          {activeTab === 'preferences' && (
            <div className="bg-white rounded-xl shadow-sm p-6" data-testid="settings-preferences-panel">
              <h2 className="text-base font-semibold text-slate-700 mb-5" data-testid="settings-preferences-title">Application Preferences</h2>
              <div className="space-y-5" data-testid="settings-preferences-form">
                {/* Theme */}
                <div data-testid="settings-pref-theme-group">
                  <p className="text-sm font-medium text-slate-700 mb-2" data-testid="settings-pref-theme-label">Theme</p>
                  <div className="flex gap-3 flex-wrap" data-testid="settings-pref-theme-options">
                    {THEMES.map(t => (
                      <label key={t} className="flex items-center gap-2 text-sm cursor-pointer" data-testid={`settings-pref-theme-option-${t.toLowerCase()}`}>
                        <input
                          type="radio"
                          name="theme"
                          data-testid={`settings-pref-theme-radio-${t.toLowerCase()}`}
                          value={t}
                          checked={preferences.theme === t}
                          onChange={handlePreferenceChange}
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div data-testid="settings-pref-language-group">
                  <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="settings-pref-language-label">Language</label>
                  <select name="language" data-testid="settings-pref-language-select" value={preferences.language} onChange={handlePreferenceChange} className="w-full max-w-xs border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                {/* Timezone */}
                <div data-testid="settings-pref-timezone-group">
                  <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="settings-pref-timezone-label">Timezone</label>
                  <select name="timezone" data-testid="settings-pref-timezone-select" value={preferences.timezone} onChange={handlePreferenceChange} className="w-full max-w-xs border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    {TIMEZONES.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>

                {/* Toggles */}
                <div className="flex flex-col gap-3" data-testid="settings-pref-toggles">
                  <label className="flex items-center gap-3 text-sm cursor-pointer" data-testid="settings-pref-compact-label">
                    <input type="checkbox" name="compactMode" data-testid="settings-pref-compact-checkbox" checked={preferences.compactMode} onChange={handlePreferenceChange} className="rounded" />
                    <span>Compact Mode</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm cursor-pointer" data-testid="settings-pref-autosave-label">
                    <input type="checkbox" name="autoSave" data-testid="settings-pref-autosave-checkbox" checked={preferences.autoSave} onChange={handlePreferenceChange} className="rounded" />
                    <span>Auto-save forms</span>
                  </label>
                </div>

                <button
                  data-testid="settings-preferences-save-btn"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-lg"
                  onClick={() => alert('Preferences saved.')}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Security tab */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-xl shadow-sm p-6" data-testid="settings-security-panel">
              <h2 className="text-base font-semibold text-slate-700 mb-5" data-testid="settings-security-title">Change Password</h2>

              {passwordMsg && (
                <div
                  data-testid="settings-password-msg"
                  className={`rounded-lg px-4 py-3 text-sm mb-4 ${passwordMsg.includes('success') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}
                >
                  {passwordMsg}
                </div>
              )}

              <form onSubmit={savePassword} data-testid="settings-password-form" className="max-w-sm">
                <div className="mb-4" data-testid="settings-password-current-group">
                  <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="settings-password-current-label">Current Password</label>
                  <input type="password" data-testid="settings-password-current-input" value={password.current} onChange={e => setPassword(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div className="mb-4" data-testid="settings-password-new-group">
                  <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="settings-password-new-label">New Password</label>
                  <input type="password" data-testid="settings-password-new-input" value={password.newPass} onChange={e => setPassword(p => ({ ...p, newPass: e.target.value }))} placeholder="••••••••" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div className="mb-6" data-testid="settings-password-confirm-group">
                  <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="settings-password-confirm-label">Confirm New Password</label>
                  <input type="password" data-testid="settings-password-confirm-input" value={password.confirm} onChange={e => setPassword(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div className="flex gap-3" data-testid="settings-password-actions">
                  <button type="submit" data-testid="settings-password-save-btn" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-lg">Update Password</button>
                  <button type="reset" data-testid="settings-password-reset-btn" onClick={() => setPassword({ current: '', newPass: '', confirm: '' })} className="border border-slate-300 text-slate-600 text-sm px-5 py-2 rounded-lg hover:bg-slate-50">Clear</button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
