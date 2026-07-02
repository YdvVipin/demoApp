import { useCallback, useState } from 'react'
import { ToastContext } from './toast-context'

const TONE_STYLES = {
  success: 'bg-green-50 border-green-200 text-green-700',
  error: 'bg-red-50 border-red-200 text-red-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
}

const TONE_ICONS = {
  success: '✅',
  error: '⛔',
  info: 'ℹ️',
  warning: '⚠️',
}

let toastSeq = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback(id => {
    setToasts(ts => ts.filter(t => t.id !== id))
  }, [])

  const notify = useCallback((message, tone = 'success', timeout = 3000) => {
    const id = ++toastSeq
    setToasts(ts => [...ts, { id, message, tone }])
    if (timeout > 0) {
      setTimeout(() => {
        setToasts(ts => ts.filter(t => t.id !== id))
      }, timeout)
    }
    return id
  }, [])

  return (
    <ToastContext.Provider value={{ notify, dismiss }}>
      {children}
      <div
        className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]"
        data-testid="toast-container"
      >
        {toasts.map(t => (
          <div
            key={t.id}
            data-testid={`toast-${t.tone}`}
            role="status"
            className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm shadow-md animate-[fadeIn_0.15s_ease-out] ${TONE_STYLES[t.tone] || TONE_STYLES.info}`}
          >
            <span className="leading-none" data-testid="toast-icon">{TONE_ICONS[t.tone] || TONE_ICONS.info}</span>
            <span className="flex-1" data-testid="toast-message">{t.message}</span>
            <button
              data-testid="toast-dismiss-btn"
              onClick={() => dismiss(t.id)}
              className="text-current opacity-50 hover:opacity-100 leading-none"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
