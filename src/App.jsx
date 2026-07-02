import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { ToastProvider } from './components/ui/Toast'
import Login from './pages/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Analytics from './pages/Analytics'
import Tasks from './pages/Tasks'
import Settings from './pages/Settings'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  function handleLogin(user) {
    setCurrentUser(user)
    setIsLoggedIn(true)
  }

  function handleLogout() {
    setCurrentUser(null)
    setIsLoggedIn(false)
  }

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn
                ? <Navigate to="/dashboard" replace />
                : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/"
            element={
              isLoggedIn
                ? <Layout user={currentUser} onLogout={handleLogout} />
                : <Navigate to="/login" replace />
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard user={currentUser} />} />
            <Route path="users" element={<Users />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="tasks" element={<Tasks user={currentUser} />} />
            <Route path="settings" element={<Settings user={currentUser} />} />
          </Route>
          <Route path="*" element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}
