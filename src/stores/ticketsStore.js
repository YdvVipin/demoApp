import { createStore } from './createStore'

const seed = [
  { id: 101, subject: 'Cannot reset my password', requester: 'grace@example.com', priority: 'High', status: 'Open', category: 'Account', created: '2024-06-01',
    replies: [{ id: 1, author: 'Grace Kim', text: 'The reset email never arrives.', time: '2 days ago' }] },
  { id: 102, subject: 'Invoice shows wrong amount', requester: 'henry@example.com', priority: 'Medium', status: 'Pending', category: 'Billing', created: '2024-06-03',
    replies: [{ id: 1, author: 'Henry Ford', text: 'Invoice #INV-2044 is $50 too high.', time: '1 day ago' }] },
  { id: 103, subject: 'Feature request: dark mode', requester: 'ivy@example.com', priority: 'Low', status: 'Open', category: 'Feedback', created: '2024-06-04', replies: [] },
  { id: 104, subject: 'App crashes on export', requester: 'jack@example.com', priority: 'High', status: 'Resolved', category: 'Bug', created: '2024-05-28',
    replies: [{ id: 1, author: 'Jack Reed', text: 'CSV export crashes every time.', time: '5 days ago' }] },
]

export const ticketsStore = createStore(seed)

export const addTicket = (t) =>
  ticketsStore.set(list => [
    { id: Date.now(), status: 'Open', created: new Date().toISOString().split('T')[0], replies: [], ...t },
    ...list,
  ])

export const deleteTicket = (id) =>
  ticketsStore.set(list => list.filter(t => t.id !== id))

export const getTicket = (id) =>
  ticketsStore.get().find(t => String(t.id) === String(id))

export const updateTicket = (id, patch) =>
  ticketsStore.set(list => list.map(t => (String(t.id) === String(id) ? { ...t, ...patch } : t)))

export const addReply = (id, text) =>
  ticketsStore.set(list => list.map(t =>
    String(t.id) === String(id)
      ? { ...t, replies: [...t.replies, { id: Date.now(), author: 'Support Agent', text, time: 'just now' }] }
      : t
  ))
