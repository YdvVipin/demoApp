import { createContext, useContext } from 'react'

export const ToastContext = createContext(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    // Fallback keeps components usable outside a provider (e.g. isolated tests).
    return { notify: () => {}, dismiss: () => {} }
  }
  return ctx
}
