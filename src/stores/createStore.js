import { useReducer, useEffect } from 'react'

// Minimal module-level store so a list page and its detail page stay in sync
// (e.g. deleting on a detail page reflects when you navigate back). State lives
// for the browser session and resets on a full reload — keeping every recorded
// flow deterministic, just like the rest of the demo app.
export function createStore(initial) {
  let state = initial
  const listeners = new Set()

  const get = () => state
  const set = (updater) => {
    state = typeof updater === 'function' ? updater(state) : updater
    listeners.forEach(l => l())
  }
  const use = () => {
    const [, force] = useReducer(x => x + 1, 0)
    useEffect(() => {
      listeners.add(force)
      return () => listeners.delete(force)
    }, [])
    return state
  }

  return { get, set, use }
}
